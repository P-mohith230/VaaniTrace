"""Gnani Prisma Speech-to-Text (STT) service adapter."""

import logging
from typing import Dict, Any, Optional
import httpx
from fastapi import HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)


class GnaniPrismaService:
    """Service client for official Gnani Prisma speech recognition."""

    def __init__(self):
        self.default_model = settings.GNANI_STT_MODEL or "prisma-v2.5"
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
                detail="Gnani AI API key is not configured. Please set GNANI_API_KEY in your environment or .env file.",
            )
        key = self.api_key.strip()
        return {
            "X-API-Key-ID": key,
            "X-API-Key": key,
            "token": key,
        }

    def _extract_transcript(self, result: Any, requested_lang: str = "indic-auto") -> str:
        """Resiliently extract transcript text from any Gnani response envelope."""
        if not isinstance(result, dict):
            return str(result or "").strip()
        
        # 1. Direct standard keys
        for key in ("transcript", "transcription", "text", "asr_output", "speech_text"):
            val = result.get(key)
            if isinstance(val, str) and val.strip():
                return val.strip()

        # 2. Gnani Vachana / Prisma 'translations' dictionary
        # (Maps locale -> transcript string, e.g. {'en-IN': '...', 'hi-IN': '...'})
        translations = result.get("translations")
        if isinstance(translations, dict) and translations:
            # If user explicitly requested a language and it exists in translations
            if requested_lang and requested_lang in translations:
                val = translations[requested_lang]
                if isinstance(val, str) and val.strip():
                    return val.strip()

            # Prefer en-IN when available (common for mixed/English audio)
            if "en-IN" in translations and isinstance(translations["en-IN"], str) and translations["en-IN"].strip():
                return translations["en-IN"].strip()

            # If detected language matches
            detected = result.get("detected_language_code")
            if detected and detected in translations and isinstance(translations[detected], str) and translations[detected].strip():
                return translations[detected].strip()

            # Return first valid string in translations
            for val in translations.values():
                if isinstance(val, str) and val.strip():
                    return val.strip()

        # 3. Gnani 'output' dictionary (e.g. output.literal['en-IN'])
        output = result.get("output")
        if isinstance(output, dict):
            for sub_key in ("literal", "normalized", "verbatim", "transcript"):
                sub = output.get(sub_key)
                if isinstance(sub, dict):
                    if "en-IN" in sub and isinstance(sub["en-IN"], str) and sub["en-IN"].strip():
                        return sub["en-IN"].strip()
                    for val in sub.values():
                        if isinstance(val, str) and val.strip():
                            return val.strip()
                elif isinstance(sub, str) and sub.strip():
                    return sub.strip()

        # 4. Check nested containers
        for container_key in ("data", "result", "payload", "response"):
            nested = result.get(container_key)
            if isinstance(nested, dict):
                sub = self._extract_transcript(nested, requested_lang)
                if sub:
                    return sub
            elif isinstance(nested, list) and len(nested) > 0:
                if isinstance(nested[0], dict):
                    sub = self._extract_transcript(nested[0], requested_lang)
                    if sub:
                        return sub
                elif isinstance(nested[0], str):
                    return " ".join(nested).strip()

        return ""

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        content_type: str = "audio/wav",
        language_code: str = "indic-auto",
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send audio to Gnani Prisma REST transcription API."""
        headers = self._get_headers()
        chosen_model = model or self.default_model

        # Flexible endpoint resolution: support both base URL and direct endpoint URL
        url = self.base_url
        if url.endswith("/stt/v3") or "/stt/" in url:
            endpoint = url
        else:
            endpoint = f"{url}/stt/v3"

        files = {
            "audio_file": (filename, audio_bytes, content_type),
        }
        data = {
            "model": chosen_model,
            "language_code": language_code,
        }

        # Gnani API requirement: indic-auto requires multi_lang_codes
        if language_code in ("indic-auto", "auto", "indic") or not language_code:
            data["language_code"] = "indic-auto"
            data["multi_lang_codes"] = "en-IN,hi-IN,ta-IN,te-IN,kn-IN,mr-IN,bn-IN,gu-IN"

        logger.info(f"Submitting transcription request to {endpoint} (model={chosen_model}, lang={data['language_code']})")

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, headers=headers, files=files, data=data)

            if response.status_code == 200:
                result = response.json()
                logger.info(f"Gnani Prisma transcription success (request_id={result.get('request_id')}, payload={result})")
                
                # Robust extraction across different Gnani envelope formats
                transcript_text = self._extract_transcript(result, language_code)

                return {
                    "request_id": str(result.get("request_id") or result.get("id") or "req-direct"),
                    "transcript": transcript_text,
                    "detected_language": result.get("detected_language_code") or result.get("language") or language_code,
                    "model": result.get("model") or chosen_model,
                    "processing_time": result.get("processing_time") or result.get("duration"),
                }

            # Handle known status codes
            if response.status_code == 401:
                logger.error("Gnani Prisma authentication failed (HTTP 401)")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Gnani AI authentication failed: Invalid or expired API Key.",
                )
            elif response.status_code == 429:
                logger.error("Gnani Prisma rate limit reached (HTTP 429)")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Gnani AI rate limit exceeded. Please wait a moment before trying again.",
                )
            elif response.status_code == 400:
                logger.error(f"Gnani Prisma rejected request (HTTP 400): {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Gnani AI rejected audio upload: {response.text[:200]}",
                )
            else:
                logger.error(f"Gnani Prisma upstream error {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Gnani AI provider error (status {response.status_code}): {response.text[:200]}",
                )

        except httpx.TimeoutException:
            logger.error(f"Gnani Prisma transcription request timed out after {self.timeout}s")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Gnani AI speech recognition request timed out after {self.timeout:.0f} seconds.",
            )
        except httpx.RequestError as exc:
            logger.error(f"Gnani Prisma connection error: {str(exc)}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Unable to connect to Gnani AI service: {str(exc)}",
            )

    async def verify_credentials(self) -> Dict[str, Any]:
        """Verify configuration and check connectivity against Gnani platform."""
        if not self.api_key or not self.api_key.strip():
            return {
                "configured": False,
                "connectivity": "not_configured",
                "message": "GNANI_API_KEY is not set in environment or .env file",
            }

        # Attempt connectivity check with a minimal synthetic check
        endpoint = f"{self.base_url}/stt/v3"
        try:
            # We can issue an OPTIONS or a probe with dummy payload
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(f"{self.base_url}", headers={"X-API-Key-ID": self.api_key.strip()})
                # If provider returns 200, 404, or 405 (method not allowed) rather than 401, host is reachable
                if res.status_code == 401:
                    return {
                        "configured": True,
                        "connectivity": "auth_failed",
                        "message": "GNANI_API_KEY was rejected by Gnani AI authentication (401 Unauthorized)",
                    }
                return {
                    "configured": True,
                    "connectivity": "verified",
                    "message": "Gnani AI endpoint reachable and credentials provided",
                }
        except Exception as exc:
            return {
                "configured": True,
                "connectivity": "unavailable",
                "message": f"Could not reach Gnani AI gateway: {str(exc)}",
            }


prisma_service = GnaniPrismaService()
