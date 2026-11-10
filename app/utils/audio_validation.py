"""Audio validation utility for MIME types, magic bytes, and file size."""

from fastapi import HTTPException, UploadFile, status
from app.config import settings

# Supported audio MIME types
SUPPORTED_MIME_TYPES = {
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
    "audio/x-flac",
    "audio/aac",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "application/octet-stream",  # Often sent by browsers for recorded blobs
}

# Supported file extensions
SUPPORTED_EXTENSIONS = {".wav", ".mp3", ".ogg", ".webm", ".flac", ".aac", ".m4a"}


def check_magic_bytes(header: bytes) -> bool:
    """Validate common audio file signatures (magic bytes)."""
    if len(header) < 4:
        return False

    # WAV (RIFF....WAVE)
    if header.startswith(b"RIFF") and len(header) >= 12 and header[8:12] == b"WAVE":
        return True

    # MP3 (ID3v2 or MPEG sync frame)
    if header.startswith(b"ID3"):
        return True
    if len(header) >= 2 and header[0] == 0xFF and (header[1] & 0xE0) == 0xE0:
        return True

    # OGG
    if header.startswith(b"OggS"):
        return True

    # WebM / MKV (EBML ID)
    if header.startswith(b"\x1a\x45\xdf\xa3"):
        return True

    # FLAC
    if header.startswith(b"fLaC"):
        return True

    # MP4 / M4A (ftyp at offset 4)
    if len(header) >= 8 and header[4:8] == b"ftyp":
        return True

    # AAC ADTS
    if len(header) >= 2 and header[0] == 0xFF and (header[1] & 0xF6) == 0xF0:
        return True

    return False


async def validate_audio_file(file: UploadFile) -> bytes:
    """Validate uploaded audio file and return its full content."""
    # Check filename extension if available
    filename = (file.filename or "").lower()
    has_valid_ext = any(filename.endswith(ext) for ext in SUPPORTED_EXTENSIONS)

    # Validate content type
    content_type = (file.content_type or "").lower().split(";")[0].strip()
    if content_type not in SUPPORTED_MIME_TYPES and not has_valid_ext:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported audio format: '{file.content_type}'. Supported formats: WAV, MP3, OGG, WebM, FLAC, M4A, AAC.",
        )

    # Read content
    content = await file.read()
    if not content or len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded audio file is empty (0 bytes). Please upload or record valid audio.",
        )

    # Check maximum file size
    if len(content) > settings.MAX_AUDIO_SIZE_BYTES:
        max_mb = settings.MAX_AUDIO_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file size exceeds limit of {max_mb:.0f} MB.",
        )

    # Check magic bytes (read first 64 bytes)
    header = content[:64]
    # Note: If browser sent application/octet-stream or webm blob, allow if header matches or extension matches
    if not check_magic_bytes(header) and not has_valid_ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not appear to be a valid supported audio stream.",
        )

    # Reset file pointer for future reads if needed
    await file.seek(0)
    return content
