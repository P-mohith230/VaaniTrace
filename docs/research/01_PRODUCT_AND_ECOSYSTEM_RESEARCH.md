# 01 — Product & Gnani AI Ecosystem Research

**Document ID:** `VR-RES-001`  
**Author:** Principal AI Product Strategist & Enterprise Solutions Architect  
**Project:** VaaniTrace — Beyond Transcription. Into Action.  
**Classification:** Strategic Technical Research & Feasibility Audit  

---

## 1. Executive Summary & Existing Product Audit

### 1.1 Product Baseline
VaaniTrace is architected as an evidentiary voice-to-action intelligence platform designed to bridge the chasm between raw conversational audio and downstream enterprise accounting.

Its defining axiom:
> *"Transcription tells you what was said. VaaniTrace verifies what needs to happen next."*

In the current working implementation (FastAPI backend + React 18 TypeScript frontend), the system achieves:
1. **Audio Validation & Spooling:** Binary inspection (RIFF/ID3/OggS/WebM headers) with deterministic temporary unlinking to prevent data leaks.
2. **Speech-to-Text Ingestion:** Integrated with Gnani AI's hosted Vachana platform (`https://api.vachana.ai/stt/v3`), passing dual authorization headers (`X-API-Key-ID`, `X-API-Key`, `token`) and auto-supplying candidate language arrays (`multi_lang_codes="en-IN,hi-IN,ta-IN,te-IN,kn-IN"`) when auto-language detection (`indic-auto`) is active.
3. **Envelope Resilience:** Normalizes Gnani's multi-lingual dictionary envelopes (`translations[locale]` and `output.literal[locale]`).
4. **Structured Information Extraction:** Deterministic domain extractors for Business Orders, Meeting Action Items, Field Reports, Customer Complaints, and General Conversations. Includes spoken word-to-number normalization (`"twenty five"` $\rightarrow$ `25`, `"one thousand two hundred"` $\rightarrow$ `1200.00`) and derived mathematical reconciliation (`25 × ₹1,200 = ₹30,000`).
5. **Bidirectional Speech Synthesis:** Gnani Timbre REST endpoint integration (`https://api.vachana.ai/api/v1/tts/inference`) generating neural WAV briefs using the *Nalini* voice.
6. **Multi-Format Evidentiary Export:** Embedded SQLite persistence with SQLite WAL mode, UTF-8 BOM CSV, native `.xlsx` workbooks via OpenPyXL, and TallyPrime XML voucher serialization.

### 1.2 The Strategic Gap
While VaaniTrace operates successfully as a functional end-to-end prototype, standard implementations of voice extraction risk being categorized by hackathon judges and enterprise evaluators as an "API wrapper" or a "speech-to-JSON demo."

To transition VaaniTrace into an enterprise moat, we must evaluate how deeply it integrates into the **full Gnani AI technology stack** and solves structural problems in Indian conversational commerce.

---

## 2. Deep Audit of the Gnani AI Technology Ecosystem

The Gnani AI platform (headquartered in Bengaluru, backed by Samsung Ventures and Info Edge) comprises several proprietary foundational and enterprise layers. Below is an evidence-based audit of each component.

```
+-----------------------------------------------------------------------------------+
|                           GNANI AI ENTERPRISE ECOSYSTEM                            |
+-----------------------------------------------------------------------------------+
|  [FOUNDATIONAL AI LAYER]                                                          |
|  - Prisma STT (v2.5 / v3.0): Deep ASR Engine (Indic Speech, Code-Switching)       |
|  - Timbre TTS (v2.5): Expressive Neural Speech Synthesis (14+ Locales)            |
|  - Evon v3.3 (30B MoE): Sovereign Indian LLM (Artha Stack, 128K Context)          |
|  - Armour365: Passive/Active Voice Biometrics (Anti-Spoofing, Replay Defense)     |
+-----------------------------------------+-----------------------------------------+
                                          |
|  [APPLICATION & AGENTIC LAYER]          v
|  - Assist365: Multi-Channel Conversational Bot & Agent-Assist Suite               |
|  - Plexus: Enterprise Agentic Workflow Orchestration Platform                     |
|  - LiveKit / Pipecat Plugins: Real-Time WebRTC Audio Streaming Connectors         |
+-----------------------------------------------------------------------------------+
```

