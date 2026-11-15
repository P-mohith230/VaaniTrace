import uuid
import datetime
from pathlib import Path
from app.services.extractor import information_extractor
from app.services.export_service import export_service
from app.services.dispute_simulator import dispute_service
from app.models import Record, ExtractedField, ActionItem, EvidenceRef

transcript = (
    "Hello Rajesh, this is Suresh speaking. "
    "I need 25 boxes of surgical gloves at 1200 rupees each. "
    "Please deliver them by Friday to our central warehouse."
)

res = information_extractor.extract(transcript, record_type="business_order")

print("=== EXTRACTION RESULT ===")
print("Summary:", res.summary)
print("\nExtracted Fields:")
for f in res.fields:
    ev_str = f.evidence.supporting_text if f.evidence else "N/A"
    print(f"  [{f.field_name}] -> {f.current_value} (Evidence: '{ev_str}')")

rec_id = "rec-demo-2026-audit"
title = "Wholesale Surgical Gloves Order - Suresh to Rajesh"
rec = Record(
    id=rec_id,
    title=title,
    record_type="business_order",
    language_code="en-IN",
    original_transcript=transcript,
    cleaned_summary=res.summary,
    verification_status="verified",
    created_at=datetime.datetime.now(datetime.timezone.utc),
)
rec.fields = [
    ExtractedField(
        id=f"fld-{idx}",
        record_id=rec_id,
        field_name=f.field_name,
        current_value=f.current_value,
        original_value=f.original_value,
        evidence_type=f.evidence_type,
        verification_status=f.verification_status,
        notes=f.notes,
        evidence=EvidenceRef(
            id=f"evi-{idx}",
            supporting_text=f.evidence.supporting_text,
            segment_index=f.evidence.segment_index,
            start_char=f.evidence.start_char,
            end_char=f.evidence.end_char,
        ) if f.evidence else None,
    )
    for idx, f in enumerate(res.fields)
]
rec.action_items = [
    ActionItem(
        id=f"act-{idx}",
        record_id=rec_id,
        description=a.description,
        assignee=a.assignee,
        deadline=a.deadline,
        status=a.status,
    )
    for idx, a in enumerate(res.action_items)
]

out_dir = Path("exports_demo")
out_dir.mkdir(exist_ok=True)

json_str, json_name = export_service.export_json(rec)
(out_dir / json_name).write_text(json_str, encoding="utf-8")

csv_str, csv_name = export_service.export_csv(rec)
(out_dir / csv_name).write_text(csv_str, encoding="utf-8")

xlsx_bytes, xlsx_name = export_service.export_excel(rec)
(out_dir / xlsx_name).write_bytes(xlsx_bytes)

xml_str, xml_name = export_service.export_tally_xml(rec)
(out_dir / xml_name).write_text(xml_str, encoding="utf-8")

print("\n=== GENERATED EXPORT FILES ===")
print(f"JSON:      exports_demo/{json_name} ({len(json_str)} chars)")
print(f"CSV:       exports_demo/{csv_name} ({len(csv_str)} chars)")
print(f"XLSX:      exports_demo/{xlsx_name} ({len(xlsx_bytes)} bytes)")
print(f"Tally XML: exports_demo/{xml_name} ({len(xml_str)} chars)")
