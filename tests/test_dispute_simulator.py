"""Unit tests for Voice Dispute Simulator & Forensic Audit Replay (Candidate A Innovation)."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.dispute_simulator import dispute_service


@pytest.fixture
def client():
    return TestClient(app)


@pytest.mark.asyncio
async def test_simulate_quantity_dispute():
    """Verify forensic analysis when a customer disputes quantity (e.g., claimed 15, recorded 25)."""
    transcript = (
        "hello rajesh this is suresh speaking i need twenty five boxes of surgical gloves "
        "delivered by friday at rate of twelve hundred per box please confirm the order thanks"
    )
    fields = [
        {"field_name": "order_item", "current_value": "surgical gloves"},
        {
            "field_name": "quantity",
            "current_value": "25",
            "evidence": {"start_char": 44, "end_char": 61, "supporting_text": "twenty five boxes"},
        },
        {"field_name": "unit_price", "current_value": "₹1,200.00"},
        {"field_name": "total_amount", "current_value": "₹30,000.00"},
        {"field_name": "delivery_deadline", "current_value": "friday"},
    ]

    res = await dispute_service.simulate_dispute(
        transcript=transcript,
        fields=fields,
        disputed_field="quantity",
        claimed_value="15",
    )

    assert res["audit_id"].startswith("AUD-DISPUTE-")
    assert res["spoken_value"] == "25"
    assert res["claimed_value"] == "15"
    assert "twenty five" in res["verbatim_spoken_phrase"]
    assert res["verdict"] == "VERIFIED_VOICE_AUTHENTIC"
    assert res["acoustic_confidence"] > 0.95
    assert len(res["sha256_hash"]) == 64
    assert res["financial_discrepancy"] is not None
    assert "₹12,000.00" in res["financial_discrepancy"]


@pytest.mark.asyncio
async def test_simulate_price_dispute():
    """Verify forensic analysis when rate is disputed (claimed ₹1,000, recorded ₹1,200)."""
    transcript = "We agreed on 10 bags at twelve hundred rupees each."
    fields = [
        {"field_name": "quantity", "current_value": "10"},
        {
            "field_name": "unit_price",
            "current_value": "₹1,200.00",
            "evidence": {"start_char": 24, "end_char": 45, "supporting_text": "twelve hundred rupees"},
        },
    ]

    res = await dispute_service.simulate_dispute(
        transcript=transcript,
        fields=fields,
        disputed_field="unit_price",
        claimed_value="₹1,000.00",
    )

    assert res["verdict"] == "VERIFIED_VOICE_AUTHENTIC"
    assert res["spoken_value"] == "₹1,200.00"
    assert "twelve hundred" in res["verbatim_spoken_phrase"]


def test_api_dispute_endpoint(client):
    """Test FastAPI HTTP endpoint for dispute simulation."""
    payload = {
        "transcript": "Please send 50 bags of cement by Monday.",
        "fields": [
            {"field_name": "quantity", "current_value": "50", "evidence": {"start_char": 12, "end_char": 19, "supporting_text": "50 bags"}},
            {"field_name": "delivery_deadline", "current_value": "Monday"},
        ],
        "disputed_field": "quantity",
        "claimed_value": "15",
    }
    resp = client.post("/api/dispute/simulate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["audit_id"].startswith("AUD-DISPUTE-")
    assert data["verdict"] == "VERIFIED_VOICE_AUTHENTIC"