---

### 2.1 Component 1: Gnani Prisma (Speech-to-Text / ASR)

#### Functional Overview
Prisma is Gnani's proprietary Automatic Speech Recognition engine, engineered specifically for noisy acoustic environments, low-bandwidth telephony audio (8 kHz PSTN/VoLTE), and Indic code-switching (e.g., Hinglish, Tanglish, Kanglish).

#### Technical Specifications & Endpoints
* **Base Gateway:** `https://api.vachana.ai`
* **REST Endpoints:** `POST /stt/v3`, `POST /stt/v2.5`
* **Streaming Protocol:** WebSockets (`wss://api.vachana.ai/stt/v3/stream`) and gRPC.
* **Authentication:** Header `X-API-Key-ID: <KEY>`, `X-API-Key: <KEY>`, or `token: <KEY>`.
* **Payload Format:** Multipart `multipart/form-data` containing `audio_file` (binary), `model` (`prisma-v2.5` or `prisma-v3.0`), `language_code`, and `multi_lang_codes`.
* **Latency Profile:** Tested live at ~207ms compute latency, ~401ms end-to-end latency for 10–15s audio buffers.

#### Integration Classification: `CATEGORY A (Officially Documented & Accessible)`
* **Active Status:** Fully verified and operational in VaaniTrace.

#### Critical Technical Nuances Discovered
1. **Multi-Language Constraints:** When `language_code="indic-auto"` is requested on Prisma v2.5/v3.0 REST endpoints, the API returns HTTP 400 (`INVALID_LANGUAGE_CODE`) unless a comma-separated candidate locale string (`multi_lang_codes="en-IN,hi-IN,ta-IN,te-IN,kn-IN"`) is supplied.
2. **Envelope Variations:** Prisma v3 does not always return a singular `"transcript"` string key. In code-mixed or auto-detected audio, it returns a `translations` mapping (`{"en-IN": "...", "hi-IN": "..."}`) and an `output.literal` mapping. A resilient consumer must inspect both.
3. **Timestamp Granularity:** Synchronous REST `/stt/v3` returns segment-level or sentence-level normalized strings rather than per-word millisecond alignments. Word-level millisecond timestamps require WebSocket streaming or specialized diarization parameters.

---

### 2.2 Component 2: Gnani Timbre (Text-to-Speech / TTS)

#### Functional Overview
Timbre is Gnani's neural Text-to-Speech engine, generating natural, expressive speech across 14+ Indian languages with region-specific prosody and pronunciation.

#### Technical Specifications & Endpoints
* **Base Gateway:** `https://api.vachana.ai`
* **REST Endpoint:** `POST /api/v1/tts/inference`
* **Streaming:** gRPC / WebSockets supported on enterprise tiers.
* **Headers:** `X-API-Key-ID: <KEY>`, `Content-Type: application/json`.
* **Request Schema:**
  ```json
  {
    "text": "String content to synthesize",
    "voice": "Nalini",
    "language": "en-IN",
    "speed": 1.0,
    "model": "timbre-v2.5"
  }
  ```
* **Supported Neural Voices:** *Nalini* (Female - Indian English / Hindi), *Avinash* (Male), and regional language voice profiles.
* **Response:** Direct `audio/wav` binary stream (~24 kHz, 16-bit PCM).

#### Integration Classification: `CATEGORY A (Officially Documented & Accessible)`
* **Active Status:** Fully verified and operational in VaaniTrace.

