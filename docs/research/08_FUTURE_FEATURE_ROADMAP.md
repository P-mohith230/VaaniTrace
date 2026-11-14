# 08 — FUTURE FEATURE ROADMAP & ENGINEERING PHASES

**Document Reference:** `VT-RES-008`  
**Classification:** Strategic Product Roadmap & Multi-Phase Engineering Specifications  
**Product:** VaaniTrace — Voice-to-Action Trust Engine  
**Author:** Principal AI Product Strategist & Enterprise Solutions Architect  

---

## 1. Roadmap Architecture & Execution Principles

To ensure engineering rigor, this roadmap adheres to three strict guidelines:
1. **Zero Premature Code Inflation:** Do not write speculative production code before requirements and user validation benchmarks are locked.
2. **Deterministic Fallbacks:** Every advanced speech AI dependency (e.g., biometrics or local SLMs) must have an automated, graceful degradation path.
3. **Auditability by Default:** No new feature may bypass the cryptographic evidence anchor and human approval gates.

```
[ PHASE A: HACKATHON POLISH ]  ===>  [ PHASE B: POST-HACKATHON ]  ===>  [ PHASE C: PILOT MVP ]  ===>  [ PHASE D: ENTERPRISE ]
      (2 - 3 Days)                         (2 - 4 Weeks)                     (2 - 3 Months)                 (6 - 12 Months)
- Closed-Loop Voice Readback         - Interactive Commitment Graph     - WhatsApp Cloud Webhook       - Multi-Tenant SOC2/ISO
- Client Acoustic SNR Pre-Gate       - Physical Challan OCR Auditor     - Real-Time Mandi Pilot        - Sovereign Evon 30B MoE
- Indic Colloquial Unit Normalizer   - SQLite to PostgreSQL Migration   - Tally XML Live Sync Agent    - Armour365 Biometrics
```

---

## 2. Phase Breakdown & Engineering Specifications

### Phase A: Hackathon Polish (2–3 Days Sprint)
*Focus: Polish the live demonstration flow, showcase the full Gnani stack (Prisma + Timbre), and eliminate user friction without modifying core schemas.*

| Feature | Technical Architecture | Success Metric | Risk Mitigation |
| :--- | :--- | :--- | :--- |
| **A1. Closed-Loop Voice Readback Modal** | Wire existing `gnani_client.py:synthesize_speech` (Timbre TTS) to generate a summary audio buffer upon extraction completion. Add an in-browser audio player with a wine-red "Verify Spoken Order" waveform. | 100% audio generation under 1.2s latency for 1-sentence summaries. | If Timbre API times out or exhausts credits, fall back to browser Web Speech API with explicit UI indicator. |
| **A2. Client-Side Acoustic SNR Pre-Gate** | Web Audio API `AudioContext` analyzer calculating real-time RMS amplitude and spectral noise during recording. Warns users: *"Microphone volume too low or background noise exceeds 70dB"* before upload. | Zero empty or corrupted audio submissions to Gnani STT. | Purely client-side TypeScript; does not consume backend processing or API credits. |
| **A3. Colloquial Indic Unit Normalizer** | Ingestion-layer regex and lexicon mapper (`peti` $\rightarrow$ `boxes`, `katta` $\rightarrow$ `sacks`, `quintal` $\rightarrow$ `100 kg`) executed during entity normalization. | Accurate unit conversion across 25 standard Indian trade terms. | Preserves the verbatim spoken word in the evidence tooltip while emitting the SI unit in the data cell. |
| **A4. UI "Scroll to Verify" Pill & Visual Feedback** | Floating wine-red notification banner that smoothly scrolls the viewport to the structured verification table immediately upon successful audio processing. | Eliminates user confusion after file upload on mobile viewports. | Vanilla CSS smooth scrolling; zero external package dependencies. |

---

### Phase B: Post-Hackathon Prototype Hardening (2–4 Weeks)
*Focus: Transition from local JSON/mock storage to a resilient multi-user service layer; deepen analytical visualization.*

| Feature | Technical Architecture | Success Metric | Dependencies |
| :--- | :--- | :--- | :--- |
| **B1. Interactive Commitment Knowledge Graph** | FastAPI endpoint computing directed acyclic commitment graphs (DAGs) from conversation entities; rendered in React using Cytoscape.js or @xyflow/react. | Visual node-edge representation of multi-speaker promises and deadlines. | FastAPI, NetworkX, Cytoscape.js. |
| **B2. Voice-vs-Challan OCR Cross-Auditor** | Ingest photo of handwritten lorry receipt (*challan* / *bilty*); extract text via Tesseract OCR or Vision LLM; execute Levenshtein distance matching against voice PO. | Automated red/green cell discrepancy highlighting across item, quantity, and rate. | OCR pipeline, fuzzy matching heuristics. |
| **B3. Relational Database Migration** | Migrate from local disk-based JSON store (`backend/data/records/`) to PostgreSQL with Alembic migrations and `pgvector` for semantic transcript search. | Sub-50ms query latency across 50,000+ historical voice records. | PostgreSQL 16, SQLAlchemy 2.0, Docker Compose. |
| **B4. Enhanced Dual-Language Token Alignment** | Improved string alignment algorithm mapping Latin-transliterated and native Indic script tokens for millisecond audio highlighting. | Alignment error margin reduced below $\pm 1$ word across code-switched sentences. | Dynamic programming sequence alignment (Needleman-Wunsch). |

