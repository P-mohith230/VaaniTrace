# VaaniTrace

> **Tagline:** *Don't just capture what people say. Understand what needs to happen next.*

VaaniTrace is a multilingual voice-to-action intelligence platform powered by **Gnani AI** speech technologies. It transforms audio conversations into structured, editable business records where **every extracted field is linked directly to its source transcript evidence**.

---

## 1. Problem Statement

Across wholesale distribution, field services, operations meetings, and customer grievance desks, spoken conversations represent the highest-velocity communication channel. However, transcription alone leaves teams scanning paragraphs of text to determine what was committed, what was ordered, and what needs to happen next.

Standard AI summarization tools often introduce ungrounded assertions or drop crucial numbers. **VaaniTrace solves this through verifiable evidence mapping**: every extracted quantity, price, deadline, and task is cross-linked with character-accurate offsets to the exact spoken words in the transcript, enabling instant human verification, mathematical auditing, and automated downstream execution.

---

## 2. Main Features

- **Multilingual Speech Recognition:** Integrated with **Gnani Prisma v2.5** for high-accuracy recognition across English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, and Malayalam.
- **Dual Audio Input:** Drag-and-drop audio file upload (WAV, MP3, OGG, WebM, FLAC, M4A up to 25MB) or live browser microphone capture with real-time waveform animation.
- **Domain-Specific Structured Extraction:** Pre-configured extractors for:
  - **Business Orders:** Items, quantities, unit prices, calculated totals (with formula preservation), delivery deadlines, and buyer/vendor entities.
  - **Meeting Action Items:** Action tasks, assignees, deadlines, and decisions.
  - **Field Reports:** Inspection site, equipment status, observed anomalies, and required repairs.
  - **Customer Complaints:** Grievance description, severity assessment, and customer commitments.
  - **General Conversations:** Discussion summary, participants, and key topics.
- **Verifiable Evidence Mapping (Core Differentiator):** Every extracted field contains an attached evidence reference (`spoken`, `inferred`, `calculated`, or `manual`) linking to exact transcript segments and character offsets.
- **Interactive Two-Panel Workbench:** Clicking any extracted field highlights its source passage in the transcript; clicking a transcript segment filters and highlights linked extractions.
- **Human-in-the-Loop Verification:** Operators can edit values in place, mark records as verified, and maintain a full audit trail (`original_value` vs `current_value`).
- **Spoken Summary Synthesis:** High-fidelity voice briefing generated using **Gnani Timbre v2.5** (voices: *Nalini* or *Avinash*).
- **Persistent Storage & Portable Export:** Embedded SQLite database with persistent storage and one-click export to **JSON** and tabular **CSV**.
- **Single-Deployment Architecture:** One integrated application server (FastAPI) serving both the REST API and the production-built React frontend from a single port (`8000`).
- **Premium Monochromatic & Wine-Red Homepage:** Bespoke high-craft landing experience with 11 custom sections, live animated waveform simulations, Indic code-mixing showcase, interactive 3D flipping use-case cards, and strict adherence to a Pure Black (`#000000`), Rich Black (`#0A0A0A`), Charcoal (`#141414`), White (`#FFFFFF`), and Wine Red (`#722F37`) design system.

---

## 3. System Architecture

```
                      +---------------------------------------+
                      |         Web Client                     |
                      |   (Desktop / Tablet / Smartphone)     |
                      +-------------------+-------------------+
                                          |
                                          | HTTP: 8000
                                          v
                      +---------------------------------------+
                      |       FastAPI Application Server      |
                      |                                       |
                      |  1. /              -> Static SPA (UI) |
                      |  2. /assets/*      -> CSS & JS Bundle |
                      |  3. /api/health    -> Health Checks   |
                      |  4. /api/transcribe-> Gnani Prisma    |
                      |  5. /api/extract   -> Extractor Engine|
                      |  6. /api/speech    -> Gnani Timbre    |
                      |  7. /api/records   -> SQLite CRUD     |
                      +-------------------+-------------------+
                                          |
                       +------------------+------------------+
                       |                                     |
                       v                                     v
           +-----------------------+             +-----------------------+
           |  Local SQLite Storage |             |     Gnani AI Cloud    |
           |   data/vaanitrace.db  |             |     api.vachana.ai    |
           +-----------------------+             +-----------------------+
```