#### Critical Technical Nuances Discovered
1. **Punctuation Sensitivity:** Number strings like `₹30,000` must be pre-formatted or expanded into words (`"thirty thousand rupees"`) to guarantee natural prosody across all regional voices.
2. **Payload Size:** REST TTS is optimized for conversational turns (< 500 characters). Synthesizing entire transcripts in one call can cause high gateway latency. Summaries must be condensed before synthesis.

---

### 2.3 Component 3: Gnani Evon v3.3 (Sovereign LLM / Reasoning Engine)

#### Functional Overview
Launched under Gnani's **Artha** sovereign AI stack, **Evon v3.3** (`gnani-evon-v3.3-30B-A3B`) is a foundational open-weight Large Language Model engineered for Indian enterprise data residency, sovereign governance, and native Indic reasoning.

#### Technical Specifications
* **Architecture:** Hybrid Mamba–Transformer Mixture-of-Experts (MoE) model.
* **Parameters:** 30 Billion total parameters; ~3 Billion active parameters per token.
* **Base Pretraining:** Derived and continually pretrained using NVIDIA's Nemotron framework.
* **Context Length:** 128,000 tokens (128K).
* **Language Capabilities:** English and 11+ Indian regional languages in native scripts (Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi).
* **Target Workflows:** Native Indic instruction-following, entity extraction, structured JSON output, tool-calling, and RAG.

#### Integration Classification: `CATEGORY D (Proposed Future Integration)`
* **Accessibility:** While the model weights and open-access checkpoints exist on Hugging Face and enterprise private clusters, a public self-serve pay-per-token REST endpoint on `api.vachana.ai` is not generally exposed to standard developer API keys.
* **Strategic Role in VaaniTrace:** In the current phase, VaaniTrace uses high-speed deterministic regex/AST extractors. In Phase B/C, Evon v3.3 represents the ideal sovereign LLM backend to replace rule-based extractors for complex conversational ambiguity without sending enterprise voice data to foreign models (OpenAI/Anthropic).

---

### 2.4 Component 4: Gnani Armour365™ (Voice Biometrics & Provenance)

#### Functional Overview
Armour365 is Gnani's proprietary voice biometrics engine, designed for telephony, contact center, and financial transaction authentication.

#### Technical Specifications & Endpoints
* **API Base Gateway:** `armour365.gnani.ai`
* **Enrollment Threshold:** Minimum **5 to 7 seconds** of natural speech to generate a unique vocal print (voiceprint).
* **Verification Threshold:** Minimum **3 seconds** of speech for biometric verification.
* **Claimed Performance:** Authentication turnaround in `< 500 milliseconds`.
* **Security Defenses:** Built-in anti-spoofing algorithms, synthetic voice clone detection, and acoustic replay attack prevention.
* **SDKs:** Official GitHub repositories include `Gnani-AI/voicebiometric-api-armour365` and `Gnani-AI/gnani-voice-biometric-armour365` (Android).

#### Integration Classification: `CATEGORY B (Officially Documented but Access-Dependent)`
* **Access Requirement:** Requires separate enterprise developer registration, customer approval, and distinct credential tokens via `voicebiometrics.ai` / Gnani business channels. Standard STT developer keys do not grant access to `armour365.gnani.ai`.
* **Strategic Rule for VaaniTrace:** Never simulate or fake an Armour365 response. Architecture must separate generic speaker diarization (Speaker 1 vs Speaker 2) from true biometric authentication.

---

### 2.5 Component 5: Gnani Assist365™ & Agent Builder (Conversational Automation)

#### Functional Overview
Assist365 is Gnani's enterprise omnichannel conversational automation suite, deploying virtual voice and chat agents for contact centers, debt recovery, customer support, and agent assist.