---

### Phase C: Pilot-Ready Field MVP (2–3 Months)
*Focus: Field deployment with 5 active MSME pilot customers in Bangalore and Indore wholesale markets.*

| Feature | Technical Architecture | Success Metric | Dependencies |
| :--- | :--- | :--- | :--- |
| **C1. WhatsApp Cloud Business API Integration** | Webhook endpoint receiving inbound WhatsApp voice notes (.ogg Opus), passing through Gnani Prisma, and replying with an interactive confirmation template with "Approve" / "Edit" buttons. | End-to-end voice-note-to-WhatsApp-approval flow completed in $<8$ seconds. | Meta Cloud API Developer Account, Webhook ingress (Cloudflare Tunnel). |
| **C2. Desktop TallyPrime XML Sync Daemon** | Lightweight local Windows service watching a local folder or polling the VaaniTrace cloud API; automatically injects generated XML vouchers into running TallyPrime instances via ODBC/HTTP port 9000. | Zero-click order entry into TallyPrime general ledger upon cloud approval. | Windows Service (PyInstaller), Tally XML HTTP interface. |
| **C3. Acoustic Anonymization & Ephemeral Storage Engine** | Automated PII masking pipeline stripping phone numbers, bank details, and personal names from transcript buffers before persisting to long-term storage. | Zero PII leaks in customer audit logs; full DPDP Act compliance. | Presidio / custom Indic PII regex engine, AES-256 GCM encryption. |
| **C4. Offline-First PWA Field Audio Cache** | ServiceWorker and IndexedDB audio queue capturing field voice notes when cellular connectivity drops (rural agricultural mandis); automatic background sync upon reconnection. | Zero lost recordings during network dropouts; automatic exponential backoff retry. | Workbox PWA, IndexedDB API. |

---

### Phase D: Enterprise-Scale Product & Ecosystem (6–12 Months)
*Focus: Sovereign on-premise deployments, multi-tenant enterprise governance, and direct integration with Gnani's flagship models.*

| Feature | Technical Architecture | Success Metric | Dependencies |
| :--- | :--- | :--- | :--- |
| **D1. Sovereign Evon v3.3 30B MoE On-Prem Inference** | Deploy Gnani's open-weight sovereign LLM (`gnani-evon-v3.3-30B-A3B`) inside enterprise customer VPCs using vLLM / TensorRT-LLM on dual NVIDIA A100/H100 GPUs. | 100% data sovereignty; zero data egress outside corporate perimeter; $<350$ms TTFT. | NVIDIA GPU cluster, vLLM, Linux enterprise host. |
| **D2. Armour365 Voice Biometric Enterprise Gate** | Full integration with Gnani Armour365 API (`voicebiometrics.ai`); mandatory 3-second speaker voiceprint verification before executing POs above ₹1,00,000 value. | $<0.1\%$ False Acceptance Rate (FAR); military-grade anti-spoofing and replay attack defense. | Armour365 Enterprise Portal credentials & API contract. |
| **D3. Multi-Tenant Enterprise Role-Based Access (RBAC)** | Granular permission hierarchies (Clerk, Dispatch Manager, CFO, Auditor) with tamper-evident cryptographic audit logs for every field override and approval. | Full SOC2 Type II, ISO 27001, and Indian DPDP Act 2023 compliance certification. | Auth0 / Keycloak, OpenTelemetry distributed tracing, immutable audit logs. |
| **D4. Voice-Driven Omnichannel Commerce Gateway** | Bidirectional voice negotiation engine integrated with ONDC (Open Network for Digital Commerce) protocol for automated vernacular B2B bidding and procurement. | Automated catalog discovery and PO generation across sovereign digital networks. | ONDC Beckn protocol, Beckn-ONDC adapter. |

---

## 3. Resource Allocation & Engineering Matrix

```
+---------------------------------------------------------------------------------------+
| PHASE           BACKEND / AI DEV      FRONTEND / UX         QA & FIELD TEST   BUDGET  |
+---------------------------------------------------------------------------------------+
| Phase A (3d)    1 Senior Fullstack    1 UI Designer         Manual / Smoke    $0 (POC)|
| Phase B (4w)    1 Backend, 1 Speech   1 React Specialist    1 QA Engineer     $4,000  |
| Phase C (3m)    2 Backend, 1 DevOps   1 Fullstack Mobile    2 Field Pilots    $25,000 |
| Phase D (12m)   4 Core Eng, 1 ML Eng  2 Frontend, 1 PM      Enterprise Audit  $180,000|
+---------------------------------------------------------------------------------------+
```

