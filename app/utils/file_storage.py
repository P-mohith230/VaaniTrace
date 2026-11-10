"""Safe temporary file management and cleanup."""

import os
import uuid
from pathlib import Path
from typing import Generator
from contextlib import contextmanager
from app.config import settings


@contextmanager
def temporary_audio_file(content: bytes, extension: str = ".wav") -> Generator[Path, None, None]:
    """Context manager that writes bytes to a temp file and reliably deletes it afterwards."""
    upload_dir = Path(settings.DATA_DIR) / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    if not extension.startswith("."):
        extension = f".{extension}"

    temp_path = upload_dir / f"tmp_{uuid.uuid4().hex}{extension}"
    try:
        temp_path.write_bytes(content)
        yield temp_path
    finally:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass


def clean_orphan_uploads():
    """Remove any leftover temporary upload files from previous sessions."""
    upload_dir = Path(settings.DATA_DIR) / "uploads"
    if not upload_dir.exists():
        return
    for f in upload_dir.glob("tmp_*"):
        try:
            if f.is_file():
                f.unlink()
        except OSError:
            pass