---

## 4. Technology Stack

- **Backend Framework:** FastAPI 0.115+ (Python 3.11+)
- **Server:** Uvicorn ASGI Server
- **Data Validation:** Pydantic v2
- **Database Engine:** SQLite3 with WAL mode (SQLAlchemy 2.0 ORM)
- **HTTP Client:** HTTPX (Asynchronous)
- **STT Engine:** Gnani Prisma v2.5 / v3.0 REST (`https://api.vachana.ai/stt/v3`)
- **TTS Engine:** Gnani Timbre v2.5 / v3.0 REST (`https://api.vachana.ai/api/v1/tts/inference`)
- **Frontend Framework:** React 18 + TypeScript
- **Frontend Tooling:** Vite 5
- **Icons:** Lucide React
- **Testing:** Pytest, pytest-asyncio, respx, FastAPI TestClient

---

## 5. Folder Structure

```text
VaaniTrace/
├── app/
│   ├── main.py                  # Single application entrypoint & static asset server
│   ├── config.py                # Pydantic environment configuration
│   ├── database.py              # SQLite connection & WAL mode manager
│   ├── models.py                # SQLAlchemy DB models (Record, Field, Evidence)
│   ├── schemas.py               # Pydantic v2 schemas for all requests & responses
│   ├── routes/
│   │   ├── health.py            # /api/health, /api/health/gnani
│   │   ├── transcription.py     # /api/transcribe
│   │   ├── extraction.py        # /api/extract
│   │   ├── speech.py            # /api/speech
│   │   └── records.py           # /api/records CRUD & /export
│   ├── services/
│   │   ├── gnani_prisma.py      # Gnani Prisma STT service adapter
│   │   ├── gnani_timbre.py      # Gnani Timbre TTS service adapter
│   │   ├── extractor.py         # Structured information extraction engine
│   │   ├── evidence_mapper.py   # Text-to-extraction alignment & evidence linking
│   │   └── export_service.py    # JSON & CSV serialization
│   └── utils/
│       ├── audio_validation.py  # Audio MIME, magic bytes & size validator
│       └── file_storage.py      # Temporary file spooling & cleanup
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Dashboard, Workspace, Records, Settings
│   │   ├── services/api.ts      # Centralized API client
│   │   └── types/index.ts       # TypeScript domain models
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── static/
│   └── dist/                    # Compiled production frontend assets
├── data/
│   ├── vaanitrace.db            # SQLite database
│   └── uploads/                 # Temporary audio spool
├── tests/                       # Automated Pytest suite (22 unit & integration tests)
├── docs/                        # Complete architecture & verification reports
├── verify_e2e.py                # Automated end-to-end verification script
├── .env.example                 # Environment configuration template
├── requirements.txt             # Python backend dependencies
├── package.json                 # Root script runner
└── README.md
```

---

## 6. Installation & Quick Start

### Prerequisites
- Python 3.11+
- Node.js v18+ and npm

### 1. Clone & Set Up Backend
```bash
# Clone the repository
git clone https://github.com/your-username/VaaniTrace.git
cd VaaniTrace

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to include your Gnani API key:
```ini
GNANI_API_KEY=your_actual_gnani_api_key_here
GNANI_BASE_URL=https://api.vachana.ai
GNANI_STT_MODEL=prisma-v2.5
GNANI_TTS_MODEL=timbre-v2.5
```
*(Note: If you do not have an API key immediately, the platform still launches in diagnostic mode; health endpoints and manual extraction remain fully functional).*

### 3. Build Frontend Assets
```bash
cd frontend
npm install
npm run build
cd ..
```
*(This compiles React into `static/dist/`, which FastAPI will serve).*

### 4. Seed Demonstration Records (Optional but Recommended)
```bash
python -m data.seed_demo_records
```
*(Pre-populates SQLite with sample verified records and character-accurate evidence references for B2B Wholesale and Field Inspection scenarios).*

### 5. Run Application Server (Single Command)
```bash
python -m app.main
```
Or:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Open your browser to:
- **Web Application:** `http://localhost:8000`
- **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`
- **System Health:** `http://localhost:8000/api/health`

