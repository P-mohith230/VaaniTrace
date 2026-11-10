# VaaniTrace — Final Architecture Design

---

## 1. Unified Single-Deployment Paradigm

VaaniTrace is configured to run as an integrated single application unit:
- **Application Server:** Python FastAPI running on Uvicorn.
- **Frontend Delivery:** Built static assets in `static/dist/` mounted at `/` with fallback routing to `index.html` for client-side navigation.
- **API Endpoints:** Mounted at `/api/*`.
- **Database:** Local SQLite engine at `data/vaanitrace.db`.

```
                      +-----------------------------+
                      |         Web Client          |
                      |  (Desktop / Mobile Browser) |
                      +--------------+--------------+
                                     |
                                     | HTTP: 8000
                                     v
                      +-----------------------------+
                      |      FastAPI Server         |
                      |  +-----------------------+  |
                      |  | Static Mount (React)  |  |
                      |  | / -> static/dist/     |  |
                      |  +-----------------------+  |
                      |  | REST API Router       |  |
                      |  | /api/health           |  |
                      |  | /api/transcribe       |  |
                      |  | /api/extract          |  |
                      |  | /api/speech           |  |
                      |  | /api/records          |  |
                      |  +-----------------------+  |
                      +--------------+--------------+
                                     |
                      +--------------+--------------+
                      |                             |
                      v                             v
           +--------------------+         +--------------------+
           |   Local SQLite DB  |         |   Gnani AI Cloud   |
           | data/vaanitrace.db |         | api.vachana.ai     |
           +--------------------+         +--------------------+
```

---

## 2. API Contract & Endpoint Overview

| Endpoint | Method | Input | Output | Purpose |
|---|---|---|---|---|
| `/api/health` | `GET` | - | `{ status, backend, database, version }` | System health check (independent of 3rd party) |
| `/api/health/gnani` | `GET` | - | `{ configured, connectivity, model, error }` | Real Gnani credential & connectivity status |
| `/api/transcribe` | `POST` | `multipart/form-data (file, model, language)` | `{ transcript, detected_language, segments, request_id }` | Audio transcription via Gnani Prisma |
| `/api/extract` | `POST` | `{ transcript, record_type, segments }` | `StructuredExtractionResponse` | Structured extraction with evidence links |
| `/api/speech` | `POST` | `{ text, voice, language, speed }` | Audio WAV binary or `{ audio_base64, content_type }` | Spoken summary via Gnani Timbre |
| `/api/records` | `GET` | `?type=&status=&search=&limit=&offset=` | `List[RecordSummary]` | Query saved records |
| `/api/records` | `POST` | `RecordCreatePayload` | `RecordDetail` | Save verified/unverified record |
| `/api/records/{id}` | `GET` | `record_id` | `RecordDetail` | Retrieve record with fields & evidence |
| `/api/records/{id}` | `PUT` | `RecordUpdatePayload` | `RecordDetail` | Update record, fields, and verification |
| `/api/records/{id}` | `DELETE` | `record_id` | `{ success: true }` | Delete record |
| `/api/records/{id}/export` | `GET` | `?format=json\|csv` | Downloadable file attachment | Export structured data |

---

## 3. Reliability & Fallback Engineering

1. **Graceful Degradation:**
   - If `GNANI_API_KEY` is not configured, the health endpoint clearly reports `configured: false`.
   - Transcription endpoints reject requests with clear instructions rather than crashing.
   - Timbre text-to-speech failure never interrupts the core extraction and recording workflow; the user retains the text summary and can complete their work.
2. **Resource Hygiene:**
   - Uploaded audio streams write directly to temporary spool files and are deleted in a `finally:` block.
   - MediaRecorder browser streams release all hardware tracks upon recording stop or component unmount.
   - Object URLs generated in the browser for audio previews are cleanly revoked via `URL.revokeObjectURL()`.
3. **Database Concurrency:**
   - SQLite is initialized with `PRAGMA journal_mode=WAL;` and `PRAGMA synchronous=NORMAL;` for multi-read concurrency.

