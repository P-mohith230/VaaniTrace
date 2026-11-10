"""Comprehensive end-to-end integration and verification script for VaaniTrace."""

import sys
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db


def run_full_verification():
    print("=" * 65)
    print("VAANITRACE FULL INTEGRATION & WORKFLOW VERIFICATION SUITE")
    print("=" * 65)

    # 1. Initialize DB and check schemas
    print("\n[STEP 1] Initializing SQLite database schemas...")
    init_db()
    print("-> SUCCESS: Database initialized without error.")

    with TestClient(app=app, base_url="http://localhost:8000") as client:
        # 2. Check Static Assets & SPA Root Routing
        print("\n[STEP 2] Verifying Single-Deployment Static Web UI...")
        res_root = client.get("/")
        assert res_root.status_code == 200, f"Expected 200 on '/', got {res_root.status_code}"
        assert '<div id="root"></div>' in res_root.text, "React root element missing"
        print("-> SUCCESS: Production React SPA served at '/' (HTTP 200)")

        # Verify static asset routing
        res_css = client.get("/assets/index-DNht_swU.css")
        assert res_css.status_code == 200, f"Expected 200 on CSS asset, got {res_css.status_code}"
        print(f"-> SUCCESS: Static CSS bundle served ({len(res_css.content)} bytes)")

        # Verify SPA catch-all routing (e.g. /workspace, /records)
        res_spa_route = client.get("/workspace")
        assert res_spa_route.status_code == 200
        assert '<div id="root"></div>' in res_spa_route.text
        print("-> SUCCESS: SPA client routing catch-all verified at '/workspace'")

        # 3. Check System Health
        print("\n[STEP 3] Verifying /api/health diagnostic...")
        res_health = client.get("/api/health")
        assert res_health.status_code == 200
        h_data = res_health.json()
        assert h_data["status"] in ("healthy", "degraded")
        assert h_data["backend"] == "online"
        assert h_data["database"] == "connected"
        print(f"-> SUCCESS: Health status={h_data['status']}, db={h_data['database']}")

        # 4. Check Gnani Health
        print("\n[STEP 4] Verifying /api/health/gnani diagnostic...")
        res_gnani = client.get("/api/health/gnani")
        assert res_gnani.status_code == 200
        g_data = res_gnani.json()
        print(f"-> SUCCESS: Gnani STT={g_data['model_stt']}, TTS={g_data['model_tts']}, Configured={g_data['configured']}")

        # 5. Check Structured Information Extraction & Evidence Mapping
        print("\n[STEP 5] Testing Structured Information Extraction (Business Order)...")
        transcript_sample = (
            "Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves "
            "at 1200 rupees each. Please deliver them by Friday to our central warehouse."
        )
        res_extract = client.post(
            "/api/extract",
            json={"transcript": transcript_sample, "record_type": "business_order"},
        )
        assert res_extract.status_code == 200
        extract_data = res_extract.json()
        fields = {f["field_name"]: f for f in extract_data["fields"]}

        # Check extracted fields
        assert "quantity" in fields, "Missing quantity field"
        assert fields["quantity"]["current_value"] == "20"
        assert fields["quantity"]["evidence"]["supporting_text"] == "20 boxes"

        assert "unit_price" in fields, "Missing unit_price field"
        assert "1,200" in fields["unit_price"]["current_value"] or "1200" in fields["unit_price"]["current_value"]

        assert "total_amount" in fields, "Missing calculated total_amount field"
        assert fields["total_amount"]["evidence_type"] == "calculated"
        assert "24,000" in fields["total_amount"]["current_value"]
        assert "Calculated" in fields["total_amount"]["notes"]
        print(f"-> SUCCESS: Extracted quantity={fields['quantity']['current_value']}, price={fields['unit_price']['current_value']}")
        print(f"-> SUCCESS: Derived calculated total={fields['total_amount']['current_value']} (Formula: {fields['total_amount']['notes']})")
        print(f"-> SUCCESS: Evidence linked: '{fields['quantity']['evidence']['supporting_text']}' at chars {fields['quantity']['evidence']['start_char']}-{fields['quantity']['evidence']['end_char']}")

        # 6. Check Action Items Extraction
        assert len(extract_data["action_items"]) >= 1, "Missing action items"
        print(f"-> SUCCESS: Action items extracted: {extract_data['action_items'][0]['description']} (Due: {extract_data['action_items'][0]['deadline']})")

        # 7. Check Record Persistence (SQLite CRUD)
        print("\n[STEP 6] Testing Record Database Persistence (SQLite CRUD)...")
        create_payload = {
            "title": "Medical Center Wholesale Supply Order",
            "record_type": "business_order",
            "original_transcript": transcript_sample,
            "cleaned_summary": extract_data["summary"],
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
                        "start_char": 47,
                        "end_char": 55,
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
                    "description": "Fulfill 20 boxes of surgical gloves to central warehouse",
                    "deadline": "Friday",
                    "status": "pending",
                }
            ],
        }
        res_create = client.post("/api/records", json=create_payload)
        assert res_create.status_code == 201
        created = res_create.json()
        rec_id = created["id"]
        print(f"-> SUCCESS: Record created with ID: {rec_id} (Title: '{created['title']}')")

        # Update record with manual edit
        print("\n[STEP 7] Testing Human Verification & Manual Edit Handling...")
        update_payload = {
            "verification_status": "verified",
            "fields": [
                {
                    "field_name": "quantity",
                    "original_value": "20",
                    "current_value": "22",  # User edited from 20 to 22
                    "evidence_type": "spoken",
                    "verification_status": "verified",
                    "notes": "User adjusted to 22",
                }
            ],
        }
        res_update = client.put(f"/api/records/{rec_id}", json=update_payload)
        assert res_update.status_code == 200
        updated = res_update.json()
        assert updated["verification_status"] == "verified"
        assert updated["fields"][0]["current_value"] == "22"
        assert updated["fields"][0]["is_edited"] is True
        assert updated["fields"][0]["evidence_type"] == "manual"
        print(f"-> SUCCESS: Manual edit preserved: original='{updated['fields'][0]['original_value']}' -> current='{updated['fields'][0]['current_value']}' (evidence_type='{updated['fields'][0]['evidence_type']}')")

        # 8. Check JSON and CSV Exports
        print("\n[STEP 8] Testing JSON and CSV Structured Data Export...")
        res_exp_json = client.get(f"/api/records/{rec_id}/export?format=json")
        assert res_exp_json.status_code == 200
        assert "application/json" in res_exp_json.headers["content-type"]
        print(f"-> SUCCESS: JSON export verified ({len(res_exp_json.content)} bytes)")

        res_exp_csv = client.get(f"/api/records/{rec_id}/export?format=csv")
        assert res_exp_csv.status_code == 200
        assert "text/csv" in res_exp_csv.headers["content-type"]
        assert "VAANITRACE STRUCTURED RECORD EXPORT" in res_exp_csv.text
        print(f"-> SUCCESS: CSV export verified ({len(res_exp_csv.content)} bytes)")

        # 9. Clean up test record
        res_del = client.delete(f"/api/records/{rec_id}")
        assert res_del.status_code == 200
        print(f"-> SUCCESS: Test record cleanly removed from SQLite.")

    print("\n" + "=" * 65)
    print("VERIFICATION COMPLETE: ALL 8 CORE PLATFORM WORKFLOWS PASSED!")
    print("=" * 65)
    return True


if __name__ == "__main__":
    success = run_full_verification()
    sys.exit(0 if success else 1)
