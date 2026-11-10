"""Text-to-speech synthesis API routes using Gnani Timbre."""

from typing import Optional
from fastapi import APIRouter, Response, Query, HTTPException, status
from app.schemas import SpeechRequest, SpeechResponse
from app.services.gnani_timbre import timbre_service

router = APIRouter(prefix="/api/speech", tags=["Speech"])


@router.post("")
async def synthesize_speech(
    request: SpeechRequest,
    output_format: Optional[str] = Query(default="json", description="Output format: 'json' (base64) or 'audio' (wav binary)"),
):
    """Generate spoken audio summary using Gnani Timbre TTS engine."""
    text = request.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text parameter is required for speech synthesis.",
        )

    if output_format == "audio":
        audio_bytes = await timbre_service.synthesize(
            text=text,
            voice=request.voice or "Nalini",
            language=request.language or "en-IN",
            speed=request.speed or 1.0,
        )
        return Response(content=audio_bytes, media_type="audio/wav")

    # Return structured base64 response for convenient frontend consumption
    result = await timbre_service.synthesize_base64(
        text=text,
        voice=request.voice or "Nalini",
        language=request.language or "en-IN",
        speed=request.speed or 1.0,
    )
    return SpeechResponse(**result)
