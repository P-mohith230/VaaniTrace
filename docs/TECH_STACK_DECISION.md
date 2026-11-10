# Technology Stack Decision Record

**Project:** VaaniTrace  
**Date:** November 2026  
**Status:** Approved  

---

## 1. Context & Criteria

VaaniTrace requires an architecture that is:
- **Lightweight yet robust:** Responsive user experience with low cognitive overhead.
- **Single-deployment capable:** One deployment artifact and one running server in production.
- **Type-safe:** Consistent interfaces across backend schemas and frontend components.
- **Asynchronous & non-blocking:** Capable of handling streaming file uploads and external API calls without worker thread starvation.

---

## 2. Component Evaluations & Selections

### 2.1 Backend Runtime & Framework

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Python + FastAPI** | Native async/await (`asyncio`), automatic OpenAPI/Swagger documentation, strict Pydantic v2 data validation, simple mounting of static assets for single-deployment. | Python cold start in serverless (not an issue in container/server deployment). | **SELECTED** |
| **Node.js + Express** | Single language across stack. | Weaker native data validation without extensive boilerplate; less suited for data processing/AI pipelines. | Rejected |
| **Go (Gin / Fiber)** | Ultra-fast execution, single binary. | Higher development complexity for dynamic information extraction and JSON manipulation. | Rejected |

**Decision:** **FastAPI (Python 3.11+)** with **Uvicorn** and **Pydantic v2**.

---

### 2.2 Database & Persistence

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **SQLite (via SQLAlchemy async / aiosqlite)** | Zero-configuration, zero network latency, persistent single file, highly portable, standard across edge and single-node deployments. | Not suited for distributed multi-region horizontal scaling. | **SELECTED** |
| **PostgreSQL** | Enterprise ACID, JSONB indexing, high concurrency. | Requires running separate database container/service, violating the simple single-deployment constraint. | Rejected for MVP (migration path supported via SQLAlchemy). |

**Decision:** **SQLite** with asynchronous SQLAlchemy or optimized synchronous connection manager with WAL mode (Write-Ahead Logging) for concurrent reads/writes.

---

### 2.3 HTTP Client & External Integrations

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **HTTPX** | Full async support, HTTP/1.1 and HTTP/2, streaming file upload support, mock transport for testing. | None. | **SELECTED** |
| **Requests** | Mature and ubiquitous. | Synchronous/blocking; blocks the asyncio event loop during network calls. | Rejected |

**Decision:** **HTTPX (async client)** with explicit connection pooling and timeout management.

---

### 2.4 Frontend Framework & Tooling

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **React 18 + TypeScript + Vite** | Instant HMR, static production build, broad ecosystem for rich UI (Lucide icons, Tailwind-compatible modern CSS, HTML5 MediaRecorder). | Requires build step before serving from FastAPI. | **SELECTED** |
| **Jinja2 Server-Rendered Templates** | Zero frontend build step. | Clunky UX for interactive audio recording, dynamic evidence cross-highlighting, and real-time field editing. | Rejected |
| **Next.js** | Full-stack React. | Requires Node.js runtime in production; complicates Python AI/Gnani integrations and single-process Python deployment. | Rejected |

**Decision:** **React 18 + TypeScript + Vite**, compiled to `static/dist/` and served directly by FastAPI via `StaticFiles` and SPA fallback routing.

---

### 2.5 Audio Capture & Processing

- **Browser Audio Capture:** HTML5 `MediaRecorder` API with fallback codecs (`audio/webm;codecs=opus`, `audio/ogg`, or standard WAV converter).
- **Backend Audio Validation:** MIME-type inspection, file size boundary checks (e.g., max 25MB), magic byte validation for WAV (`RIFF`), MP3 (`ID3`/`\xFF\xFB`), OGG (`OggS`), and WebM (`\x1A\x45\xDF\xA3`).

---

### 2.6 Summary of Stack

| Layer | Technology |
|---|---|
| **Application Server** | Uvicorn (ASGI) |
| **Backend Framework** | FastAPI (Python 3.11+) |
| **Data Validation** | Pydantic v2 |
| **Database** | SQLite3 (Persistent file `data/vaanitrace.db`) |
| **ORM / Data Access** | SQLAlchemy 2.0 (with SQLite foreign key enforcement & WAL mode) |
| **External HTTP** | HTTPX (Async) |
| **STT Provider** | Gnani Prisma (v2.5 / v3.0 REST) |
| **TTS Provider** | Gnani Timbre (v2.5 / v3.0 REST) |
| **Frontend Framework** | React 18 + TypeScript |
| **Frontend Build Tool** | Vite |
| **Styling** | Modern responsive design with custom CSS variables, clean typography, and Lucide icons |
| **Testing** | Pytest + HTTPX TestClient (Backend), Vitest/Testing Library (Frontend) |

