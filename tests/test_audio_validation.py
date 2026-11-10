"""Tests for audio file validation utility."""

import pytest
from fastapi import UploadFile, HTTPException
from io import BytesIO
from app.utils.audio_validation import check_magic_bytes, validate_audio_file


def create_mock_upload(content: bytes, filename: str, content_type: str) -> UploadFile:
    """Helper to generate an UploadFile for unit testing."""
    return UploadFile(
        file=BytesIO(content),
        size=len(content),
        filename=filename,
        headers={"content-type": content_type},
    )


def test_magic_bytes_detection():
    """Test magic bytes identification across various formats."""
    # Valid WAV header
    wav_header = b"RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00"
    assert check_magic_bytes(wav_header) is True

    # Valid MP3 ID3 header
    mp3_header = b"ID3\x03\x00\x00\x00\x00\x0f\x76"
    assert check_magic_bytes(mp3_header) is True

    # Valid OGG header
    ogg_header = b"OggS\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00"
    assert check_magic_bytes(ogg_header) is True

    # Valid WebM header
    webm_header = b"\x1a\x45\xdf\xa3\x9f\x42\x86\x81\x01\x42\xf7\x81\x01"
    assert check_magic_bytes(webm_header) is True

    # Random text (invalid)
    text_header = b"This is a plain text file not audio"
    assert check_magic_bytes(text_header) is False


@pytest.mark.asyncio
async def test_validate_empty_file():
    """Empty files must raise 400 Bad Request."""
    empty_upload = create_mock_upload(b"", "empty.wav", "audio/wav")
    with pytest.raises(HTTPException) as exc:
        await validate_audio_file(empty_upload)
    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_validate_unsupported_mime():
    """Unsupported non-audio formats must raise 415 Unsupported Media Type."""
    pdf_upload = create_mock_upload(b"%PDF-1.4...", "doc.pdf", "application/pdf")
    with pytest.raises(HTTPException) as exc:
        await validate_audio_file(pdf_upload)
    assert exc.value.status_code == 415


@pytest.mark.asyncio
async def test_validate_valid_wav():
    """Properly formatted WAV upload must pass validation."""
    wav_content = b"RIFF" + (36).to_bytes(4, "little") + b"WAVEfmt " + (16).to_bytes(4, "little") + b"\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data" + (0).to_bytes(4, "little")
    valid_upload = create_mock_upload(wav_content, "sample.wav", "audio/wav")
    validated_bytes = await validate_audio_file(valid_upload)
    assert len(validated_bytes) == len(wav_content)

