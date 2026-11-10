"""Seed initial high-quality demonstration records into SQLite database."""

import sys
from app.database import SessionLocal, init_db
from app.models import Record, ExtractedField, EvidenceRef, ActionItem


def seed_database(force: bool = False):
    """Populate database with sample verified records across all 5 domains."""
    init_db()
    db = SessionLocal()

    try:
        existing_count = db.query(Record).count()
        if existing_count > 0 and not force:
            print(f"Database already contains {existing_count} records. Pass force=True to reseed.")
            return

        if force and existing_count > 0:
            print("Force flag set: clearing existing demo records...")
            db.query(EvidenceRef).delete()
            db.query(ExtractedField).delete()
            db.query(ActionItem).delete()
            db.query(Record).delete()
            db.commit()

        print("Seeding 5 comprehensive demonstration voice records into SQLite...")

        # ---------------------------------------------------------
        # 1. B2B Wholesale Medical Order (business_order)
        # ---------------------------------------------------------
        rec1 = Record(
            title="B2B Wholesale Medical Supply Order",
            record_type="business_order",
            original_transcript=(
                "Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves "
                "at 1200 rupees each. Please deliver them by Friday to our central warehouse."
            ),
            cleaned_summary=(
                "Customer Suresh placed an order for 20 boxes of surgical gloves at ₹1,200.00 each, "
                "totaling ₹24,000.00, required by Friday to the central warehouse."
            ),
            language_code="en-IN",
            verification_status="verified",
        )
        db.add(rec1)
        db.flush()

        f1_item = ExtractedField(
            record_id=rec1.id,
            field_name="order_item",
            original_value="surgical gloves",
            current_value="surgical gloves",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Primary medical consumable requested",
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
            notes="Quoted unit rate",
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

        # ---------------------------------------------------------
        # 2. Sector 4 Solar Facility Inspection (field_report)
        # ---------------------------------------------------------
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

        # ---------------------------------------------------------
        # 3. Weekly Engineering Sprint Sync (meeting_action_items)
        # ---------------------------------------------------------
        rec3 = Record(
            title="Weekly Engineering Sprint Sync",
            record_type="meeting_action_items",
            original_transcript=(
                "In today's sync, Priya will prepare the slide deck by Friday. "
                "Rahul to review the client contract. Ankit will deploy the security patch before EOD."
            ),
            cleaned_summary=(
                "Weekly engineering sprint synchronization meeting. Assigned slide preparation "
                "to Priya, contract review to Rahul, and security deployment to Ankit."
            ),
            language_code="en-IN",
            verification_status="verified",
        )
        db.add(rec3)
        db.flush()

        f3_t1 = ExtractedField(
            record_id=rec3.id,
            field_name="task_1",
            original_value="prepare the slide deck",
            current_value="prepare the slide deck",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Owner: Priya | Due: Friday",
        )
        db.add(f3_t1)
        db.flush()
        db.add(EvidenceRef(
            field_id=f3_t1.id,
            supporting_text="prepare the slide deck",
            segment_index=0,
            start_char=28,
            end_char=50,
        ))

        f3_t2 = ExtractedField(
            record_id=rec3.id,
            field_name="task_2",
            original_value="review the client contract",
            current_value="review the client contract",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="Owner: Rahul",
        )
        db.add(f3_t2)
        db.flush()
        db.add(EvidenceRef(
            field_id=f3_t2.id,
            supporting_text="review the client contract",
            segment_index=1,
            start_char=71,
            end_char=97,
        ))

        db.add(ActionItem(
            record_id=rec3.id,
            description="Prepare the slide deck for client presentation",
            assignee="Priya",
            deadline="Friday",
            status="pending",
        ))
        db.add(ActionItem(
            record_id=rec3.id,
            description="Review the client contract terms and conditions",
            assignee="Rahul",
            deadline="Next Monday",
            status="in_progress",
        ))
        db.add(ActionItem(
            record_id=rec3.id,
            description="Deploy the security patch to production",
            assignee="Ankit",
            deadline="EOD Today",
            status="completed",
        ))

        # ---------------------------------------------------------
        # 4. Enterprise Fiber Outage Grievance (customer_complaint)
        # ---------------------------------------------------------
        rec4 = Record(
            title="Enterprise Fiber Outage Grievance",
            record_type="customer_complaint",
            original_transcript=(
                "This is urgent! My broadband service has been disconnected since yesterday "
                "and no one is responding to my tickets. We are losing business operations."
            ),
            cleaned_summary=(
                "Escalated grievance regarding unexpected broadband disconnection since yesterday. "
                "Customer reports lack of ticket response and disruption of business operations."
            ),
            language_code="en-IN",
            verification_status="unverified",
        )
        db.add(rec4)
        db.flush()

        f4_issue = ExtractedField(
            record_id=rec4.id,
            field_name="complaint_issue",
            original_value="broadband service disconnected",
            current_value="broadband service disconnected",
            evidence_type="spoken",
            is_edited=False,
            verification_status="unverified",
            notes="Outage duration: >24 hours",
        )
        db.add(f4_issue)
        db.flush()
        db.add(EvidenceRef(
            field_id=f4_issue.id,
            supporting_text="broadband service has been disconnected",
            segment_index=1,
            start_char=19,
            end_char=59,
        ))

        f4_urgency = ExtractedField(
            record_id=rec4.id,
            field_name="urgency_level",
            original_value="critical / urgent",
            current_value="critical / urgent",
            evidence_type="inferred",
            is_edited=False,
            verification_status="unverified",
            notes="Inferred from 'This is urgent!' and 'losing business operations'",
        )
        db.add(f4_urgency)
        db.flush()
        db.add(EvidenceRef(
            field_id=f4_urgency.id,
            supporting_text="This is urgent! ... We are losing business operations.",
            segment_index=0,
            start_char=0,
            end_char=150,
        ))

        db.add(ActionItem(
            record_id=rec4.id,
            description="Escalate ticket to L2 Network NOC engineer for line diagnostics",
            assignee="NOC Support Desk",
            deadline="Within 2 hours",
            status="pending",
        ))

        # ---------------------------------------------------------
        # 5. आम थोक व्यापार (Hindi Wholesale Order)
        # ---------------------------------------------------------
        rec5 = Record(
            title="आम का थोक व्यापार आदेश (Hindi Mango Wholesale Order)",
            record_type="business_order",
            original_transcript=(
                "नमस्ते रमेश भाई। मुझे 50 कार्टन आम चाहिए। 600 रुपये प्रति कार्टन का भाव तय हुआ था। "
                "कल शाम तक दुकान पर भेज देना।"
            ),
            cleaned_summary=(
                "रमेश भाई को 50 कार्टन आम का व्यापार आदेश, प्रति कार्टन ₹600.00 की दर से, कुल ₹30,000.00। "
                "कल शाम तक दुकान पर डिलीवरी की आवश्यकता है।"
            ),
            language_code="hi-IN",
            verification_status="verified",
        )
        db.add(rec5)
        db.flush()

        f5_item = ExtractedField(
            record_id=rec5.id,
            field_name="order_item",
            original_value="आम (Mango)",
            current_value="आम (Mango)",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
            notes="दुकान के लिए अल्फांसो / दशहरी आम",
        )
        db.add(f5_item)
        db.flush()
        db.add(EvidenceRef(
            field_id=f5_item.id,
            supporting_text="आम चाहिए",
            segment_index=1,
            start_char=27,
            end_char=35,
        ))

        f5_qty = ExtractedField(
            record_id=rec5.id,
            field_name="quantity",
            original_value="50 कार्टन",
            current_value="50 कार्टन",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
        )
        db.add(f5_qty)
        db.flush()
        db.add(EvidenceRef(
            field_id=f5_qty.id,
            supporting_text="50 कार्टन",
            segment_index=1,
            start_char=17,
            end_char=26,
        ))

        f5_price = ExtractedField(
            record_id=rec5.id,
            field_name="unit_price",
            original_value="₹600.00",
            current_value="₹600.00",
            evidence_type="spoken",
            is_edited=False,
            verification_status="verified",
        )
        db.add(f5_price)
        db.flush()
        db.add(EvidenceRef(
            field_id=f5_price.id,
            supporting_text="600 रुपये प्रति कार्टन",
            segment_index=2,
            start_char=37,
            end_char=59,
        ))

        f5_total = ExtractedField(
            record_id=rec5.id,
            field_name="total_amount",
            original_value="₹30,000.00",
            current_value="₹30,000.00",
            evidence_type="calculated",
            is_edited=False,
            verification_status="verified",
            notes="गणना: 50 (मात्रा) × ₹600.00 (दर) = ₹30,000.00",
        )
        db.add(f5_total)
        db.flush()
        db.add(EvidenceRef(
            field_id=f5_total.id,
            supporting_text="50 कार्टन ... 600 रुपये",
            segment_index=1,
            start_char=17,
            end_char=59,
        ))

        db.add(ActionItem(
            record_id=rec5.id,
            description="50 कार्टन आम पैक करके कल शाम तक दुकान पर डिलीवर करें",
            assignee="रमेश भाई (सप्लायर)",
            deadline="कल शाम तक",
            status="pending",
        ))

        db.commit()
        print("Successfully seeded 5 diverse multilingual demonstration records with verified evidence!")

    finally:
        db.close()


if __name__ == "__main__":
    force_reseed = "--force" in sys.argv
    seed_database(force=force_reseed)
