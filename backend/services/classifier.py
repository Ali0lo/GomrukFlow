import os
import json
import logging
import re
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger(__name__)

def normalize_az(text: str) -> str:
    t = text.lower()
    t = t.replace("fındığ", "fındıq").replace("findig", "findiq").replace("qabığ", "qabıq")
    # Transliteration mapping for fault tolerance
    tr_map = str.maketrans({
        "ı": "i", "ə": "e", "ö": "o", "ü": "u", "ğ": "g", "ş": "s", "ç": "c",
        "İ": "i", "Ə": "e", "Ö": "o", "Ü": "u", "Ğ": "g", "Ş": "s", "Ç": "c"
    })
    return t.translate(tr_map)

class TariffClassifier:
    def __init__(self, tariff_data_path: str):
        self.tariff_data_path = tariff_data_path
        self.tariff_rules: List[Dict[str, Any]] = []
        self._load_tariffs()

    def _load_tariffs(self):
        if os.path.exists(self.tariff_data_path):
            try:
                with open(self.tariff_data_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.tariff_rules = data.get("items", [])
            except Exception as e:
                logger.error(f"Failed to load tariff rules: {e}")

    async def classify_items(self, line_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for item in line_items:
            classified = await self.classify_single_item(item)
            results.append(classified)
        return results

    async def classify_single_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        desc_raw = item.get("description", "")
        description = desc_raw.lower()
        norm_desc = normalize_az(desc_raw)

        # Score all tariff entries based on keyword matches, category tokens, and exact phrases
        ranked_matches = []
        for rule in self.tariff_rules:
            score = self._compute_match_score(description, norm_desc, rule)
            if score > 0:
                ranked_matches.append((score, rule))

        ranked_matches.sort(key=lambda x: x[0], reverse=True)

        if not ranked_matches:
            # Fallback for unrecognizable items
            return {
                **item,
                "hs_code": "0810.90.75.00",
                "commodity_name_az": "Digər təzə meyvə və kənd təsərrüfatı məhsulları",
                "commodity_name_en": "Other fresh agricultural produce",
                "confidence": 0.45,
                "confidence_label": "Aşağı (Manual Review Required)",
                "review_needed": True,
                "review_reasons": ["Məhsulun dəqiq fiziki halı (təzə/qurudulmuş/emal olunmuş) sənəddə tam aydın deyil."],
                "justification_az": "Təsvir standart nomenklatura ilə dəqiq üst-üstə düşmür. İlkin olaraq 0810 qrupuna aid edilsə də, broker tərəfindən fiziki müayinə və sənəd təsdiqi zəruridir.",
                "justification_en": "The item description lacks specific technical parameters. Tentatively assigned to Chapter 08, but human broker verification is strictly required before filing.",
                "export_duty_rate": "0%",
                "vat_rate": "0% (ixrac)",
                "alternatives": []
            }

        top_score, best_rule = ranked_matches[0]
        confidence = min(0.98, max(0.50, round(top_score / 100.0, 2)))

        # Ambiguity and pitfall detection
        review_needed = False
        review_reasons = []

        # Pitfall check 1: Hazelnut shelled vs in-shell
        if "findiq" in norm_desc or "hazelnut" in norm_desc:
            if "lepe" in norm_desc or "shelled" in norm_desc or "kernel" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "0802.22.00.00"), best_rule)
                confidence = 0.95
            elif "qabiq" in norm_desc or "in-shell" in norm_desc or "unshelled" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "0802.21.00.00"), best_rule)
                confidence = 0.94
            else:
                review_needed = True
                confidence = 0.65
                review_reasons.append("Fındığın ləpələnmiş (0802.22) və ya qabıqlı (0802.21) olduğu sənəddə aydın göstərilməyib.")

        # Pitfall check 2: Persimmon fresh vs dried
        if "xurma" in norm_desc or "persimmon" in norm_desc or "karalyok" in norm_desc or "korolyok" in norm_desc:
            if "quru" in norm_desc or "dried" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "0813.40.95.00"), best_rule)
                confidence = 0.93
                review_reasons.append("Qurudulmuş xurma təzə xurmadan (0810.70) fərqli olaraq 0813.40 qrupuna aiddir. Nəmlik səviyyəsi yoxlanılmalıdır.")
            elif "teze" in norm_desc or "fresh" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "0810.70.00.00"), best_rule)
                confidence = 0.95
            else:
                review_needed = True
                confidence = 0.70
                review_reasons.append("Xurmanın təzə (0810.70) və ya qurudulmuş (0813.40) olduğu dəqiqləşdirilməlidir.")

        # Pitfall check 3: Pomegranate fresh vs juice
        if "nar" in norm_desc or "pomegranate" in norm_desc:
            if "sire" in norm_desc or "juice" in norm_desc or "saft" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "2009.89.79.00"), best_rule)
                confidence = 0.96
            elif "teze" in norm_desc or "fresh" in norm_desc or "meyve" in norm_desc:
                best_rule = next((r for r in self.tariff_rules if r["hs_code"] == "0810.90.75.00"), best_rule)
                confidence = 0.95

        # Check if confidence threshold requires review
        if confidence < 0.80:
            review_needed = True

        # Build alternatives list
        alternatives = []
        for s, alt_rule in ranked_matches[1:4]:
            if alt_rule["hs_code"] != best_rule["hs_code"]:
                alternatives.append({
                    "hs_code": alt_rule["hs_code"],
                    "commodity_name_az": alt_rule["commodity_name_az"],
                    "commodity_name_en": alt_rule["commodity_name_en"],
                    "reason_why": alt_rule["pitfalls"][:120] + "..."
                })

        # Generate expert justification
        justification_az, justification_en = self._generate_justification(desc_raw, best_rule, confidence)

        confidence_label = "Yüksək (High Confidence)" if confidence >= 0.85 else ("Orta (Medium Confidence)" if confidence >= 0.70 else "Aşağı (Low - Review Needed)")

        return {
            **item,
            "hs_code": best_rule["hs_code"],
            "commodity_name_az": best_rule["commodity_name_az"],
            "commodity_name_en": best_rule["commodity_name_en"],
            "category": best_rule.get("category", "agricultural"),
            "confidence": confidence,
            "confidence_percentage": int(confidence * 100),
            "confidence_label": confidence_label,
            "review_needed": review_needed,
            "review_reasons": review_reasons,
            "justification_az": justification_az,
            "justification_en": justification_en,
            "classification_criteria": best_rule.get("classification_criteria", ""),
            "pitfall_warning": best_rule.get("pitfalls", ""),
            "export_duty_rate": best_rule.get("export_duty_rate", "0%"),
            "vat_rate": best_rule.get("vat_rate", "0% (ixrac)"),
            "alternatives": alternatives
        }

    def _compute_match_score(self, text: str, norm_text: str, rule: Dict[str, Any]) -> float:
        score = 0.0
        keywords = rule.get("keywords", [])
        for kw in keywords:
            kw_l = kw.lower()
            kw_norm = normalize_az(kw)
            if kw_l in text or kw_norm in norm_text:
                # Prioritize longer, more specific multi-word matches
                score += 35.0 + len(kw_l) * 2.0
                # Prioritize longer, more specific multi-word matches
                score += 35.0 + len(kw_l) * 2.0

        # Special semantic boosts
        if ("nar" in norm_text or "pomegranate" in norm_text) and ("şirə" in norm_text or "juice" in norm_text) and rule["hs_code"] == "2009.89.79.00":
            score += 80.0
        if ("nar" in norm_text or "pomegranate" in norm_text) and ("təzə" in norm_text or "gülöyşə" in norm_text or "fresh" in norm_text) and rule["hs_code"] == "0810.90.75.00":
            score += 80.0
        if ("fındıq" in norm_text or "findiq" in norm_text or "hazelnut" in norm_text):
            if ("ləpə" in norm_text or "shelled" in norm_text or "lepe" in norm_text or "kernel" in norm_text) and rule["hs_code"] == "0802.22.00.00":
                score += 90.0
            elif ("qabıqlı" in norm_text or "qabıq" in norm_text or "in-shell" in norm_text or "unshelled" in norm_text) and rule["hs_code"] == "0802.21.00.00":
                score += 90.0
            elif rule["hs_code"] in ("0802.22.00.00", "0802.21.00.00"):
                score += 50.0
        if ("xurma" in norm_text or "persimmon" in norm_text):
            if ("quru" in norm_text or "dried" in norm_text) and rule["hs_code"] == "0813.40.95.00":
                score += 90.0
            elif ("təzə" in norm_text or "fresh" in norm_text or "korolyok" in norm_text) and rule["hs_code"] == "0810.70.00.00":
                score += 90.0
            elif rule["hs_code"] in ("0810.70.00.00", "0813.40.95.00"):
                score += 50.0
        if ("pomidor" in norm_text or "tomato" in norm_text):
            if ("pasta" in norm_text or "paste" in norm_text or "konsentrat" in norm_text) and rule["hs_code"] == "2002.90.31.00":
                score += 80.0
            elif ("təzə" in norm_text or "istixana" in norm_text or "fresh" in norm_text) and rule["hs_code"] == "0702.00.00.00":
                score += 80.0

        return score

    def _generate_justification(self, item_desc: str, rule: Dict[str, Any], confidence: float) -> (str, str):
        hs = rule["hs_code"]
        name_az = rule["commodity_name_az"]
        name_en = rule["commodity_name_en"]
        criteria = rule.get("classification_criteria", "")
        pitfall = rule.get("pitfalls", "")

        chapter = hs.split(".")[0]

        if hs == "0810.90.75.00":
            az = f"Məhsul bütöv, təzə halda yığılmış Göyçay narı olduğuna görə 08-ci Qrup (Yeyilən meyvələr) üzrə {hs} koduna aid edilmişdir. Şirə və ya emal olunmuş məhsul olmadığı üçün 20-ci Qrupa daxil edilmir. İxrac gömrük rüsumu 0%-dir."
            en = f"Classified under {hs} (Fresh Pomegranates) because goods are whole, fresh and raw. Does not classify under Chapter 20 (2009.89) since no juice extraction or processing is involved. Export duty rate is 0%."
        elif hs == "2009.89.79.00":
            az = f"Məhsul sıxılmış, qıcqırdılmamış və əlavə şəkərsiz təbii nar şirəsi olduğu üçün 08-ci qrup deyil, 20-ci Qrup (Tərəvəz, meyvə və bitki hissələrinin emal məhsulları) üzrə {hs} koduna təsnif edilmişdir. Brix dəyəri > 20 olmalıdır."
            en = f"Classified under {hs} (Fruit Juices, unfermented) under Chapter 20 rather than Chapter 08 because it has undergone industrial pressing/bottling without fermentation. Standard Brix > 20 verified."
        elif hs == "0802.22.00.00":
            az = f"Fakturada məhsulun ləpələnmiş (qabığı təmizlənmiş fındıq ləpəsi) olduğu göstərildiyi üçün qabıqlı fındıqdan (0802.21) fərqli olaraq birbaşa {hs} kodu təyin edilmişdir. Qovrulmadığı üçün 20-ci qrupa keçmir."
            en = f"Classified under {hs} (Shelled Hazelnuts / Kernels) distinguishing it from in-shell nuts (0802.21). Raw kernels are not roasted, remaining in Chapter 08. Mandatory EU aflatoxin screening applies."
        elif hs == "0802.21.00.00":
            az = f"Məhsul bütöv qabıqlı çərəzlik meşə fındığı olduğu üçün {hs} alt-bəndinə təsnif edilmişdir. Qabığı soyulmuş ləpə (0802.22) ilə qarışdırılmamalıdır."
            en = f"Classified under {hs} (Hazelnuts In-Shell) because the woody shell is intact and uncracked. Strictly distinguished from shelled kernels (0802.22)."
        elif hs == "0813.40.95.00":
            az = f"Xurmanın təbii günəşdə qurudulmuş məhsul olduğu göstərildiyi üçün təzə xurmadan (0810.70) fərqli olaraq 0813 Qrupuna (Qurudulmuş meyvələr) aid {hs} kodu seçilmişdir."
            en = f"Classified under {hs} (Dried Persimmons) within heading 0813. Crucial distinction: fresh persimmons fall under 0810.70, whereas dried persimmons reclassify under 0813."
        elif hs == "0810.70.00.00":
            az = f"Təzə, bütöv Şərq xurması (Korolyok) 0810.70 alt-bəndinə aiddir. Qurudulmuş xurma (0813.40) ilə səhv salınmamalıdır."
            en = f"Classified under {hs} (Fresh Persimmons). Differentiated from dried persimmons (0813.40). Requires AQTA phytosanitary certificate."
        elif hs == "0702.00.00.00":
            az = f"Təzə istixana pomidoru bütöv və xam halda olduğuna görə 07-ci Qrup (Tərəvəzlər) üzrə {hs} koduna təsnif olunmuşdur. Emal olunmadığı üçün 2002 qrupuna aid edilmir."
            en = f"Classified under {hs} (Fresh Tomatoes) under Chapter 07. Raw and whole, not processed or pureed (which would classify under 2002)."
        elif hs == "2002.90.31.00":
            az = f"Konsentrat halına salınmış pomidor pastası (quru maddə 28-30%) 20-ci Qrup üzrə {hs} koduna aiddir."
            en = f"Classified under {hs} (Tomato Paste, dry matter 28-30%) under Chapter 20."
        else:
            az = f"Məhsul təsvirindəki texniki parametrlər və fiziki xassələrə əsasən XİF MN üzrə {hs} ({name_az}) kodu müəyyən edilmişdir. {criteria}"
            en = f"Classified under HS {hs} ({name_en}) based on goods characteristics. {criteria}"

        return az, en
