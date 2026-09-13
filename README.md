# GömrükFlow — Smart Customs AI Copilot for Agricultural Exports

> **Startup Pitch MVP**: Decision-support tool for Azerbaijani customs brokers and SME agricultural exporters. Classifies goods under Harmonized System (HS / XİF MN) codes, validates mandatory AQTA & origin compliance documents, and generates pre-filled customs declaration drafts (Forma EK 10) in seconds.

---

## 🏆 Pitch Demo Highlights

Designed specifically for a **3-minute live startup competition pitch** before judges:
- **1-Click Reliable Demo Scenarios**: Pre-seeded realistic Azerbaijani shipments ready to execute instantly without typing or internet dependency.
- **Explainable Customs Reasoning**: Every classified line item features plain-language legal justifications and common pitfall warnings (not an opaque black box).
- **Compliance Red-Flag Alerts**: Automatic detection of missing AQTA phytosanitary, EUR.1 / CT-1 certificates of origin, and mandatory EU aflatoxin screening protocols.
- **Customs Declaration Draft (Form EK 10)**: Populates official Azerbaijani DGK box references (Box 1, 2, 8, 15, 17, 20, 22, 31, 33, 44) ready for licensed broker electronic signature.
- **Zero-Friction Offline Resilience**: Works 100% reliably offline via first-class local reference datasets (`tariff_rules.json` and `document_rules.json`), with optional Anthropic Claude LLM orchestration when `ANTHROPIC_API_KEY` is provided.

---

## 🚀 Quickstart

### 1. One-Command Launch

```bash
chmod +x start.sh
./start.sh
```

- **Frontend UI**: [http://localhost:3001](http://localhost:3001)
- **FastAPI Backend Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Manual Startup

#### Backend (FastAPI):
```bash
python3 -m venv backend/venv
./backend/venv/bin/pip install fastapi uvicorn pydantic python-multipart httpx
./backend/venv/bin/python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
```

#### Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3001
```

---

## 📦 Pre-Seeded Pitch Scenarios

| Scenario | Export Commodity | Destination | Key Demo Highlight |
|---|---|---|---|
| **1. Göyçay Pomegranate & Juice** | Fresh Pomegranates (`0810.90.75.00`) + Pure Juice (`2009.89.79.00`) | Hamburg, Germany (EU) | Differentiates Chapter 08 (Fresh Fruit) vs Chapter 20 (Juice). Flags **Missing EUR.1 Certificate** (needed for 0% EU tariff). |
| **2. Zaqatala Hazelnuts** | Shelled Hazelnut Kernels (`0802.22.00.00`) + In-Shell (`0802.21.00.00`) | Alba, Italy (Ferrero supply chain) | Distinguishes shelled vs in-shell pitfall. Flags **Missing Aflatoxin Lab Report** (EU Reg 2019/1793 border blocker). |
| **3. Xaçmaz Tomatoes & Qax Persimmons** | Greenhouse Tomatoes (`0702.00.00.00`) + Sun-Dried Persimmons (`0813.40.95.00`) | Dubai, UAE (Gulf) | Distinguishes Dried Persimmon (0813) from Fresh Persimmon (0810). Flags **Missing General Certificate of Origin (Form C)**. |

---

## 🏗️ Architecture & Data Layer

```
GomrukFlow/
├── backend/
│   ├── data/
│   │   ├── tariff_rules.json       # 14+ real XİF MN agricultural codes, duty rates, criteria & pitfalls
│   │   ├── document_rules.json     # AQTA, EUR.1, CT-1, Aflatoxin compliance matrix
│   │   └── sample_invoices.json    # 3 pre-seeded realistic shipments with full metadata
│   ├── services/
│   │   ├── extractor.py            # Dual LLM & heuristic invoice extractor
│   │   ├── classifier.py           # HS code matcher with morphology & plain-language justifications
│   │   ├── compliance.py           # Regulatory checklist engine (Category × Destination)
│   │   └── declaration.py          # DGK Export Declaration Draft generator (EK 10)
│   ├── main.py                     # FastAPI application & REST endpoints
│   └── tests/                      # Automated unit and API test suite
├── frontend/
│   ├── src/app/page.tsx            # Main interactive dashboard
│   ├── src/components/
│   │   ├── Header.tsx              # Brand header, language toggle & tariff lookup modal trigger
│   │   ├── SampleInvoicesBar.tsx   # 1-click pitch demo cards
│   │   ├── DocumentUploadZone.tsx  # File drag & drop + paste invoice text area
│   │   ├── ProcessingStepper.tsx   # Live step-by-step progress tracking
│   │   ├── ClassificationTable.tsx # Line items, confidence scoring & AI justifications
│   │   ├── DocumentComplianceCard.tsx # Required documents checklist with missing warnings
│   │   └── DeclarationDraftModal.tsx  # Pre-filled customs declaration view with print & export
└── sample_docs/                    # Ready-to-use sample text invoice files
```

---

## 🛡️ Defensibility & Local Rules Dataset

Unlike generic AI wrappers, GömrükFlow's defensibility lies in its **first-class structured customs domain data**:
- **Azerbaijani Specific Nomenclature**: Incorporates 10-digit national subheadings, AQTA food safety clearances, and Ministry of Economy origin rules.
- **Phonetic & Morphological Resilience**: Handles Azerbaijani noun mutations (`fındıq` → `fındığı`, `qabıq` → `qabığı`) and Latin transliterations reliably.
- **Human-in-the-Loop Safeguards**: Low-confidence or ambiguous classifications are visually flagged for broker confirmation, ensuring compliance integrity.

---

## ⚖️ Legal Disclaimer

GömrükFlow is a decision-support preview and drafting assistant. All generated declarations are drafts (`Qaralama`) that must be reviewed, verified, and submitted by a licensed customs broker or authorized declarant to official State Customs Committee systems.

