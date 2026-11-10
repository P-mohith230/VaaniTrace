# VaaniTrace — Single-Deployment Verification Report

**Date:** November 2026  
**Status:** PASS (Verified in Production Single-Deployment Mode)  
**Environment:** Windows / Python 3.13 / Node v22 / SQLite3  

---

## 1. Unified Single-Deployment Architecture Audit

| Audit Requirement | Implementation Status | Evidence / Verification Method |
|---|---|---|
| **Single Root Project** | **PASS** | Monorepo layout with root `package.json`, root `requirements.txt`, and unified `app/` entrypoint. |
| **Single Deployment Unit** | **PASS** | One application server (`uvicorn app.main:app`) serving both API routes and built static UI assets. |
| **Single Port Delivery** | **PASS** | Both `/` (React UI) and `/api/*` (REST endpoints) served from port 8000 without CORS or cross-origin friction. |
| **No Microservices** | **PASS** | Embedded SQLite database (`data/vaanitrace.db`), in-memory/thread pooling, local static file mounting. |
| **Production Build Assets** | **PASS** | Vite compiled `frontend/` into `static/dist/` (HTML: 0.99 kB, CSS: 7.77 kB, JS: 212.53 kB). |
| **Persistent Storage** | **PASS** | SQLite database file stored in `data/vaanitrace.db`, uploads spooled and cleaned up in `data/uploads/`. |

---

## 2. Verification Test Results

Executed via automated test runner `python verify_e2e.py`:

```text
=================================================================
VAANITRACE FULL INTEGRATION & WORKFLOW VERIFICATION SUITE
=================================================================

[STEP 1] Initializing SQLite database schemas...
-> SUCCESS: Database initialized without error.

[STEP 2] Verifying Single-Deployment Static Web UI...
-> SUCCESS: Production React SPA served at '/' (HTTP 200)
-> SUCCESS: Static CSS bundle served (7771 bytes)
-> SUCCESS: SPA client routing catch-all verified at '/workspace'

[STEP 3] Verifying /api/health diagnostic...
-> SUCCESS: Health status=healthy, db=connected

[STEP 4] Verifying /api/health/gnani diagnostic...
-> SUCCESS: Gnani STT=prisma-v2.5, TTS=timbre-v2.5, Configured=False

[STEP 5] Testing Structured Information Extraction (Business Order)...
-> SUCCESS: Extracted quantity=20, price=₹1,200.00
-> SUCCESS: Derived calculated total=₹24,000.00 (Formula: Calculated: 20 (quantity) × ₹1,200.00 (unit price) = ₹24,000.00)
-> SUCCESS: Evidence linked: '20 boxes' at chars 46-54
-> SUCCESS: Action items extracted: Fulfill and deliver order (surgical gloves) (Due: Friday)

[STEP 6] Testing Record Database Persistence (SQLite CRUD)...
-> SUCCESS: Record created with ID: a3d59741-f55d-4c65-a826-81e5b5822086 (Title: 'Medical Center Wholesale Supply Order')

[STEP 7] Testing Human Verification & Manual Edit Handling...
-> SUCCESS: Manual edit preserved: original='20' -> current='22' (evidence_type='manual')

[STEP 8] Testing JSON and CSV Structured Data Export...
-> SUCCESS: JSON export verified (1180 bytes)
-> SUCCESS: CSV export verified (693 bytes)
-> SUCCESS: Test record cleanly removed from SQLite.

=================================================================
VERIFICATION COMPLETE: ALL 8 CORE PLATFORM WORKFLOWS PASSED!
=================================================================
```

---

## 3. Production Startup Command

To launch the full unified application:

```bash
# 1. Build frontend assets (only needed once or after modifying frontend)
npm run build

# 2. Start the unified application server
python -m app.main
```

Then visit `http://localhost:8000` in any web browser.
