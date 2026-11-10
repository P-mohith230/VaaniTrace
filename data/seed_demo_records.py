"""Seed initial high-quality demonstration records into SQLite database."""

from app.database import SessionLocal, init_db
from app.models import Record, ExtractedField, EvidenceRef, ActionItem


def seed_database():
    """Populate database with sample verified records if empty."""
    init_db()
    db = SessionLocal()

    try:
        if db.query(Record).count() > 0:
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding initial demonstration voice records into SQLite...")

        # 1. B2B Wholesale Medical Order
        rec1 = Record(
            title="B2B Wholesale Medical Supply Order",
            record_type="business_order",
            original_transcript=(
                "Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves "
                "at 1200 rupees each. Please deliver them by Friday to our central warehouse."
            ),
            cleaned_summary=(
                "Customer placed an order for 20 boxes of surgical gloves at ₹1,200.00 each, "
                "required by Friday to central warehouse."
            ),
            language_code="en-IN",
            verification_status="verified",
        )
        db.add(rec1)
        db.flush()

        # Fields for rec1
        f1_item = ExtractedField(
            record_id=rec1.id,
            field_name="order_item",
            original_value="surgical gloves",
            current_value="surgical gloves",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Primary item requested in the conversation",
        )
        db.add(f1_item)
        db.flush()
        db.add(EvidenceRef(
            field_id=f1_item.id,
            supporting_text="surgical gloves",
            segment_index=0,
            start_char=59,
            end_char=74,
        ))

        f1_qty = ExtractedField(
            record_id=rec1.id,
            field_name="quantity",
            original_value="20",
            current_value="20",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Unit: boxes",
        )
        db.add(f1_qty)
        db.flush()
        db.add(EvidenceRef(
            field_id=f1_qty.id,
            supporting_text="20 boxes",
            segment_index=0,
            start_char=47,
            end_char=55,
        ))

        f1_price = ExtractedField(
            record_id=rec1.id,
            field_name="unit_price",
            original_value="₹1,200.00",
            current_value="₹1,200.00",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Quoted unit price",
        )
        db.add(f1_price)
        db.flush()
        db.add(EvidenceRef(
            field_id=f1_price.id,
            supporting_text="1200 rupees",
            segment_index=0,
            start_char=78,
            end_char=89,
        ))

        f1_total = ExtractedField(
            record_id=rec1.id,
            field_name="total_amount",
            original_value="₹24,000.00",
            current_value="₹24,000.00",
            evidence_type="calculated",
            is_edited=False,
            verification_status="verified",
            notes="Calculated: 20 (quantity) × ₹1,200.00 (unit price) = ₹24,000.00",
        )
        db.add(f1_total)
        db.flush()
        db.add(EvidenceRef(
            field_id=f1_total.id,
            supporting_text="20 boxes ... 1200 rupees",
            segment_index=0,
            start_char=47,
            end_char=89,
        ))

        f1_deadline = ExtractedField(
            record_id=rec1.id,
            field_name="delivery_deadline",
            original_value="Friday",
            current_value="Friday",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
        )
        db.add(f1_deadline)
        db.flush()
        db.add(EvidenceRef(
            field_id=f1_deadline.id,
            supporting_text="by Friday",
            segment_index=0,
            start_char=110,
            end_char=119,
        ))

        db.add(ActionItem(
            record_id=rec1.id,
            description="Fulfill and dispatch 20 boxes of surgical gloves to central warehouse",
            assignee="Rajesh",
            deadline="Friday",
            status="pending",
        ))

        # 2. Site Inspection Debrief
        rec2 = Record(
            title="Sector 4 Solar Facility Site Inspection",
            record_type="field_report",
            original_transcript=(
                "Site inspection at Warehouse 4 completed. We identified a critical water leakage "
                "in the northern corridor near Inverter B. Immediate repair is required."
            ),
            cleaned_summary=(
                "Field inspection report for Warehouse 4. Observed critical water leakage "
                "near Inverter B. Urgent repair dispatch scheduled."
            ),
            language_code="en-IN",
            verification_status="needs_review",
        )
        db.add(rec2)
        db.flush()

        f2_loc = ExtractedField(
            record_id=rec2.id,
            field_name="site_location",
            original_value="Warehouse 4",
            current_value="Warehouse 4",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
        )
        db.add(f2_loc)
        db.flush()
        db.add(EvidenceRef(
            field_id=f2_loc.id,
            supporting_text="Warehouse 4",
            segment_index=0,
            start_char=19,
            end_char=30,
        ))

        f2_status = ExtractedField(
            record_id=rec2.id,
            field_name="equipment_status",
            original_value="critical water leakage",
            current_value="critical water leakage",
            evidence_type="spoken",
            is_edited=False,
            verification_status="needs_review",
            notes="Flagged for facility safety audit",
        )
        db.add(f2_status)
        db.flush()
        db.add(EvidenceRef(
            field_id=f2_status.id,
            supporting_text="critical water leakage",
            segment_index=1,
            start_char=59,
            end_char=81,
        ))

        db.add(ActionItem(
            record_id=rec2.id,
            description="Dispatch maintenance technician to seal water leakage near Inverter B",
            assignee="Facilities Team",
            deadline="Within 24 hours",
            status="in_progress",
        ))

        db.commit()
        print("Successfully seeded 2 demonstration records with verified evidence!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
