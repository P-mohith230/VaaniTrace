# VaaniTrace: Deep Research & Technical Analysis Report

**Project:** VaaniTrace — Multilingual Voice-to-Action Intelligence Platform  
**Date:** November 2026  
**Status:** Completed  
**Author:** Full-Stack & AI Systems Architecture Team  

---

## 1. Executive Summary

VaaniTrace addresses a critical bottleneck in multilingual voice communications: converting spoken conversations into structured, verified, action-ready data without losing traceability to what was actually said. In commercial telephony, meetings, field reports, and customer service across India and global markets, speech recognition alone is insufficient—stakeholders need structured action items, order commitments, entity extractions, and direct evidence linkages back to original transcripts.

This research document compiles verified findings on:
1. **Gnani AI Platform & APIs** (Prisma v2.5/v3.0 STT & Timbre v2.5/v3.0 TTS).
2. **Open-Source References & Architectural Best Practices** for audio capture, transcription processing, and structured extraction.
3. **Single-Deployment Architecture Patterns** (Unified FastAPI + React application).
4. **Evidence Mapping Mechanics** for verifiable, auditable extraction.

---

## 2. Gnani AI API Deep Dive

### 2.1 Overview of Gnani AI Capabilities
Gnani.ai provides India-first conversational speech AI models designed for telephony audio (8kHz PSTN/VoIP), regional accents, and code-mixed speech (e.g., Hinglish, Kanglish, Tanglish). 

* **Documentation Host:** `https://docs.gnani.ai/`
* **API Gateway Base URL:** `https://api.vachana.ai`
* **Authentication Method:** Header `X-API-Key-ID: <GNANI_API_KEY>`

---

### 2.2 Gnani Prisma Speech-to-Text (STT) Analysis

#### Target Models
- **Prisma v2.5:** Target model specified for the core platform. Highly tuned for telephony, regional Indian accents, and conversational audio.
- **Prisma v3.0:** Latest flagship multi-lingual model with automatic language detection (`indic-auto`).

#### REST Transcription Endpoint
- **URL:** `POST https://api.vachana.ai/stt/v3` (and `/stt/v2.5`)
- **Protocol:** HTTPS REST
- **Request Format:** `multipart/form-data`
- **Headers:**
  ```http
  X-API-Key-ID: <GNANI_API_KEY>
  ```
- **Form Fields:**
  - `audio_file`: Binary audio content (supported containers: WAV, MP3, FLAC, OGG, WebM, AAC). Telephony 8kHz and high-fidelity 16kHz/44.1kHz/48kHz PCM supported.
  - `model`: `"prisma-v2.5"` (or `"prisma-v3.0"`).
  - `language_code`: Language identifier. Supports `"indic-auto"` (auto-LID), `"en-IN"` (Indian English), `"hi-IN"` (Hindi), `"ta-IN"` (Tamil), `"te-IN"` (Telugu), `"kn-IN"` (Kannada), `"mr-IN"` (Marathi), `"bn-IN"` (Bengali), `"gu-IN"` (Gujarati), `"pa-IN"` (Punjabi), `"ml-IN"` (Malayalam).
  - `output_format`: Optional formatting style (`"transcribe"`, `"verbatim"`, `"code-mix"`, `"transliterate"`).

#### Response Schema
- **Success (`200 OK`):**
  ```json
  {
    "success": true,
    "request_id": "019fd17d-1106-7265-88ab-3ed12d029292",
    "transcript": "नमस्ते, मुझे बीस बॉक्स मंगवाने हैं कल तक।",
    "model": "prisma-v2.5",
    "detected_language_code": "hi-IN",
    "processing_time": 0.58
  }
  ```
- **Key Behavioral Characteristics:**
  - `transcript` is returned as a plain string.
  - Empty or silent audio files return HTTP `200` with `"transcript": ""`.
  - Errors return HTTP status codes:
    - `401 Unauthorized`: Missing or invalid `X-API-Key-ID`.
    - `400 Bad Request`: Corrupted audio file or unsupported audio container.
    - `429 Too Many Requests`: Rate limit reached.
    - `500 Internal Server Error`: Backend provider failure.

---

### 2.3 Gnani Timbre Text-to-Speech (TTS) Analysis

#### Target Models
- **Timbre v2.5:** Production Indian-language voice synthesis model with natural cadences.
- **Timbre v3.0:** Advanced synthesis with expressive emotional tags (`<whispers>`, `<laugh>`, `<pauses>`).

