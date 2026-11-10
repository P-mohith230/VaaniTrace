"""Tests for health check endpoints."""

import pytest


@pytest.mark.asyncio
async def test_system_health(client):
    """Test /api/health returns healthy status."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert data["backend"] == "online"
    assert data["database"] == "connected"
    assert "version" in data


@pytest.mark.asyncio
async def test_gnani_health(client):
    """Test /api/health/gnani reports configuration correctly without crashing."""
    response = await client.get("/api/health/gnani")
    assert response.status_code == 200
    data = response.json()
    assert "configured" in data
    assert "connectivity" in data
    assert "model_stt" in data
    assert "model_tts" in data
