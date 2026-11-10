"""Tests for SQLite record persistence, updates, and export."""

import pytest


@pytest.mark.asyncio
async def test_record_crud_lifecycle(client):
    """Test full CRUD lifecycle for voice records in SQLite."""
    # 1. CREATE RECORD
    create_payload = {
        "title": "Medical Supply Wholesale Order",
        "record_type": "business_order",
        "original_transcript": "Hi Ramesh, I need 20 boxes of surgical gloves at 1200 rupees each. Deliver by Friday.",
        "cleaned_summary": "Order for 20 boxes of surgical gloves at ₹1,200 each, required by Friday.",
        "language_code": "en-IN",
        "verification_status": "unverified",
        "fields": [
            {
                "field_name": "quantity",
                "original_value": "20",
                "current_value": "20",
                "evidence_type": "spoken",
                "verification_status": "unverified",
                "notes": "Unit: boxes",
                "evidence": {
                    "supporting_text": "20 boxes",
                    "segment_index": 0,
                    "start_char": 17,
                    "end_char": 25,
                },
            },
            {
                "field_name": "total_amount",
                "original_value": "₹24,000.00",
                "current_value": "₹24,000.00",
                "evidence_type": "calculated",
                "verification_status": "unverified",
                "notes": "Calculated: 20 × ₹1,200 = ₹24,000",
            },
        ],
        "action_items": [
            {
                "description": "Deliver 20 boxes of surgical gloves",
                "deadline": "Friday",
                "status": "pending",
            }
        ],
    }

    create_res = await client.post("/api/records", json=create_payload)
    assert create_res.status_code == 201
    record = create_res.json()
    record_id = record["id"]
    assert record["title"] == "Medical Supply Wholesale Order"
    assert len(record["fields"]) == 2
    assert record["fields"][0]["evidence"]["supporting_text"] == "20 boxes"

    # 2. LIST RECORDS
    list_res = await client.get("/api/records?record_type=business_order")
    assert list_res.status_code == 200
    records_list = list_res.json()
    assert len(records_list) >= 1
    assert any(r["id"] == record_id for r in records_list)

    # 3. GET RECORD BY ID
    get_res = await client.get(f"/api/records/{record_id}")
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["id"] == record_id

    # 4. UPDATE RECORD & EDIT FIELD VALUE
    update_payload = {
        "verification_status": "verified",
        "fields": [
            {
                "field_name": "quantity",
                "original_value": "20",
                "current_value": "25",  # User manually corrected 20 -> 25
                "evidence_type": "spoken",
                "verification_status": "verified",
                "evidence": {
                    "supporting_text": "20 boxes",
                    "segment_index": 0,
                    "start_char": 17,
                    "end_char": 25,
                },
            }
        ],
    }
    update_res = await client.put(f"/api/records/{record_id}", json=update_payload)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["verification_status"] == "verified"
    assert updated["fields"][0]["current_value"] == "25"
    assert updated["fields"][0]["original_value"] == "20"
    assert updated["fields"][0]["is_edited"] is True
    assert updated["fields"][0]["evidence_type"] == "manual"

    # 5. EXPORT JSON
    export_json_res = await client.get(f"/api/records/{record_id}/export?format=json")
    assert export_json_res.status_code == 200
    assert "application/json" in export_json_res.headers["content-type"]
    exported_data = export_json_res.json()
    assert exported_data["id"] == record_id
    assert len(exported_data["fields"]) >= 1

    # 6. EXPORT CSV
    export_csv_res = await client.get(f"/api/records/{record_id}/export?format=csv")
    assert export_csv_res.status_code == 200
    assert "text/csv" in export_csv_res.headers["content-type"]
    csv_text = export_csv_res.text
    assert "VAANITRACE STRUCTURED RECORD EXPORT" in csv_text
    assert "quantity" in csv_text

    # 7. DELETE RECORD
    del_res = await client.delete(f"/api/records/{record_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Confirm deletion
    get_after_del = await client.get(f"/api/records/{record_id}")
    assert get_after_del.status_code == 404

