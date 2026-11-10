# VaaniTrace — API Integration Guide

---

## 1. Overview

This document specifies the exact request and response contracts for the external Gnani AI APIs (Prisma STT and Timbre TTS) as well as the internal VaaniTrace application APIs.

---

## 2. External Gnani AI APIs

### 2.1 Gnani Prisma (Speech-to-Text)

- **Base URL:** `https://api.vachana.ai`
- **Endpoint:** `POST /stt/v3` (or `/stt/v2.5`)
- **Headers:**
  ```http
  X-API-Key-ID: <GNANI_API_KEY>
  ```
- **Content Type:** `multipart/form-data`
- **Parameters:**
  - `audio_file`: Binary file upload.
  - `model`: `"prisma-v2.5"` (default) or `"prisma-v3.0"`.
  - `language_code`: `"indic-auto"` (for auto-detection) or BCP-47 locale (`"en-IN"`, `"hi-IN"`, `"ta-IN"`, `"te-IN"`, `"kn-IN"`, etc.).
  - `output_format`: `"transcribe"` (standard normalized), `"verbatim"`, or `"code-mix"`.
- **Response Format:**
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
- **Error Behavior:**
  - Status 401: Unauthorized API key.
  - Status 400: Malformed audio or unsupported container.
  - Status 429: Rate limit quota exceeded.
  - Status 500: Provider server error.

---

### 2.2 Gnani Timbre (Text-to-Speech)

- **Base URL:** `https://api.vachana.ai`
- **Endpoint:** `POST /api/v1/tts/inference`
- **Headers:**
  ```http
  X-API-Key-ID: <GNANI_API_KEY>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "text": "Your order for 20 units has been confirmed.",
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
- **Response Format:**
  - Status: 200 OK
  - Content-Type: `audio/wav`
  - Body: Raw binary bytes of the rendered WAV audio file.

---

## 3. VaaniTrace Internal REST API

### 3.1 Health & Diagnostics

#### `GET /api/health`
Checks application, runtime, and database status.
```json
{
  "status": "healthy",
  "backend": "online",
  "database": "connected",
  "version": "1.0.0"
}
```

#### `GET /api/health/gnani`
Checks whether Gnani credentials are configured and validates connectivity.
```json
{
  "configured": true,
  "connectivity": "verified",
  "model_stt": "prisma-v2.5",
  "model_tts": "timbre-v2.5",
  "message": "Gnani AI credentials configured and ready"
}
```

---

### 3.2 Transcription

#### `POST /api/transcribe`
Accepts multipart audio upload and runs transcription through Gnani Prisma.
- **Form Data:**
  - `file`: Audio file binary (WAV, MP3, OGG, WebM, FLAC, M4A).
  - `language`: (Optional) Language code, defaults to `"indic-auto"`.
  - `model`: (Optional) `"prisma-v2.5"`.
- **Response:**
  ```json
  {
    "request_id": "req-987654",
    "transcript": "Hello Ramesh, this is Priya. I need 50 units of Model X...",
    "detected_language": "en-IN",
    "model": "prisma-v2.5",
    "processing_time": 0.85,
    "segments": [
      {
        "id": 0,
        "text": "Hello Ramesh, this is Priya.",
        "start_char": 0,
        "end_char": 28
      },
      {
        "id": 1,
        "text": "I need 50 units of Model X delivered by Friday.",
        "start_char": 29,
        "end_char": 76
      }
    ]
  }
  ```

---

### 3.3 Structured Extraction

#### `POST /api/extract`
Extracts structured fields and links evidence.
- **Request Body:**
  ```json
  {
    "transcript": "I need 50 units of Model X at 200 rupees each by Friday.",
    "record_type": "business_order",
    "segments": []
  }
  ```
- **Response:**
  ```json
  {
    "record_type": "business_order",
    "summary": "Order for 50 units of Model X at ₹200 each, due Friday.",
    "fields": [
      {
        "id": "fld-1",
        "field_name": "item",
        "value": "Model X",
        "evidence_type": "spoken",
        "verification_status": "unverified",
        "supporting_text": "Model X",
        "segment_index": 0,
        "start_char": 19,
        "end_char": 26
      },
      {
        "id": "fld-2",
        "field_name": "quantity",
        "value": "50",
        "evidence_type": "spoken",
        "verification_status": "unverified",
        "supporting_text": "50 units",
        "segment_index": 0,
        "start_char": 7,
        "end_char": 15
      },
      {
        "id": "fld-3",
        "field_name": "calculated_total",
        "value": "10000",
        "evidence_type": "calculated",
        "verification_status": "unverified",
        "supporting_text": "50 units at 200 rupees each",
        "notes": "Calculated: 50 * 200 = ₹10,000"
      }
    ],
    "action_items": [
      {
        "id": "act-1",
        "description": "Deliver 50 units of Model X",
        "deadline": "Friday",
        "status": "pending"
      }
    ],
    "uncertain_fields": []
  }
  ```

---

### 3.4 Speech Synthesis

#### `POST /api/speech`
Synthesizes a spoken summary with Gnani Timbre.
- **Request Body:**
  ```json
  {
    "text": "Summary: Order for 50 units of Model X received.",
    "voice": "Nalini",
    "language": "en-IN",
    "speed": 1.0
  }
  ```
- **Response:**
  - Direct binary audio stream with `Content-Type: audio/wav`, OR
  - JSON payload with base64 data URI when requested via query parameter `?format=json`.

---

### 3.5 Record Persistence

- `GET /api/records`: Lists saved records with pagination and filters.
- `POST /api/records`: Stores a verified/unverified record.
- `GET /api/records/{id}`: Returns complete record with fields and evidence.
- `PUT /api/records/{id}`: Updates field values, verification status, and manual edits.
- `DELETE /api/records/{id}`: Permanently deletes a record.
- `GET /api/records/{id}/export?format=json|csv`: Downloads structured export file.
