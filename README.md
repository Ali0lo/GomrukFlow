# 🍇 GömrükFlow — Smart Customs AI Copilot for Agricultural Exports

<div align="center">

![GömrükFlow Banner](https://img.shields.io/badge/GömrükFlow-Smart%20Customs%20Copilot-0284c7?style=for-the-badge&logo=shield&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js 14](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python 3.14](https://img.shields.io/badge/Python%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)

**An AI-powered decision-support copilot that helps Azerbaijani customs brokers and SME agricultural exporters classify goods under 10-digit tariff (XİF MN / HS) codes, check for missing AQTA and origin documents, and pre-fill customs export declarations (Form EK 10) in seconds instead of hours.**

[🚀 Quickstart](#-quickstart) • [🏆 3-Minute Pitch Script](#-3-minute-startup-pitch-script) • [📦 Live Demo Scenarios](#-pre-seeded-demo-scenarios) • [🛡️ Defensibility & Rules KB](#️-defensibility--local-knowledge-base) • [🌙 Dark Mode & UI](#-dark-mode--ui-enhancements)

</div>

---

## 📌 Executive Summary

Azerbaijan's non-oil export economy is driven by high-value agricultural commodities — fresh pomegranates from Göyçay, hazelnuts from Zaqatala, greenhouse tomatoes from Xaçmaz, and persimmons from Qax. However, SME exporters and customs brokers face severe bottlenecks:
- **Misclassification Risks**: Distinguishing between whole fresh pomegranates (Chapter 08) and pure pomegranate juice (Chapter 20), or shelled kernels (`0802.22`) and in-shell nuts (`0802.21`), can result in costly border delays or penalties.
- **Complex Regulatory Compliance**: Shipments to the European Union require specific movement certificates (EUR.1) and aflatoxin laboratory screening (EU Reg 2019/1793); shipments to the CIS require Form CT-1 for 0% preferential tariffs; shipments to the Gulf require Form C origin certification and AQTA clearances.
- **Manual Declaration Preparation**: Manually keying commercial invoices into State Customs Committee (DGK) declaration forms takes hours per consignment.

**GömrükFlow solves this core workflow in 3 clicks.**

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **⚡ 1-Click Pitch Demo Scenarios** | Pre-seeded with 3 realistic Azerbaijani export shipments guaranteed to execute live with 0 lag and 100% reliability. |
| **🧠 Explainable AI Customs Reasoning** | Not a black box — every line item receives a plain-language legal justification and classification pitfall advisory. |
| **🚩 Automated Compliance Red-Flags** | Cross-references goods category $\times$ destination market to flag missing phytosanitary (AQTA), origin (EUR.1/CT-1), or lab documents. |
| **📋 Customs Declaration Draft (EK 10)** | Populates official DGK box fields (Boxes 1, 2, 8, 15, 17, 20, 22, 31, 33, 44) ready for licensed broker electronic signature. |
| **🌙 Obsidian Dark Mode & Light Mode** | High-contrast enterprise design with custom theme persistence, accessible typography, and smooth transitions. |
| **🛡️ Offline Resilient Architecture** | Built around first-class local reference datasets (`tariff_rules.json` & `document_rules.json`), with optional Anthropic Claude LLM orchestration. |
| **🇦🇿 Azerbaijani Linguistic Resilience** | Handles Azerbaijani morphological alternations (`fındıq` → `fındığı`, `qabıq` → `qabığı`) and Latin transliterations reliably. |

---

## 🏆 3-Minute Startup Pitch Script

*Use this guide when presenting GömrükFlow live to competition judges:*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MINUTE 1: The Problem & The Vertical Focus                                   │
│ "Judges, Azerbaijan exported over $800M in non-oil agricultural goods last   │
│ year. Yet SME exporters in Goychay and Zaqatala still spend 3 to 6 hours per │
│ shipment manually determining 10-digit HS codes and collecting documents.   │
│ A single missing EUR.1 certificate costs an EU importer 4% in extra duty;   │
│ a missing aflatoxin test stops a hazelnut truck at the Italian border."      │
├─────────────────────────────────────────────────────────────────────────────┤
│ MINUTE 2: Live Demo Core Loop (Click 'Göyçay Nar & Şirə')                   │
│ "Watch GömrükFlow in action. We upload a messy commercial invoice. In 1.5   │
│ seconds:                                                                    │
│ 1. Extraction: Line items and exporter TIN (VÖEN: 2301498111) are parsed.    │
│ 2. HS Classification: Fresh pomegranates are classified under 0810.90.75;    │
│    the cold-pressed juice is assigned 2009.89.79. Notice the reasoning: it │
│    explains WHY Chapter 20 was chosen instead of Chapter 08.                 │
│ 3. Compliance Red-Flag: Look at the red banner! It flags that the EUR.1     │
│    certificate is missing for the German buyer."                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ MINUTE 3: The Declaration & Defensibility Story                              │
│ "Under Tab 3, GömrükFlow generates the complete DGK Export Declaration       │
│ draft (Form EK 10) with standard box mappings. Our defensibility is NOT a   │
│ generic prompt wrapper: it is our proprietary local rules knowledge base     │
│ codifying Azerbaijani customs tariffs and AQTA compliance rules."            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Pre-Seeded Demo Scenarios

| Scenario | Commodities | Destination Market | Educational Demonstration Point |
|---|---|---|---|
| **1. Göyçay Nar & Şirə** | Fresh Göyçay Pomegranates (`0810.90.75.00`) + 100% Organic Juice (`2009.89.79.00`) | Hamburg, Germany (EU) | Differentiates Chapter 08 (Fresh Fruit) vs Chapter 20 (Juice). Flags **Missing EUR.1 Certificate** (needed for 0% EU tariff). |
| **2. Zaqatala Fındıq** | Shelled Hazelnut Kernels (`0802.22.00.00`) + In-Shell (`0802.21.00.00`) | Alba, Italy (Ferrero supply chain) | Distinguishes shelled vs in-shell pitfall. Flags **Missing Aflatoxin Lab Report** (EU Reg 2019/1793 border blocker). |
| **3. Xaçmaz Pomidor & Qax Xurma** | Greenhouse Tomatoes (`0702.00.00.00`) + Sun-Dried Persimmons (`0813.40.95.00`) | Dubai, UAE (Gulf) | Distinguishes Dried Persimmon (0813) from Fresh Persimmon (0810). Flags **Missing General Certificate of Origin (Form C)**. |

---

## 🏛️ System Architecture

```
                                      GömrükFlow Architecture
                                  
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │                         Frontend UI (Next.js 14 + Tailwind CSS)                        │
  │  - Obsidian Dark Mode / Light Mode Toggle with local storage persistence               │
  │  - 1-Click Pitch Demo Bar with micro-statistics chips                                  │
  │  - Dynamic Document Upload Zone (PDF / Image / Messy Text with quick sample presets)    │
  │  - 4-Stage Live Execution Stepper with timing indicators                               │
  │  - Classification Table with Confidence Badges, AI Legal Justifications, and Overrides │
  │  - Compliance Checklist (All / Missing / Provided filters) with border risk alerts    │
  │  - Export Declaration Draft View (Form EK 10) with JSON Copy, Text Report, and Print   │
  │  - Searchable Agricultural Tariff Reference Modal                                      │
  └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ HTTP JSON / CORS (Port 3001 -> 8000)
                                              ▼
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │                               Backend API (FastAPI Python)                             │
  │  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐  │
  │  │    Invoice Extractor    │  │  Tariff Classification  │  │  Compliance Evaluation │  │
  │  │  - Regex / Heuristics   │  │  - Morphological Stem   │  │  - Category × Market   │  │
  │  │  - Optional Claude LLM  │  │  - Confidence Scoring   │  │  - Missing Doc Flags   │  │
  │  └─────────────────────────┘  └─────────────────────────┘  └────────────────────────┘  │
  │                                           │                                            │
  │  ┌────────────────────────────────────────┴──────────────────────────────────────────┐ │
  │  │ Declaration Generator (Azerbaijan DGK Form EK 10 Standard Box Reference Schema)   │ │
  │  └───────────────────────────────────────────────────────────────────────────────────┘ │
  └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │
                                              ▼
  ┌────────────────────────────────────────────────────────────────────────────────────────┐
  │                        First-Class Structured Local Datasets                           │
  │  - backend/data/tariff_rules.json: 14+ national HS codes, duty/VAT, rules & pitfalls   │
  │  - backend/data/document_rules.json: AQTA, EUR.1, CT-1, Form C, Aflatoxin rules matrix │
  │  - backend/data/sample_invoices.json: 3 pre-seeded realistic shipments                 │
  └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

### Option 1: Automatic Launch Script

```bash
git clone https://github.com/Ali0lo/GomrukFlow.git
cd GomrukFlow
chmod +x start.sh
./start.sh
```

- **Frontend Application**: [http://localhost:3001](http://localhost:3001)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Manual Setup

#### 1. Backend Service
```bash
# Set up Python virtual environment
python3 -m venv backend/venv
./backend/venv/bin/pip install fastapi uvicorn pydantic python-multipart httpx

# Start FastAPI server
./backend/venv/bin/python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
```

#### 2. Frontend Application
```bash
cd frontend
npm install
npm run build
npm run start
# Open http://localhost:3001
```

---

## 🛡️ Defensibility & Local Knowledge Base

Unlike generic LLM wrappers that hallucinate customs codes:
1. **10-Digit Subheading Precision**: Standard models stop at 6 digits; GömrükFlow maps down to national 10-digit codes (e.g. `0810.90.75.00` for fresh pomegranates).
2. **Morphological Token Matcher**: Normalizes Azerbaijani noun declensions so that `"fındığı"`, `"fındıq"`, and `"findiq"` reliably resolve to Corylus nuts.
3. **Regulatory Rules Matrix**: Automatically applies destination-specific bilateral agreements (EU preferential access under EUR.1 vs CIS free-trade under CT-1).
4. **Human-in-the-Loop Safeguards**: Low-confidence or ambiguous classifications are visually flagged for broker confirmation, ensuring compliance integrity.

---

## 🌙 Dark Mode & UI Enhancements

- **Obsidian Dark Mode**: High-contrast, pitch-ready dark theme designed for conference stage projectors and late-night broker workflows.
- **Instant Theme Toggle**: Switch between Light and Dark mode with one click; settings are automatically preserved in `localStorage`.
- **Search & Filter Controls**: Filter table items in real time by name, code, or confidence score.
- **Export Formats**: One-click export to CSV, JSON, and formatted TXT report, plus browser print preview formatted for customs documentation.

---

## 🧪 Automated Testing

Run the automated test suite to verify classification accuracy, compliance checks, and API endpoints:

```bash
# Test classification & compliance logic
./backend/venv/bin/python backend/tests/test_backend.py

# Test API endpoints
./backend/venv/bin/python backend/tests/test_api.py
```

---

## ⚖️ Legal & Regulatory Disclaimer

GömrükFlow is an AI-assisted decision-support preview and drafting assistant. Outputs are drafts (`Qaralama`) intended to assist licensed customs representatives and exporters. Declarations must be verified and authorized by a licensed broker prior to formal electronic filing on official State Customs Committee portals.

---

<div align="center">
  <sub>Developed for Azerbaijani Agricultural Exporters & Customs Brokers. Built with pride in Baku.</sub>
</div>
