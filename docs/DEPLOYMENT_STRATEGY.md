# VaaniTrace — Single-Deployment Strategy

---

## 1. Unified Single-Server Deployment Architecture

VaaniTrace eliminates the complexity of coordinating separate frontend and backend hosting by unifying the entire application into a single deployable unit.

```
                      +---------------------------------------+
                      |         FastAPI Web Server            |
                      |        (Python 3.11+, Port 8000)       |
                      |                                       |
                      |  1. /api/*       -> REST API Handlers |
                      |  2. /assets/*    -> Static Assets     |
                      |  3. /* (catchall)-> static/dist/index |
                      +---------------------------------------+
                                          |
                      +---------------------------------------+
                      |       Persistent Storage (data/)      |
                      |  - SQLite (data/vaanitrace.db)        |
                      |  - Temp Uploads (data/uploads/)       |
                      +---------------------------------------+
```

---

## 2. Environment Configuration

All settings are managed via `.env` loaded into `app.config.Settings`:

| Variable | Default | Purpose |
|---|---|---|
| `APP_ENV` | `production` | Environment mode (`development` / `production`) |
| `PORT` | `8000` | Application listen port |
| `HOST` | `0.0.0.0` | Listen IP interface |
| `DATABASE_URL` | `sqlite:///data/vaanitrace.db` | SQLite database URI |
| `GNANI_API_KEY` | *(None)* | Official Gnani AI API key |
| `GNANI_BASE_URL` | `https://api.vachana.ai` | Base URL for Gnani STT and TTS |
| `GNANI_STT_MODEL` | `prisma-v2.5` | Target speech-to-text model |
| `GNANI_TTS_MODEL` | `timbre-v2.5` | Target text-to-speech model |
| `DATA_DIR` | `./data` | Persistent data directory |
| `STATIC_DIR` | `./static/dist` | Compiled frontend directory |

---

## 3. Build & Deployment Lifecycle

### Step 1: Install Dependencies
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2: Build Frontend Assets
```bash
cd frontend && npm run build && cd ..
```
This compiles React + TypeScript into optimized static production bundles placed in `static/dist/`.

### Step 3: Run Application Server
```bash
python -m app.main
# Or:
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The application is now accessible at `http://localhost:8000`:
- Web UI at `http://localhost:8000/`
- API documentation at `http://localhost:8000/docs`
- API endpoints at `http://localhost:8000/api/*`

---

## 4. Single Dockerfile Deployment (Optional Container Target)

```dockerfile
# Multi-stage build for optimal image size
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS runner
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
COPY --from=frontend-builder /build/dist ./static/dist
RUN mkdir -p data/uploads

EXPOSE 8000
ENV PORT=8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
