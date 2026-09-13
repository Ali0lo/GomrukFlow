import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["tariff_rules_count"] >= 14
    print("✓ Health check passed!")

def test_samples():
    resp = client.get("/api/samples")
    assert resp.status_code == 200
    samples = resp.json().get("samples", [])
    assert len(samples) == 3
    print("✓ Samples endpoint passed!")

def test_process_all_sample():
    resp = client.post("/api/process-all", json={"sample_id": "sample-goychay-germany"})
    assert resp.status_code == 200
    data = resp.json()
    assert "invoice_meta" in data
    assert "line_items" in data
    assert "compliance" in data
    assert "declaration" in data
    assert data["declaration"]["boxes"]["box_1_declaration_type"]["code"] == "EK-10"
    print("✓ Process-all pipeline test passed!")

if __name__ == "__main__":
    test_health()
    test_samples()
    test_process_all_sample()
    print("ALL API TESTS PASSED!")

