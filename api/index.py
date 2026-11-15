"""Vercel Serverless Function entrypoint for VaaniTrace FastAPI backend."""

import os
import sys

# Ensure root directory is on Python path so app modules import cleanly
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Set VERCEL environment variable flag
os.environ["VERCEL"] = "1"

from app.main import app

# Vercel invokes WSGI / ASGI app callable
handler = app
