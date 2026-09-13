import asyncio
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.extractor import InvoiceExtractor
from services.classifier import TariffClassifier
from services.compliance import ComplianceEngine
from services.declaration import DeclarationDraftGenerator

async def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    tariff_path = os.path.join(base_dir, "data", "tariff_rules.json")
    doc_rules_path = os.path.join(base_dir, "data", "document_rules.json")
    samples_path = os.path.join(base_dir, "data", "sample_invoices.json")

    extractor = InvoiceExtractor(samples_path)
    classifier = TariffClassifier(tariff_path)
    compliance = ComplianceEngine(doc_rules_path)
    declaration = DeclarationDraftGenerator()

    print("--- Test 1: Sample Göyçay Pomegranate & Juice ---")
    extracted_goychay = extractor.extract_from_sample("sample-goychay-germany")
    assert extracted_goychay is not None, "Failed to load Göyçay sample"
    classified_goychay = await classifier.classify_items(extracted_goychay["line_items"])
    assert len(classified_goychay) == 2
    assert classified_goychay[0]["hs_code"] == "0810.90.75.00", f"Unexpected HS code: {classified_goychay[0]['hs_code']}"
    assert classified_goychay[1]["hs_code"] == "2009.89.79.00", f"Unexpected HS code: {classified_goychay[1]['hs_code']}"
    comp_goychay = compliance.evaluate_compliance(
        classified_goychay,
        extracted_goychay["invoice_meta"]["destination_country"],
        extracted_goychay["provided_documents"]
    )
    # Check that EUR.1 is flagged as missing
    missing_keys = [c["doc_key"] for c in comp_goychay["checklist"] if c["status"] == "missing"]
    assert "ORIGIN_EUR1" in missing_keys, "EUR.1 should be flagged as missing for Germany"
    decl_goychay = declaration.generate_draft(extracted_goychay["invoice_meta"], classified_goychay, comp_goychay["checklist"])
    assert decl_goychay["summary_totals"]["total_invoice_value"] == 42200.0
    print("✓ Göyçay sample passed!")

    print("--- Test 2: Sample Zaqatala Hazelnuts ---")
    extracted_zaq = extractor.extract_from_sample("sample-zaqatala-italy")
    classified_zaq = await classifier.classify_items(extracted_zaq["line_items"])
    assert classified_zaq[0]["hs_code"] == "0802.22.00.00", f"Expected shelled: {classified_zaq[0]['hs_code']}"
    assert classified_zaq[1]["hs_code"] == "0802.21.00.00", f"Expected in-shell: {classified_zaq[1]['hs_code']}"
    comp_zaq = compliance.evaluate_compliance(
        classified_zaq,
        extracted_zaq["invoice_meta"]["destination_country"],
        extracted_zaq["provided_documents"]
    )
    missing_zaq = [c["doc_key"] for c in comp_zaq["checklist"] if c["status"] == "missing"]
    assert "AFLATOXIN_LAB_REPORT" in missing_zaq, "Aflatoxin report should be flagged as missing for Italy hazelnuts"
    print("✓ Zaqatala sample passed!")

    print("--- Test 3: Heuristic Extraction from messy text ---")
    messy_text = "Tarix: 12.11.2025\nİxrac: Quba Meyvəçilik MMC VÖEN 1902847111\nAlıcı: Moscow Fruit OOO, Rusiya\n1. Quba alması (Qırmızı qış sortu) - 15000 kq @ 0.85 USD = 12750 USD"
    messy_extracted = await extractor.extract_from_text(messy_text)
    assert len(messy_extracted["line_items"]) >= 1
    classified_messy = await classifier.classify_items(messy_extracted["line_items"])
    assert classified_messy[0]["hs_code"] == "0808.10.80.00", f"Expected apple: {classified_messy[0]['hs_code']}"
    print("✓ Messy text fallback extraction passed!")
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())

