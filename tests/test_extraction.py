"""Tests for structured information extraction and domain logic."""

import pytest
from app.services.extractor import information_extractor


def test_business_order_extraction_and_calculation():
    """Verify business order extracts quantity, price, calculates total and links evidence."""
    transcript = "Hi Rajesh, I need 20 boxes of surgical gloves at 1200 rupees each. Please deliver them by Friday."
    result = information_extractor.extract(transcript, record_type="business_order")

    assert result.record_type == "business_order"
    assert "20" in result.summary or "surgical gloves" in result.summary

    # Check extracted fields
    field_dict = {f.field_name: f for f in result.fields}
    assert "quantity" in field_dict
    assert field_dict["quantity"].current_value == "20"
    assert field_dict["quantity"].evidence_type == "spoken"

    assert "unit_price" in field_dict
    assert "1,200" in field_dict["unit_price"].current_value or "1200" in field_dict["unit_price"].current_value

    # Verify calculated total
    assert "total_amount" in field_dict
    assert field_dict["total_amount"].evidence_type == "calculated"
    assert "24,000" in field_dict["total_amount"].current_value
    assert "Calculated" in field_dict["total_amount"].notes

    # Verify deadline
    assert "delivery_deadline" in field_dict
    assert "friday" in field_dict["delivery_deadline"].current_value.lower()


def test_meeting_action_items_extraction():
    """Verify meeting action items capture tasks and assignees."""
    transcript = "In today's sync, Priya will prepare the slide deck by Friday. Rahul to review the client contract."
    result = information_extractor.extract(transcript, record_type="meeting_action_items")

    assert result.record_type == "meeting_action_items"
    assert len(result.action_items) >= 1
    # Check that Priya or Rahul is in participants or assignees
    assert "Priya" in result.participants or any(a.assignee == "Priya" for a in result.action_items)


def test_field_report_extraction():
    """Verify field report extracts site location and observation status."""
    transcript = "Site inspection at Warehouse 4 completed. We identified a critical water leakage in the northern corridor."
    result = information_extractor.extract(transcript, record_type="field_report")

    assert result.record_type == "field_report"
    field_dict = {f.field_name: f for f in result.fields}
    assert "site_location" in field_dict or "equipment_status" in field_dict


def test_customer_complaint_extraction():
    """Verify customer complaint extracts grievance and urgency."""
    transcript = "This is urgent! My broadband service has been disconnected since yesterday and no one is responding."
    result = information_extractor.extract(transcript, record_type="customer_complaint")

    assert result.record_type == "customer_complaint"
    field_dict = {f.field_name: f for f in result.fields}
    assert "reported_issue" in field_dict
    assert "severity" in field_dict
    assert field_dict["severity"].current_value == "high"


@pytest.mark.asyncio
async def test_extract_api_endpoint(client):
    """Test POST /api/extract HTTP route."""
    payload = {
        "transcript": "Please send 10 packets of seeds by tomorrow.",
        "record_type": "business_order",
    }
    response = await client.post("/api/extract", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["record_type"] == "business_order"
    assert len(data["fields"]) > 0

