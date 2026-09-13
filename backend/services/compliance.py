import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class ComplianceEngine:
    def __init__(self, doc_rules_path: str):
        self.doc_rules_path = doc_rules_path
        self.definitions = {}
        self.destination_rules = []
        self._load_rules()

    def _load_rules(self):
        if os.path.exists(self.doc_rules_path):
            try:
                with open(self.doc_rules_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.definitions = data.get("document_definitions", {})
                    self.destination_rules = data.get("destination_rules", [])
            except Exception as e:
                logger.error(f"Failed to load document rules: {e}")

    def evaluate_compliance(
        self,
        classified_items: List[Dict[str, Any]],
        destination_country: str,
        provided_docs: List[str]
    ) -> Dict[str, Any]:
        dest_clean = destination_country.strip()

        # Find matching destination rule
        matched_rule = None
        for rule in self.destination_rules:
            for c in rule.get("countries", []):
                if c.lower() in dest_clean.lower() or dest_clean.lower() in c.lower():
                    matched_rule = rule
                    break
            if matched_rule:
                break

        if not matched_rule:
            matched_rule = next((r for r in self.destination_rules if r["destination_zone"] == "DEFAULT"), None)

        zone = matched_rule.get("destination_zone", "DEFAULT") if matched_rule else "DEFAULT"
        customs_note = matched_rule.get("customs_note", "") if matched_rule else ""

        # Collect categories from classified items
        categories = set()
        for item in classified_items:
            cat = item.get("category")
            if cat:
                categories.add(cat)
            # fallback category deduction from HS code
            hs = item.get("hs_code", "")
            if hs.startswith("0802"):
                categories.add("nuts")
            elif hs.startswith("0810") or hs.startswith("0808") or hs.startswith("0809") or hs.startswith("0806") or hs.startswith("0805"):
                categories.add("fresh_fruits")
            elif hs.startswith("0813"):
                categories.add("dried_fruits")
            elif hs.startswith("0702"):
                categories.add("fresh_vegetables")
            elif hs.startswith("2009"):
                categories.add("processed_beverages")
            elif hs.startswith("2002"):
                categories.add("processed_vegetables")
            elif hs.startswith("0409"):
                categories.add("apiculture")

        # Determine all required document keys
        required_doc_keys = list(matched_rule.get("mandatory_documents", [])) if matched_rule else []
        cat_specific = matched_rule.get("category_specific", {}) if matched_rule else {}

        for cat in categories:
            docs_for_cat = cat_specific.get(cat, [])
            for doc in docs_for_cat:
                if doc not in required_doc_keys:
                    required_doc_keys.append(doc)

        # Build checklist
        checklist = []
        missing_count = 0
        provided_set = set(provided_docs)

        for doc_key in required_doc_keys:
            definition = self.definitions.get(doc_key, {
                "code": "09999",
                "name_az": doc_key,
                "name_en": doc_key,
                "issuing_authority": "Müvafiq Qurum",
                "description_az": "İxrac üçün tələb olunan sənəd.",
                "description_en": "Required export document."
            })

            is_provided = doc_key in provided_set
            if not is_provided:
                missing_count += 1
                status = "missing"
                status_label_az = "Çatışmır (Tələb olunur)"
                status_label_en = "Missing (Mandatory)"
                severity = "critical"
            else:
                status = "provided"
                status_label_az = "Təqdim olunub"
                status_label_en = "Provided"
                severity = "success"

            impact_note_az = self._get_doc_impact_az(doc_key, zone, dest_clean)
            impact_note_en = self._get_doc_impact_en(doc_key, zone, dest_clean)

            checklist.append({
                "doc_key": doc_key,
                "customs_code": definition.get("code", "09999"),
                "name_az": definition.get("name_az", doc_key),
                "name_en": definition.get("name_en", doc_key),
                "issuing_authority": definition.get("issuing_authority", ""),
                "description_az": definition.get("description_az", ""),
                "description_en": definition.get("description_en", ""),
                "status": status,
                "status_label_az": status_label_az,
                "status_label_en": status_label_en,
                "severity": severity,
                "impact_note_az": impact_note_az,
                "impact_note_en": impact_note_en
            })

        # Add any provided documents that weren't strictly mandatory as additional verified docs
        for prov in provided_docs:
            if prov not in required_doc_keys and prov in self.definitions:
                definition = self.definitions[prov]
                checklist.append({
                    "doc_key": prov,
                    "customs_code": definition.get("code", "09999"),
                    "name_az": definition.get("name_az", prov),
                    "name_en": definition.get("name_en", prov),
                    "issuing_authority": definition.get("issuing_authority", ""),
                    "description_az": definition.get("description_az", ""),
                    "description_en": definition.get("description_en", ""),
                    "status": "provided",
                    "status_label_az": "Əlavə təqdim olunub",
                    "status_label_en": "Additional provided",
                    "severity": "success",
                    "impact_note_az": "Sənəd paketində mövcuddur.",
                    "impact_note_en": "Present in shipment package."
                })

        overall_status = "ACTION_REQUIRED" if missing_count > 0 else "COMPLIANT"
        overall_status_az = f"{missing_count} vacib sənəd çatışmır" if missing_count > 0 else "Bütün tələb olunan sənədlər tamdır"

        return {
            "overall_status": overall_status,
            "overall_status_az": overall_status_az,
            "missing_count": missing_count,
            "destination_zone": zone,
            "destination_country": dest_clean,
            "customs_regulatory_note": customs_note,
            "checklist": checklist
        }

    def _get_doc_impact_az(self, doc_key: str, zone: str, destination: str) -> str:
        if doc_key == "ORIGIN_EUR1":
            return f"Aİ ({destination}) gömrüyündə preferensial 0% idxal tarifindən yararlanmaq üçün zəruridir. Təqdim edilmədikdə idxalçı standart rüsum ödəməli olacaq."
        if doc_key == "ORIGIN_CT1":
            return f"MDB Azad Ticarət Razılaşmasına əsasən {destination} gömrüyündə 0% idxal rüsumu üçün mütləqdir."
        if doc_key == "AFLATOXIN_LAB_REPORT":
            return f"Avropa İttifaqının 2019/1793 reqlamentinə görə fındıq partiyası üçün məcburidir. Sənəd olmadıqda yük Aİ sərhədində dərhal saxlanılacaq."
        if doc_key == "AQTA_PHYTOSANITARY":
            return "Azərbaycan Respublikası Qida Təhlükəsizliyi Agentliyinin (AQTA) fitosanitar sertifikatı olmadan bitki məhsullarının gömrük sərhədindən buraxılışı qadağandır."
        if doc_key == "ORIGIN_GENERAL":
            return f"{destination} gömrüyünə təqdim etmək üçün ümumi formada (Form C) mənşə sertifikatı tələb olunur."
        return "Gömrük bəyannaməsinin 44-cü qrafasında qeyd olunması məcburidir."

    def _get_doc_impact_en(self, doc_key: str, zone: str, destination: str) -> str:
        if doc_key == "ORIGIN_EUR1":
            return f"Mandatory for EU preferential 0% tariff treatment in {destination}. Without it, standard third-country customs duty applies."
        if doc_key == "ORIGIN_CT1":
            return f"Mandatory for 0% import duty in {destination} under CIS Free Trade Agreement."
        if doc_key == "AFLATOXIN_LAB_REPORT":
            return f"Mandatory EU import barrier requirement under Reg 2019/1793 for hazelnuts. Non-compliance results in immediate border rejection."
        if doc_key == "AQTA_PHYTOSANITARY":
            return "State Food Safety Agency (AQTA) phytosanitary clearance required for raw agricultural commodity export."
        return "Mandatory customs documentation attachment for Box 44."

