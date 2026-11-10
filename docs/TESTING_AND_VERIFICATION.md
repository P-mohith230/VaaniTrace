# VaaniTrace — Testing and Verification Strategy

---

## 1. Testing Philosophy

VaaniTrace distinguishes sharply between:
- **Real Provider API Tests:** Live integration against `api.vachana.ai` using verified API credentials.
- **Mocked Provider Tests:** Unit and contract tests using mocked HTTP transports (HTTPX Mock / Respx) to ensure test stability, continuous integration reliability, and zero unexpected external costs.
- **Local Integration Tests:** Tests verifying the entire FastAPI + SQLite database + static routing workflow.
- **End-to-End Browser Tests:** Verification of UI components, audio recording, state synchronization, and file export.

> **Rule:** Never present a mocked test as a successful live Gnani API test.

---

## 2. Test Plan Matrix

| Test Suite | Focus Area | Execution Tool | Target |
|---|---|---|---|
| `test_health.py` | Health endpoints, database check, Gnani status | Pytest + AsyncClient | `/api/health`, `/api/health/gnani` |
| `test_audio_validation.py` | Audio format headers, magic bytes, size limits | Pytest | `app.utils.audio_validation` |
| `test_transcription.py` | Prisma STT adapter, mocked payloads, error handling | Pytest + Respx/Mock | `/api/transcribe` |
| `test_extraction.py` | Domain extractors (Orders, Meetings, Reports, etc.) | Pytest | `app.services.extractor` |
| `test_evidence_mapper.py` | Sentence segmentation, phrase offsets, evidence categorization | Pytest | `app.services.evidence_mapper` |
| `test_records.py` | SQLite CRUD, validation updates, JSON/CSV exports | Pytest | `/api/records/*` |
| `test_timbre.py` | Timbre TTS adapter, WAV responses, failure resilience | Pytest | `/api/speech` |
| Frontend Unit / Build | TypeScript compilation, React component rendering, Vite build | Vite / TSC / Vitest | `frontend/` |
| End-to-End Workflow | Audio upload -> Transcribe -> Extract -> Link -> Edit -> Save -> Export | Automated Test Runner | Integrated App |

---

## 3. Verification Criteria & Status Definitions

- **PASS:** The test was executed, all assertions matched, and the expected result was produced.
- **FAIL:** The test was executed and threw an assertion error or unexpected exception.
- **NOT TESTED:** The test suite or step was not executed.
- **BLOCKED:** The test could not run because a mandatory dependency, system permission, or valid external API credential was unavailable.

