# VaaniTrace — Implementation Plan

---

## 1. Plan Overview

This plan outlines the systematic sequence for implementing, testing, and verifying the VaaniTrace platform.

---

## 2. Phase Breakdown

### Phase A: Architecture Setup & Core Backend
- [x] Deep research into Gnani Prisma (v2.5/v3.0) and Timbre (v2.5/v3.0) APIs.
- [x] Technical stack and single-deployment design decisions.
- [x] Initial documentation creation (`PROJECT_OVERVIEW`, `ARCHITECTURE`, `TECH_STACK_DECISION`, etc.).
- [ ] Initialize Python environment, `requirements.txt`, and project structure.
- [ ] Implement `app/config.py` with environment-based configuration and safe defaults.
- [ ] Implement `app/database.py` and `app/models.py` (SQLite, SQLAlchemy 2.0).
- [ ] Implement `app/schemas.py` with strict Pydantic v2 schemas for all domain entities.

### Phase B: External Service Adapters & Core Logic
- [ ] Implement `app/services/gnani_prisma.py` (STT client with timeouts, validation, and clear error mapping).
- [ ] Implement `app/services/gnani_timbre.py` (TTS client with WAV audio streaming and error resilience).
- [ ] Implement `app/utils/audio_validation.py` (MIME, size, magic bytes verification).
- [ ] Implement `app/utils/file_storage.py` (Safe temporary spooling and cleanup).
- [ ] Implement `app/services/extractor.py` (Domain extraction for orders, meetings, reports, complaints, and conversations).
- [ ] Implement `app/services/evidence_mapper.py` (Sentence segmentation, exact/semantic passage matching, evidence categorization).
- [ ] Implement `app/services/export_service.py` (JSON and CSV serialization).

### Phase C: API Routes & App Entrypoint
- [ ] Implement `/api/health` and `/api/health/gnani`.
- [ ] Implement `/api/transcribe` with multipart audio upload handling.
- [ ] Implement `/api/extract` with evidence linking.
- [ ] Implement `/api/speech` with binary audio delivery.
- [ ] Implement `/api/records` CRUD and export endpoints.
- [ ] Implement `app/main.py` with unified static mount, SPA fallback router, and CORS configuration for dev mode.

### Phase D: Automated Backend Testing
- [ ] Configure `pytest`, `pytest-asyncio`, and test fixtures in `tests/conftest.py`.
- [ ] Unit tests for audio validation and MIME checks.
- [ ] Unit tests for Prisma STT service (mocked and error responses).
- [ ] Unit tests for Timbre TTS service.
- [ ] Unit tests for information extraction across all 5 record types.
- [ ] Unit tests for evidence mapping accuracy and offset calculations.
- [ ] Integration tests for all `/api/*` endpoints.
- [ ] Verification tests for database CRUD and export formats.

### Phase E: Frontend Implementation (React + TypeScript + Vite)
- [ ] Initialize Vite React + TypeScript configuration.
- [ ] Implement centralized API client (`src/services/api.ts`) with relative URLs and error interception.
- [ ] Implement domain types in `src/types/index.ts`.
- [ ] Implement modern, responsive UI design system with clean CSS.
- [ ] Build UI components:
  - Header & navigation.
  - `AudioUploader` (drag-and-drop, validation, playback).
  - `AudioRecorder` (browser microphone, live duration timer, waveform/visualizer).
  - `TranscriptViewer` (interactive evidence highlighting).
  - `ExtractionPanel` (structured fields, calculated totals, status indicators).
  - `EvidenceViewer` (context drawer/tooltip for highlighted evidence).
  - `VerificationControls` (mark verified, edit values, flag review).
  - `AudioPlayer` (spool playback of spoken summary from Timbre).
  - `RecordCard` & Record Details view.
  - Modals, notifications, loading spinners, and error alerts.
- [ ] Build Pages:
  - `Dashboard`: KPI statistics, recent activity, quick-start workflow.
  - `Workspace`: The primary two-panel transcript & extraction workbench.
  - `RecordsList`: Searchable, filterable list of stored records.
  - `RecordDetails`: Detailed inspect/edit view for saved sessions.
  - `Settings`: Integration status, health checks, environment diagnostics.

### Phase F: Build Integration, Verification & Audit
- [ ] Build frontend to `static/dist/`.
- [ ] Verify production single-command startup (`python -m app.main`).
- [ ] Verify frontend-backend integration over single port (`http://localhost:8000`).
- [ ] Audit for console errors, unhandled rejections, and network failures.
- [ ] Generate `docs/FINAL_VERIFICATION_REPORT.md` and complete documentation.

