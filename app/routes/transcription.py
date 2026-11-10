"""Transcription API routes using Gnani Prisma."""

from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.schemas import TranscriptionResponse
from app.utils.audio_validation import validate_audio_file
from app.utils.file_storage import temporary_audio_file
from app.services.gnani_prisma import prisma_service
from app.services.evidence_mapper import evidence_mapper

router = APIRouter(prefix="/api/transcribe", tags=["Transcription"])


@router.post("", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file in WAV, MP3, OGG, WebM, FLAC, or M4A"),
    language: Optional[str] = Form("indic-auto", description="Spoken language code or indic-auto"),
    model: Optional[str] = Form(None, description="STT model override: prisma-v2.5 or prisma-v3.0"),
):
    """Transcribe uploaded audio file through Gnani Prisma Speech-to-Text API."""
    # 1. Validate audio format, MIME type and size boundaries
    audio_content = await validate_audio_file(file)

    # 2. Extract file extension
    filename = file.filename or "recording.wav"
    ext = "." + filename.split(".")[-1] if "." in filename else ".wav"

    # 3. Process via temporary spool with automatic cleanup
    with temporary_audio_file(audio_content, extension=ext) as temp_file:
        res = await prisma_service.transcribe(
            audio_bytes=audio_content,
            filename=filename,
            content_type=file.content_type or "audio/wav",
            language_code=language or "indic-auto",
            model=model,
        )

    transcript = res.get("transcript", "").strip()
    if not transcript:
        # Per Gnani docs, very quiet audio returns empty transcript
        return TranscriptionResponse(
            request_id=res.get("request_id", "req-empty"),
            transcript="",
            detected_language=res.get("detected_language", language or "indic-auto"),
            model=res.get("model", "prisma-v2.5"),
            processing_time=res.get("processing_time"),
            segments=[],
        )

    # 4. Generate structured sentence and clause segments for evidence linkage
    segments = evidence_mapper.segment_transcript(transcript)

    return TranscriptionResponse(
        request_id=res.get("request_id", "req-transcribe"),
        transcript=transcript,
        detected_language=res.get("detected_language", language or "indic-auto"),
        model=res.get("model", "prisma-v2.5"),
        processing_time=res.get("processing_time"),
        segments=segments,
    )
