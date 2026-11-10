"""Tests for Gnani Timbre text-to-speech integration."""

import pytest
import respx
import httpx
from app.config import settings

MOCK_SYNTH_WAV = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00"


@pytest.mark.asyncio
@respx.mock
async def test_speech_synthesize_success_base64(client, monkeypatch):
    """Test speech synthesis returning base64 audio data URI."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "test-key-timbre")

    tts_endpoint = f"{settings.GNANI_BASE_URL.rstrip('/')}/api/v1/tts/inference"
    respx.post(tts_endpoint).mock(
        return_value=httpx.Response(200, content=MOCK_SYNTH_WAV, headers={"content-type": "audio/wav"})
    )

    payload = {
        "text": "Your order for 20 boxes has been recorded.",
        "voice": "Nalini",
        "language": "en-IN",
    }
    response = await client.post("/api/speech?output_format=json", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "audio_base64" in data
    assert data["audio_base64"].startswith("data:audio/wav;base64,")


@pytest.mark.asyncio
@respx.mock
async def test_speech_synthesize_raw_audio(client, monkeypatch):
    """Test speech synthesis returning binary audio/wav."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "test-key-timbre")

    tts_endpoint = f"{settings.GNANI_BASE_URL.rstrip('/')}/api/v1/tts/inference"
    respx.post(tts_endpoint).mock(
        return_value=httpx.Response(200, content=MOCK_SYNTH_WAV, headers={"content-type": "audio/wav"})
    )

    payload = {"text": "Hello world"}
    response = await client.post("/api/speech?output_format=audio", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert response.content == MOCK_SYNTH_WAV


@pytest.mark.asyncio
async def test_speech_missing_key_graceful(client, monkeypatch):
    """Test speech synthesis returns 503 when API key is unconfigured."""
    monkeypatch.setattr(settings, "GNANI_API_KEY", "")

    payload = {"text": "Hello world"}
    response = await client.post("/api/speech", json=payload)
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower()

