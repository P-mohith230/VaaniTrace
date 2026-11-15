"""Tests for Rank 3: Closed-Loop Voice Confirmation Protocol (Confirm-Before-Commit)."""

import pytest
from app.services.confirmation_protocol import confirmation_service


def test_generate_business_order_confirmation_script():
    """Verify script generation formats quantities, packaging, rate, and net total for readback."""
    fields = [
        {"field_name": "order_item", "current_value": "Basmati Rice"},
        {
            "field_name": "quantity",
            "current_value": "50",
            "notes": "Colloquial: 50 bori • Standard SI: 50 Bags (2,500 kg)",
        },
        {"field_name": "standardized_packaging", "current_value": "50 Bags (2,500 kg)"},
        {"field_name": "unit_price", "current_value": "₹2,200.00"},
        {"field_name": "total_amount", "current_value": "₹1,10,000.00"},
        {"field_name": "delivery_deadline", "current_value": "Monday"},
    ]

    res = confirmation_service.generate_confirmation_script(
        record_type="business_order",
        fields=fields,
    )

    script = res["script_text"]
    assert "Please confirm your purchase order details" in script
    assert "50 of Basmati Rice" in script
    assert "50 Bags (2,500 kg)" in script
    assert "rupees 2200" in script or "2,200" in script
    assert "rupees 110000" in script or "1,10,000" in script
    assert "Monday" in script
    assert "Say or click 'Confirm' to commit this transaction" in script
    assert not res["requires_clarification"]


def test_uncertain_field_warning_in_confirmation_script():
    """Verify acoustic ambiguity or missing critical fields inject explicit warnings."""
    fields = [
        {"field_name": "order_item", "current_value": "Cement"},
        {"field_name": "quantity", "current_value": "40"},
    ]
    uncertain = [
        {
            "field_name": "delivery_deadline",
            "reason": "Deadline was whispered or ambiguous between Tuesday and Thursday.",
        }
    ]

    res = confirmation_service.generate_confirmation_script(
        record_type="business_order",
        fields=fields,
        uncertain_fields=uncertain,
    )

    assert res["requires_clarification"]
    assert "Notice: Please verify delivery deadline" in res["script_text"]
    assert "Tuesday and Thursday" in res["script_text"]


def test_apply_verbal_quantity_correction():
    """Verify verbal amendment 'make it 60 bori' recomputes SI metric packaging and total amount."""
    fields = [
        {"field_name": "order_item", "current_value": "Cement"},
        {
            "field_name": "quantity",
            "current_value": "40",
            "notes": "Colloquial: 40 bori • Standard SI: 40 Bags (2,000 kg)",
        },
        {"field_name": "standardized_packaging", "current_value": "40 Bags (2,000 kg)"},
        {"field_name": "unit_price", "current_value": "₹380.00"},
        {"field_name": "total_amount", "current_value": "₹15,200.00"},
    ]

    correction = "Actually make it 60 bori cement"
    res = confirmation_service.apply_verbal_correction(
        current_fields=fields,
        correction_text=correction,
        record_type="business_order",
    )

    field_map = {f["field_name"]: f for f in res["updated_fields"]}
    assert field_map["quantity"]["current_value"] == "60"
    assert "60 Bags (3,000 kg)" in field_map["quantity"]["notes"]
    assert field_map["quantity"]["is_edited"] is True
    assert field_map["standardized_packaging"]["current_value"] == "60 Bags (3,000 kg)"

    # Total should be recalculated: 60 * 380 = ₹22,800.00
    assert "22,800" in field_map["total_amount"]["current_value"]
    assert any("Quantity updated: 40 → 60" in c for c in res["changes_applied"])


def test_apply_verbal_price_and_deadline_correction():
    """Verify price and deadline amendments update the record correctly."""
    fields = [
        {"field_name": "order_item", "current_value": "Basmati Rice"},
        {"field_name": "quantity", "current_value": "50"},
        {"field_name": "unit_price", "current_value": "₹2,200.00"},
        {"field_name": "total_amount", "current_value": "₹1,10,000.00"},
        {"field_name": "delivery_deadline", "current_value": "Friday"},
    ]

    correction = "Rate is 2100 rupees and deliver by Monday"
    res = confirmation_service.apply_verbal_correction(
        current_fields=fields,
        correction_text=correction,
        record_type="business_order",
    )

    field_map = {f["field_name"]: f for f in res["updated_fields"]}
    assert "2,100" in field_map["unit_price"]["current_value"]
    assert field_map["delivery_deadline"]["current_value"] == "Monday"
    # Recalculated total: 50 * 2100 = 105,000
    assert "105,000" in field_map["total_amount"]["current_value"]


def test_chage_50_gloves_into_20():
    """Verify natural human typo and phrasing 'chage the 50 gloves into 20' updates quantity to 20."""
    fields = [
        {"field_name": "order_item", "current_value": "Surgical Gloves"},
        {"field_name": "quantity", "current_value": "50", "notes": "Unit: boxes"},
        {"field_name": "unit_price", "current_value": "₹1,200.00"},
        {"field_name": "total_amount", "current_value": "₹60,000.00"},
    ]

    res = confirmation_service.apply_verbal_correction(
        current_fields=fields,
        correction_text="chage the 50 gloves into 20",
        record_type="business_order",
    )

    field_map = {f["field_name"]: f for f in res["updated_fields"]}
    assert field_map["quantity"]["current_value"] == "20"
    # Recalculated total: 20 * 1200 = ₹24,000.00
    assert "24,000" in field_map["total_amount"]["current_value"]
    assert any("Quantity updated: 50 → 20" in c for c in res["changes_applied"])


def test_evaluate_voice_intent():
    """Verify spoken intents are classified into CONFIRM, REJECT, or CORRECT."""
    assert confirmation_service.evaluate_voice_intent("haanji confirm kar do") == "CONFIRM"
    assert confirmation_service.evaluate_voice_intent("Yes, lock it") == "CONFIRM"
    assert confirmation_service.evaluate_voice_intent("nahi cancel kijiye") == "REJECT"
    assert confirmation_service.evaluate_voice_intent("reject this order") == "REJECT"
    assert confirmation_service.evaluate_voice_intent("actually make it 40 boxes") == "CORRECT"


@pytest.mark.asyncio
async def test_confirmation_api_routes(client):
    """Verify HTTP endpoints /api/confirmation/script, /correct, and /intent."""
    fields = [
        {"field_name": "order_item", "current_value": "Wheat"},
        {"field_name": "quantity", "current_value": "30"},
        {"field_name": "unit_price", "current_value": "₹2,000.00"},
        {"field_name": "total_amount", "current_value": "₹60,000.00"},
    ]

    # 1. Script endpoint
    resp_script = await client.post(
        "/api/confirmation/script",
        json={"record_type": "business_order", "fields": fields},
    )
    assert resp_script.status_code == 200
    data_script = resp_script.json()
    assert "Wheat" in data_script["script_text"]
    assert "30" in data_script["script_text"]

    # 2. Correct endpoint
    resp_corr = await client.post(
        "/api/confirmation/correct",
        json={
            "correction_text": "Price is 1900",
            "current_fields": fields,
            "record_type": "business_order",
        },
    )
    assert resp_corr.status_code == 200
    data_corr = resp_corr.json()
    assert len(data_corr["changes_applied"]) > 0

    # 3. Intent endpoint
    resp_intent = await client.post(
        "/api/confirmation/intent",
        json={"spoken_text": "Theek hai, confirm kijiye"},
    )
    assert resp_intent.status_code == 200
    assert resp_intent.json()["intent"] == "CONFIRM"
