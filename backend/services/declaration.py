import datetime
import uuid
from typing import Dict, Any, List

class DeclarationDraftGenerator:
    def generate_draft(
        self,
        invoice_meta: Dict[str, Any],
        classified_items: List[Dict[str, Any]],
        compliance_checklist: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        declaration_id = f"EK-10-{datetime.datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        creation_date = datetime.date.today().isoformat()

        # Totals calculation
        total_value = sum(item.get("total_price", 0.0) for item in classified_items)
        total_net_weight = sum(item.get("net_weight_kg", item.get("quantity", 0.0)) for item in classified_items)
        total_gross_weight = sum(item.get("gross_weight_kg", item.get("quantity", 0.0) * 1.08) for item in classified_items)

        # Build Box 44 (Attached Documents list with official customs codes)
        box_44_documents = []
        for doc in compliance_checklist:
            box_44_documents.append({
                "customs_code": doc.get("customs_code", "09999"),
                "document_name": doc.get("name_az", ""),
                "document_name_en": doc.get("name_en", ""),
                "status": doc.get("status", "provided"),
                "authority": doc.get("issuing_authority", "")
            })

        # Structured Declaration Schema (matching Azerbaijani DGK Export Declaration fields)
        boxes = {
            "box_1_declaration_type": {
                "label_az": "1. Bəyannamə / Rejim",
                "label_en": "1. Declaration Type / Regime",
                "value": "EK 10 (İxracat / Sərbəst dövriyyə üçün ixrac)",
                "code": "EK-10"
            },
            "box_2_exporter": {
                "label_az": "2. Göndərən / İxracatçı",
                "label_en": "2. Consignor / Exporter",
                "name": invoice_meta.get("exporter_name", "Göyçay Aqro-İxracat MMC"),
                "voen": invoice_meta.get("exporter_voen", "2301498111"),
                "address": invoice_meta.get("exporter_address", "Azərbaycan"),
                "country": "AZ (Azərbaycan Respublikası)"
            },
            "box_3_pages": {
                "label_az": "3. Vərəqlər",
                "label_en": "3. Forms",
                "value": f"1 / {max(1, len(classified_items))}"
            },
            "box_5_items_count": {
                "label_az": "5. Malların sayı",
                "label_en": "5. Total Items",
                "value": len(classified_items)
            },
            "box_6_packages": {
                "label_az": "6. Cəmi yerlərin sayı",
                "label_en": "6. Total Packages",
                "value": ", ".join(filter(None, [item.get("packages", "") for item in classified_items])) or "Toplu / Konteyner"
            },
            "box_8_consignee": {
                "label_az": "8. Alıcı / İdxalatçı",
                "label_en": "8. Consignee",
                "name": invoice_meta.get("consignee_name", "Avropa Tərəfdaş Şirkəti"),
                "address": invoice_meta.get("consignee_address", invoice_meta.get("destination_country", "")),
                "country": invoice_meta.get("destination_country", "Germany")
            },
            "box_14_declarant": {
                "label_az": "14. Bəyannaməçi / Broker",
                "label_en": "14. Declarant / Representative",
                "name": "GömrükFlow AI Qaralama Modulu",
                "note": "İlkin avtomatlaşdırılmış layihə (Human-in-the-loop broker təsdiqi tələb olunur)"
            },
            "box_15_origin_country": {
                "label_az": "15. Göndərən ölkə",
                "label_en": "15. Country of Dispatch / Export",
                "country_code": "AZ",
                "country_name": "Azərbaycan"
            },
            "box_17_destination_country": {
                "label_az": "17. Təyinat ölkəsi",
                "label_en": "17. Country of Destination",
                "country_code": invoice_meta.get("destination_code", "DE"),
                "country_name": invoice_meta.get("destination_country", "Germany")
            },
            "box_20_delivery_terms": {
                "label_az": "20. Çatdırılma şərtləri (Incoterms)",
                "label_en": "20. Delivery Terms (Incoterms 2020)",
                "value": invoice_meta.get("incoterms", "CIP Hamburg")
            },
            "box_22_currency_and_total": {
                "label_az": "22. Valyuta və Faktura Məbləği",
                "label_en": "22. Currency and Total Amount Invoiced",
                "currency": invoice_meta.get("currency", "EUR"),
                "total_amount": round(total_value, 2),
                "formatted": f"{round(total_value, 2):,.2f} {invoice_meta.get('currency', 'EUR')}"
            },
            "box_25_transport": {
                "label_az": "25. Nəqliyyat növü",
                "label_en": "25. Mode of Transport at Border",
                "value": invoice_meta.get("transport_mode", "Avtomobil TIR (Soyuducu)")
            },
            "box_44_documents": {
                "label_az": "44. Əlavə sənədlər / Sertifikatlar",
                "label_en": "44. Additional Documents / Certificates",
                "documents": box_44_documents
            }
        }

        # Detailed goods items table (Box 31, 33, 35, 38, 41, 42)
        declaration_items = []
        for idx, item in enumerate(classified_items, 1):
            declaration_items.append({
                "item_number": idx,
                "box_31_description": item.get("description", ""),
                "box_31_packages": item.get("packages", "Karton qutularda"),
                "box_33_hs_code": item.get("hs_code", "0810.90.75.00"),
                "commodity_name_az": item.get("commodity_name_az", ""),
                "box_35_gross_mass": round(item.get("gross_weight_kg", item.get("quantity", 0) * 1.08), 2),
                "box_38_net_mass": round(item.get("net_weight_kg", item.get("quantity", 0)), 2),
                "box_41_supplementary_units": f"{item.get('quantity', 0)} {item.get('unit', 'kq')}",
                "box_42_item_price": round(item.get("total_price", 0.0), 2),
                "duty_rate": item.get("export_duty_rate", "0%"),
                "vat_rate": item.get("vat_rate", "0%"),
                "confidence_score": item.get("confidence", 0.95),
                "review_needed": item.get("review_needed", False)
            })

        return {
            "declaration_id": declaration_id,
            "regime_type": "EK 10 (İxrac)",
            "created_at": creation_date,
            "status": "DRAFT_PENDING_BROKER_REVIEW",
            "boxes": boxes,
            "declaration_items": declaration_items,
            "summary_totals": {
                "total_items_count": len(classified_items),
                "total_invoice_value": round(total_value, 2),
                "currency": invoice_meta.get("currency", "EUR"),
                "total_net_weight_kg": round(total_net_weight, 2),
                "total_gross_weight_kg": round(total_gross_weight, 2)
            },
            "legal_disclaimer": {
                "az": "DİQQƏT: Bu sənəd GömrükFlow süni intellekt qərar-dəstək sistemi tərəfindən hazırlanmış ilkin bəyannamə qaralamasıdır. Rəsmi dövlət e-gömrük sisteminə təqdimatdan öncə lisenziyalı gömrük təmsilçisi (broker) tərəfindən yoxlanılmalı və elektron imza ilə təsdiq edilməlidir.",
                "en": "NOTICE: This draft is an AI-assisted decision-support preview generated by GömrükFlow. It does not constitute an official customs filing and must be verified and authorized by a licensed customs broker."
            }
        }

