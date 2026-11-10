"""Tests for Gnani Prisma speech-to-text integration."""

import pytest
import respx
import httpx
from app.config import settings

SAMPLE_WAV_BYTES = (
    b"RIFF" + (36).to_bytes(4, "little") + b"WAVEfmt " + (16).to_bytes(4, "little")
    + b"\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data" + (0).to_bytes(4, "little")
)


@pytest.mark.asyncio
@respx.mock
async def test_transcribe_success_mocked(client, monkeypatch):
    """Test successful audio transcription through mocked Gnani Prisma v2.5."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "test-gnani-key-12345")

    stt_endpoint = f"{settings.GNANI_BASE_URL.rstrip('/')}/stt/v3"
    respx.post(stt_endpoint).mock(
        return_value=httpx.Response(
            200,
            json={
                "success": True,
                "request_id": "gnani-mock-req-999",
                "transcript": "Hello Rajesh, please deliver 20 boxes of surgical gloves by Friday.",
                "model": "prisma-v2.5",
                "detected_language_code": "en-IN",
                "processing_time": 0.54,
            },
        )
    )

    files = {"file": ("sample.wav", SAMPLE_WAV_BYTES, "audio/wav")}
    data = {"language": "en-IN"}

    response = await client.post("/api/transcribe", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["transcript"] == "Hello Rajesh, please deliver 20 boxes of surgical gloves by Friday."
    assert res_data["detected_language"] == "en-IN"
    assert res_data["model"] == "prisma-v2.5"
    assert len(res_data["segments"]) >= 1


@pytest.mark.asyncio
@respx.mock
async def test_transcribe_auth_failure_handling(client, monkeypatch):
    """Test that Gnani 401 Unauthorized is safely mapped to a clean HTTP error."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "invalid-key")

    stt_endpoint = f"{settings.GNANI_BASE_URL.rstrip('/')}/stt/v3"
    respx.post(stt_endpoint).mock(
        return_value=httpx.Response(401, json={"error": "Invalid API Key"})
    )

    files = {"file": ("sample.wav", SAMPLE_WAV_BYTES, "audio/wav")}
    response = await client.post("/api/transcribe", files=files)
    assert response.status_code == 401
    assert "authentication failed" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_transcribe_missing_key_handling(client, monkeypatch):
    """Test that missing API key returns a 503 with clear instructions."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "")

    files = {"file": ("sample.wav", SAMPLE_WAV_BYTES, "audio/wav")}
    response = await client.post("/api/transcribe", files=files)
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower()
