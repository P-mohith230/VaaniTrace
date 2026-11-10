"""Gnani Timbre Text-to-Speech (TTS) service adapter."""

import base64
import logging
from typing import Dict, Any, Optional
import httpx
from fastapi import HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)


class GnaniTimbreService:
    """Service client for official Gnani Timbre speech synthesis."""

    def __init__(self):
        self.default_model = settings.GNANI_TTS_MODEL or "timbre-v2.5"
        self.timeout = settings.GNANI_TIMEOUT_SECONDS

    @property
    def base_url(self) -> str:
        """Dynamically fetch current base URL from settings."""
        return (settings.GNANI_BASE_URL or "https://api.vachana.ai").rstrip("/")

    @property
    def api_key(self) -> str:
        """Dynamically fetch current API key from settings."""
        return settings.GNANI_API_KEY

    def _get_headers(self) -> Dict[str, str]:
        """Return authentication headers without exposing key in logs."""
        if not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gnani AI API key is not configured for speech synthesis.",
            )
        key = self.api_key.strip()
        return {
            "X-API-Key-ID": key,
            "X-API-Key": key,
            "token": key,
            "Content-Type": "application/json",
        }

    async def synthesize(
        self,
        text: str,
        voice: str = "Nalini",
        language: str = "en-IN",
        speed: float = 1.0,
        model: Optional[str] = None,
    ) -> bytes:
        """Synthesize spoken audio from text and return raw WAV bytes."""
        headers = self._get_headers()
        chosen_model = model or self.default_model

        # Flexible endpoint resolution: support both base URL and direct endpoint URL
        url = self.base_url
        if "/tts" in url:
            endpoint = url
        else:
            endpoint = f"{url}/api/v1/tts/inference"

        payload = {
            "text": text,
            "voice": voice,
            "model": chosen_model,
            "language": language,
            "speed": max(0.5, min(2.0, speed)),
            "audio_config": {
                "encoding": "linear_pcm",
                "container": "wav",
                "num_channels": 1,
                "sample_rate": 24000,
                "sample_width": 2,
            },
        }

        logger.info(f"Synthesizing speech via {endpoint} (voice={voice}, lang={language}, model={chosen_model})")

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, headers=headers, json=payload)

            if response.status_code == 200:
                audio_bytes = response.content
                logger.info(f"Gnani Timbre synthesis success ({len(audio_bytes)} bytes)")
                return audio_bytes

            # Handle errors
            if response.status_code == 401:
                logger.error("Gnani Timbre authentication failed (HTTP 401)")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Gnani AI authentication failed: Invalid or expired API Key.",
                )
            elif response.status_code == 429:
                logger.error("Gnani Timbre rate limit reached (HTTP 429)")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Gnani AI speech synthesis rate limit reached.",
                )
            else:
                logger.error(f"Gnani Timbre upstream error {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Gnani Timbre speech synthesis error: {response.text[:200]}",
                )

        except httpx.TimeoutException:
            logger.error(f"Gnani Timbre synthesis timed out after {self.timeout}s")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Gnani Timbre synthesis timed out after {self.timeout:.0f} seconds.",
            )
        except httpx.RequestError as exc:
            logger.error(f"Gnani Timbre connection error: {str(exc)}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Unable to connect to Gnani Timbre service: {str(exc)}",
            )

    async def synthesize_base64(
        self,
        text: str,
        voice: str = "Nalini",
        language: str = "en-IN",
        speed: float = 1.0,
    ) -> Dict[str, Any]:
        """Synthesize and return base64 encoded data URI."""
        audio_bytes = await self.synthesize(text, voice, language, speed)
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
        return {
            "audio_base64": f"data:audio/wav;base64,{b64_audio}",
            "content_type": "audio/wav",
            "model": self.default_model,
            "character_count": len(text),
        }


timbre_service = GnaniTimbreService()
