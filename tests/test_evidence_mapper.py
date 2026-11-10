"""Tests for transcript segmentation and evidence mapping."""

from app.services.evidence_mapper import evidence_mapper


def test_segment_transcript_english():
    """Test standard English punctuation segmentation with character offsets."""
    text = "Hello Ramesh, this is Suresh. I need 20 boxes of apples. Please deliver them by Friday."
    segments = evidence_mapper.segment_transcript(text)
    assert len(segments) == 3
    assert segments[0].text == "Hello Ramesh, this is Suresh."
    assert segments[1].text == "I need 20 boxes of apples."
    assert segments[2].text == "Please deliver them by Friday."

    # Validate offsets match exact slices in original transcript
    for seg in segments:
        assert text[seg.start_char:seg.end_char] == seg.text


def test_segment_transcript_devanagari_danda():
    """Test Hindi / Indic transcript segmentation with danda punctuation (।)."""
    text = "नमस्ते रमेश भाई। मुझे बीस बॉक्स मंगवाने हैं। कल तक भेज देना।"
    segments = evidence_mapper.segment_transcript(text)
    assert len(segments) == 3
    for seg in segments:
        assert text[seg.start_char:seg.end_char] == seg.text


def test_locate_phrase_exact():
    """Test exact phrase matching and offset retrieval."""
    text = "Please dispatch 50 units of Model X to warehouse 4 by Monday."
    segments = evidence_mapper.segment_transcript(text)

    loc = evidence_mapper.locate_phrase(text, segments, "50 units")
    assert loc is not None
    start_ch, end_ch, seg_id = loc
    assert text[start_ch:end_ch] == "50 units"


def test_create_field_with_evidence():
    """Test field creation correctly attaches evidence references."""
    text = "We have 15 cartons of mangoes available for dispatch."
    segments = evidence_mapper.segment_transcript(text)

    field = evidence_mapper.create_field(
        field_name="quantity",
        value="15",
        supporting_text="15 cartons",
        evidence_type="spoken",
        transcript=text,
        segments=segments,
    )
    assert field.field_name == "quantity"
    assert field.current_value == "15"
    assert field.evidence is not None
    assert field.evidence.supporting_text == "15 cartons"
    assert field.evidence.start_char is not None
    assert text[field.evidence.start_char:field.evidence.end_char] == "15 cartons"
