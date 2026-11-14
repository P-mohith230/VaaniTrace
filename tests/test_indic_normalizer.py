"""Tests for Rank 2: Colloquial Indic Packaging & Commodity Normalizer."""

import pytest
from app.services.indic_normalizer import indic_normalizer
from app.services.extractor import information_extractor
from app.services.export_service import export_service
from app.models import Record, ExtractedField, EvidenceRef


def test_bori_normalization_with_commodity():
    """Verify '50 bori basmati' normalizes to 2,500 kg, HSN 1006, 0% GST."""
    text = "Bhaiya 50 bori basmati chawal bhej do at 2500 per bori."
    parsed = indic_normalizer.parse_vernacular_phrase(text)
    assert parsed is not None
    qty, unit, phrase = parsed
    assert qty == 50.0
    assert unit == "bori"

    norm = indic_normalizer.normalize("basmati chawal", phrase, qty, unit)
    assert norm.standard_quantity == 2500.0
    assert norm.package_count == 50
    assert norm.hsn_code == "1006"
    assert norm.gst_rate_percent == 0.0
    assert "2,500 kg" in norm.standardized_display
    assert "50 bags × 50 kg/bag" in norm.conversion_formula


def test_chhota_hathi_vehicle_load_normalization():
    """Verify mini-truck (Chhota Hathi) vehicle load conversion to standard bags and metric tons."""
    text = "Send 2 chhota hathi of cement to the highway site."
    parsed = indic_normalizer.parse_vernacular_phrase(text)
    assert parsed is not None
    qty, unit, phrase = parsed
    assert qty == 2.0
    assert "chhota hathi" in unit

    norm = indic_normalizer.normalize("cement", phrase, qty, unit)
    # 2 mini-trucks × 40 bags/truck = 80 bags = 4,000 kg
    assert norm.package_count == 80
    assert norm.standard_quantity == 4000.0
    assert norm.hsn_code == "2523"
    assert norm.gst_rate_percent == 28.0
    assert "80 Bags" in norm.standardized_display
    assert "4,000 kg" in norm.standardized_display


def test_devanagari_spoken_phrase_parsing():
    """Verify Devanagari script numbers and units ('पचास बोरी')."""
    text = "हमें पचास बोरी गेहूं चाहिए।"
    parsed = indic_normalizer.parse_vernacular_phrase(text)
    assert parsed is not None
    qty, unit, phrase = parsed
    assert qty == 50.0
    assert unit == "बोरी"

    norm = indic_normalizer.normalize("गेहूं", phrase, qty, unit)
    assert norm.package_count == 50
    assert norm.standard_quantity == 2500.0


def test_peti_fruit_carton_normalization():
    """Verify '20 peti aam' (mango crates) normalizes with 12 kg standard crate density."""
    text = "Mandi se 20 peti aam deliver karwa do."
    parsed = indic_normalizer.parse_vernacular_phrase(text)
    assert parsed is not None
    qty, unit, phrase = parsed
    assert qty == 20.0
    assert unit == "peti"

    norm = indic_normalizer.normalize("aam", phrase, qty, unit)
    assert norm.standard_quantity == 240.0  # 20 crates × 12 kg
    assert norm.hsn_code == "0804"


def test_extractor_end_to_end_indic_packaging():
    """Verify information_extractor creates standardized_packaging and hsn_code fields."""
    transcript = "Namaste bhaiya, urgent 40 bori cement order kijiye at 380 rupees per bag. Friday tak bhej dena."
    result = information_extractor.extract(transcript, record_type="business_order")

    field_dict = {f.field_name: f for f in result.fields}
    assert "quantity" in field_dict
    assert field_dict["quantity"].current_value == "40"
    assert "Standard SI: 40 Bags (2,000 kg)" in field_dict["quantity"].notes

    # Check standardized packaging field
    assert "standardized_packaging" in field_dict
    assert field_dict["standardized_packaging"].current_value == "40 Bags (2,000 kg)"
    assert field_dict["standardized_packaging"].evidence_type == "calculated"

    # Check statutory HSN code field
    assert "hsn_code" in field_dict
    assert "2523" in field_dict["hsn_code"].current_value
    assert "28" in field_dict["hsn_code"].current_value


def test_tally_xml_export_with_indic_normalizer():
    """Verify Tally XML emits standardized actual/billed UOM and HSN elements."""
    record = Record(
        id="test-po-indic-001",
        title="Cement Mandi Order",
        record_type="business_order",
        language_code="hi-IN",
        original_transcript="40 bori cement at 380 rupees",
        cleaned_summary="40 bori cement order",
        verification_status="verified",
    )
    record.fields = [
        ExtractedField(
            record_id=record.id,
            field_name="product_name",
            current_value="Cement",
            evidence_type="spoken",
        ),
        ExtractedField(
            record_id=record.id,
            field_name="quantity",
            current_value="40",
            notes="Colloquial: 40 bori • Standard SI: 40 Bags (2,000 kg)",
            evidence_type="spoken",
        ),
        ExtractedField(
            record_id=record.id,
            field_name="unit_price",
            current_value="380",
            evidence_type="spoken",
        ),
        ExtractedField(
            record_id=record.id,
            field_name="standardized_packaging",
            current_value="40 Bags (2,000 kg)",
            evidence_type="calculated",
        ),
        ExtractedField(
            record_id=record.id,
            field_name="hsn_code",
            current_value="HSN 2523 (28% GST)",
            evidence_type="inferred",
        ),
    ]

    xml_content, filename = export_service.export_tally_xml(record)
    assert filename == "vaanitrace_tally_test-po-.xml"
    assert "<ACTUALQTY>40 BAGS</ACTUALQTY>" in xml_content
    assert "<BILLEDQTY>40 BAGS</BILLEDQTY>" in xml_content
    assert "<HSNCODE>2523</HSNCODE>" in xml_content
    assert "Spoken packaging standardized: 40 Bags (2,000 kg)" in xml_content
