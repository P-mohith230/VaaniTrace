# VaaniTrace — Known Limitations & Operational Boundaries

---

## 1. Gnani AI API Constraints

1. **REST STT Granularity:**
   - The synchronous REST endpoint for Gnani Prisma STT (`POST /stt/v3` or `/stt/v2.5`) returns normalized plain text transcripts (`transcript: "..."`) rather than word-level millisecond alignment timestamps.
   - *Mitigation:* VaaniTrace employs an advanced sentence/clause segmentation and substring offset matching engine in `app.services.evidence_mapper` to provide character-accurate evidence linkage.
2. **Audio File Duration:**
   - Synchronous REST endpoints are optimized for audio clips under 60 seconds (telephony calls, voice notes). Longer audio files should ideally be chunked or processed asynchronously.
3. **Language Code Specification:**
   - While `indic-auto` provides automatic language identification on clips >3 seconds, specifying explicit language codes (e.g. `hi-IN`, `en-IN`, `ta-IN`) yields the lowest latency and highest domain accuracy for technical terminology.

---

## 2. Browser Audio Capture Constraints

1. **MediaRecorder Audio Formats:**
   - Chromium browsers default to `audio/webm;codecs=opus`.
   - Safari defaults to `audio/mp4` or `audio/aac`.
   - *Mitigation:* The VaaniTrace backend validates and accepts WAV, MP3, OGG, WebM, AAC, and FLAC containers.
2. **Microphone Permissions:**
   - In production, microphone access requires an HTTPS origin or `localhost`. Plain HTTP over non-localhost IP addresses will block getUserMedia permissions.

---

## 3. Storage & Concurrency Boundaries

1. **SQLite Concurrency:**
   - SQLite with WAL mode handles hundreds of concurrent reads and serialized writes cleanly on a single node. For distributed multi-server horizontal autoscaling, PostgreSQL is recommended.
2. **Temporary Storage:**
   - Uploaded audio files are spooled to `data/uploads/` and deleted immediately following transcription. Raw audio is not retained indefinitely to respect privacy and storage boundaries.