#### REST Synthesis Endpoint
- **URL:** `POST https://api.vachana.ai/api/v1/tts/inference`
- **Protocol:** HTTPS REST
- **Headers:**
  ```http
  X-API-Key-ID: <GNANI_API_KEY>
  Content-Type: application/json
  ```
- **Request Body (JSON):**
  ```json
  {
    "text": "Your order for 20 boxes has been recorded and scheduled for delivery tomorrow.",
    "voice": "Nalini",
    "model": "timbre-v2.5",
    "language": "en-IN",
    "speed": 1.0,
    "audio_config": {
      "encoding": "linear_pcm",
      "container": "wav",
      "num_channels": 1,
      "sample_rate": 24000,
      "sample_width": 2
    }
  }
  ```
- **Voices Available:** `"Nalini"`, `"Avinash"`, `"Pooja"`, `"Rahul"`, etc.
- **Response Format:**
  - Status: `200 OK`
  - Content-Type: `audio/wav`
  - Response Body: **Raw binary audio bytes** (WAV container containing uncompressed 16-bit PCM).

---

## 3. Evidence Mapping Mechanics

A core differentiator of VaaniTrace is **verifiable evidence mapping**: every extracted field must link directly to the supporting transcript passage.

### 3.1 Granular Text Alignment Architecture
Because STT REST responses return the transcript as normalized text without word-level millisecond timestamps unless streaming alignment is enabled, our backend implements a hybrid alignment algorithm:
1. **Sentence & Clause Segmentation:** Deconstructs the transcript into distinct indexed utterance segments:
   `Segment[i] = { id: i, text: "...", start_char: N, end_char: M }`.
2. **Exact Substring Matching:** Scans the segmented transcript for the exact phrase supporting the extraction.
3. **Fuzzy & Semantic Windowing:** For normalized entities (e.g., extracted `₹24,000` matching spoken `"chaubees hazaar rupaye"` or `"24 thousand rupees"`), locates the enclosing clause or sentence segment.
4. **Evidence Classification:**
   - `spoken`: Directly asserted verbatim in the conversation.
   - `inferred`: Reasonably deduced from context (e.g., priority deduced from "deliver immediately").
   - `calculated`: Mathematical derivations (e.g., Total = Quantity × Unit Price).
   - `manual`: Created or edited by a human operator.
5. **Interactive UI Cross-Highlighting:** Clicking an extracted field highlights its corresponding transcript segment; clicking a transcript segment filters or highlights associated extracted fields.

---

## 4. Single-Deployment Architecture Strategy

To prevent operational overhead, dual-port CORS conflicts, and mismatched deployments, VaaniTrace uses an **integrated single-server deployment**:

```
+--------------------------------------------------------------+
|                    VaaniTrace Application                    |
|                      (Single Server: 8000)                   |
|                                                              |
|  +---------------------------+  +-------------------------+  |
|  |     Frontend Web UI       |  |     FastAPI Backend     |  |
|  |  React + Vite (Built)     |  |                         |  |
|  |  Static Files (/assets/*) |  |  - /api/health          |  |
|  |  SPA Catch-all Router     |  |  - /api/transcribe      |  |
|  |                           |  |  - /api/extract         |  |
|  |                           |  |  - /api/speech          |  |
|  |                           |  |  - /api/records         |  |
|  +---------------------------+  +-------------------------+  |
|                                                              |
|                    Local SQLite Database                     |
|                   data/vaanitrace.db                         |
+--------------------------------------------------------------+
```

### Key Advantages:
1. **Zero CORS Friction in Production:** Frontend assets and API endpoints share the identical origin (`http://host:port/api/*`).
2. **Single Process Lifecycle:** One command (`python -m app.main` or `uvicorn app.main:app`) runs both API and web UI.
3. **Developer Flexibility:** During active UI development, Vite's dev server proxies `/api` requests to port 8000. When built (`npm run build`), FastAPI serves `static/dist/` seamlessly.
4. **Persistent Local Data:** SQLite database and temporary files are isolated in `data/`, which can be volume-mounted on Docker/container platforms.

---

## 5. Security & Privacy Guardrails

1. **Zero Client Secret Exposure:** `GNANI_API_KEY` is strictly held in server-side environment variables and never bundled into frontend assets.
2. **Temporary File Life Cycle:** Audio uploaded for transcription is written to a secured temporary path, validated for magic bytes / container type, processed via streaming HTTP to Gnani, and cleaned up promptly.
3. **Non-Blocking Execution:** External HTTP calls utilize asynchronous HTTPX with strict connection and read timeouts (30s) to prevent thread exhaustion.
4. **Safe Error Masking:** Stack traces and internal server details are logged server-side and masked behind user-friendly JSON error schemas.

