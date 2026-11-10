# VaaniTrace — Project Overview

> **Tagline:** Don't just capture what people say. Understand what needs to happen next.

---

## 1. Executive Summary

**VaaniTrace** is an enterprise-grade multilingual voice-to-action intelligence platform powered by **Gnani AI** speech technologies. It transforms spoken audio conversations into structured, editable, and auditable business records where **every extracted field is linked directly to its source transcript evidence**.

In conversational workflows such as wholesale distributor order calls, site inspection debriefs, meeting action capture, and customer grievance logging, transcription alone leaves teams searching through raw text. VaaniTrace closes the gap between listening and executing by parsing unstructured spoken dialogue into structured records with unambiguous accountability.

---

## 2. Core Capabilities

1. **Multilingual Speech Recognition:**
   - Powered by **Gnani Prisma** (v2.5/v3.0).
   - High fidelity recognition for Indian accents, regional languages, and code-mixed vernacular (Hinglish, Kanglish, etc.).
   - Browser audio recording and file uploads (WAV, MP3, OGG, WebM, FLAC, M4A).

2. **Domain-Specific Structured Extraction:**
   - Pre-configured intelligent extractors for:
     - **Business Orders:** Items, quantities, unit prices, delivery deadlines, recipient entities, total amounts (calculated).
     - **Meeting Action Items:** Tasks, assignees, deadlines, decisions, open questions.
     - **Field Reports:** Observations, incidents, locations, equipment status, required follow-ups.
     - **Customer Complaints:** Issues, affected services/products, urgency, customer expectations, resolution commitments.
     - **General Conversations:** Summary, key topics, participants, commitments, notable points.

3. **Verifiable Evidence Mapping (Core Differentiator):**
   - Direct connection between each extracted attribute and the exact sentence or phrase in the transcript.
   - Classification of evidence types: `spoken`, `inferred`, `calculated`, and `manual`.
   - Bidirectional interactive UI: Clicking a field highlights its transcript evidence; clicking transcript text illuminates associated extracted data.
   - Transparent calculation tracking (e.g. `Total = 20 * 1200 = 24000`).

4. **Human-in-the-Loop Verification & Editing:**
   - Review, edit, approve, or flag extracted records before saving.
   - Preservation of original machine extractions when human edits occur.
   - Status tracking (`verified`, `unverified`, `needs_review`).

5. **Spoken Summary Synthesis (Gnani Timbre):**
   - Natural voice readout of extracted summaries powered by **Gnani Timbre** (v2.5/v3.0).
   - Multi-voice, multilingual synthesis with instant audio playback.

6. **Persistent Storage & Portable Export:**
   - Local SQLite database with persistent record storage.
   - Instant export to clean **JSON** and tabular **CSV**.

7. **Unified Single-Deployment Architecture:**
   - One integrated repository.
   - One FastAPI application server serving both REST API endpoints and the built single-page web UI.
   - Zero CORS complications in production and single-command startup.