#### Technical Specifications
* **Architecture:** Visual workflow/intent builder connected to Prisma ASR, Timbre TTS, and backend webhooks.
* **Ecosystem Product:** **Plexus** — Gnani's agentic platform enabling multi-step workflows.
* **Developer SDKs:** Open-source integrations via `livekit-plugins-gnani` on GitHub, enabling real-time WebRTC voice agents using LiveKit and Pipecat.

#### Integration Classification: `CATEGORY C (Publicly Described Product, API Availability Enterprise-Tier)`
* **Strategic Role in VaaniTrace:** Assist365 provides the model for how VaaniTrace can trigger outbound interactive confirmation calls or WhatsApp conversational follow-ups.

---

## 3. Gnani Ecosystem Capability Classification Matrix

| Technology | Product Tier | Documented Capabilities | API Access Status | VaaniTrace Classification |
|---|---|---|---|---|
| **Prisma STT v2.5 / v3.0** | Core Foundational ASR | Multipart REST upload, Indic auto-LID, Hinglish code-mixing | Active REST gateway (`api.vachana.ai/stt/v3`) | **A: Officially documented and accessible** |
| **Timbre TTS v2.5** | Core Foundational TTS | Neural Indic synthesis, WAV stream, Nalini/Avinash voices | Active REST gateway (`api.vachana.ai/api/v1/tts/inference`) | **A: Officially documented and accessible** |
| **Armour365™** | Voice Biometrics | Voiceprint enrollment (5-7s), verification (3s), spoof detection | Separate portal (`armour365.gnani.ai`), enterprise approval required | **B: Documented but access-dependent** |
| **Evon v3.3** | Sovereign LLM | 30B MoE (3B active), 128K context, native Indic reasoning | Hugging Face weights, enterprise Artha cluster | **D: Proposed future integration** |
| **Assist365™ / Plexus** | Agentic Conversational AI | Turn-key voice bot builder, contact center routing | Enterprise SaaS portal, LiveKit plugin on PyPI | **C: Publicly described, enterprise-tier access** |
| **Word-Level Millisecond Alignment** | Telephony ASR Feature | Word-by-word timestamp coordinates (`start_ms`, `end_ms`) | Standard REST v3 returns text; timestamps require WebSocket stream | **E: Unsupported in synchronous REST mode** |

---

## 4. Architectural Boundaries: What Is Built vs. What Is Proposed

To maintain academic and professional credibility during hackathon evaluation, VaaniTrace draws a clear line between **working codebase features** and **strategic proposals**:

```
+-----------------------------------------------------------------------------------+
|                        VERIFIED WORKING IMPLEMENTATION                            |
|  - Real Gnani Prisma v2.5 REST STT with multi_lang_codes auto-injection           |
|  - Real Gnani Timbre v2.5 REST TTS audio brief synthesis                          |
|  - Resilient translations & output.literal response parsing                       |
|  - Deterministic Spoken-Word-to-Number Parser (words_to_number)                    |
|  - Mathematical Derivation Engine (Formula validation & recalculation)            |
|  - Character-Offset Transcript Evidence Linking (EvidenceRef)                     |
|  - Multi-Format Exporters: UTF-8 BOM CSV, Styled .xlsx (OpenPyXL), TallyPrime XML |
|  - Single-Deployment FastAPI + React 18 production bundle (Port 8000)             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         PROPOSED STRATEGIC INNOVATIONS                            |
|  - Closed-Loop Confirm-Before-Commit IVR / WhatsApp Dispatch (Assist365)          |
|  - Verified Speaker Provenance with Armour365 Voiceprint Authentication           |
|  - Sub-word Acoustic Confidence Heatmaps & Out-of-Vocabulary Flags                |
|  - Evon v3.3 Sovereign LLM Structured Extraction Replacement                      |
|  - Live Bi-directional Tally XML HTTP Webhook Sync                                |
+-----------------------------------------------------------------------------------+
```

By distinguishing between functional reality and roadmap ambition, VaaniTrace presents as an enterprise solution built on an auditable engineering foundation.