---

## 7. Development Mode (Optional Dual Server)

If you are actively developing the React UI with Hot Module Replacement (HMR):
```bash
# Terminal 1: Run FastAPI backend
python -m app.main

# Terminal 2: Run Vite dev server
cd frontend
npm run dev
```
Vite runs on `http://localhost:5173` and automatically proxies `/api` requests to `http://localhost:8000`.

---

## 8. API Endpoints Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System health check (backend, database, version) |
| `/api/health/gnani` | `GET` | Gnani AI credentials & connectivity diagnostic |
| `/api/transcribe` | `POST` | Transcribes audio upload via Gnani Prisma v2.5 |
| `/api/extract` | `POST` | Extracts structured fields, totals, action items, and evidence |
| `/api/speech` | `POST` | Synthesizes spoken summary via Gnani Timbre v2.5 |
| `/api/records` | `GET` | Lists saved records with pagination, filtering, and search |
| `/api/records` | `POST` | Persists a structured record with fields, evidence, and actions |
| `/api/records/{id}` | `GET` | Retrieves full record details |
| `/api/records/{id}` | `PUT` | Updates record, verification status, and manual edits |
| `/api/records/{id}` | `DELETE` | Permanently deletes a record |
| `/api/records/{id}/export` | `GET` | Downloads record as JSON or CSV (`?format=json\|csv`) |

---

## 9. Running Automated Tests

Run the automated Pytest suite (22 unit, contract, and mocked provider tests):
```bash
python -m pytest tests/ -v
```

Run the end-to-end single-server workflow test:
```bash
python verify_e2e.py
```

---

## 10. Security & Privacy Guardrails

1. **Backend-Only Credentials:** API keys are never bundled into client JavaScript or sent over the wire to browsers.
2. **Zero Audio Retention by Default:** Uploaded audio files are spooled to temporary files and immediately deleted following transcription.
3. **Magic Byte Inspection:** Uploaded files are inspected for true audio signatures (WAV, MP3, OGG, WebM, FLAC) before processing.
4. **Sanitized Error Responses:** Technical exceptions are logged safely server-side without exposing internal stack traces to clients.

---

## 11. Known Limitations

- **REST Alignment Granularity:** Gnani Prisma REST transcription returns plain normalized text. Sentence segmentation and substring offset matching are used to establish character-level evidence links.
- **Audio Duration:** Synchronous REST transcription is best suited for clips up to 60 seconds.

---

## 12. Documentation Index

- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) — Comprehensive product overview and vision.
- [`docs/DEEP_RESEARCH.md`](docs/DEEP_RESEARCH.md) — Technical research on Gnani APIs and Indian language speech.
- [`docs/TECH_STACK_DECISION.md`](docs/TECH_STACK_DECISION.md) — Architecture and framework evaluation.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Detailed system diagrams, ER models, and workflows.
- [`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md) — Gnani Prisma/Timbre contracts and internal API schemas.
- [`docs/DEPLOYMENT_STRATEGY.md`](docs/DEPLOYMENT_STRATEGY.md) — Single-deployment operational guide.
- [`docs/DEPLOYMENT_VERIFICATION.md`](docs/DEPLOYMENT_VERIFICATION.md) — Single-server deployment test evidence.
- [`docs/FINAL_VERIFICATION_REPORT.md`](docs/FINAL_VERIFICATION_REPORT.md) — Complete audit and test execution matrix.
- [`docs/HOMEPAGE_IMPLEMENTATION_REPORT.md`](docs/HOMEPAGE_IMPLEMENTATION_REPORT.md) — Comprehensive visual identity, color audit, 3D card flipping, and homepage implementation report.
- [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) — Technical constraints and operational boundaries.

