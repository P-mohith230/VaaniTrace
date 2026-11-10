"""VaaniTrace main application server and entry point."""

import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config import settings
from app.database import init_db
from app.utils.file_storage import clean_orphan_uploads
from app.routes.health import router as health_router
from app.routes.transcription import router as transcription_router
from app.routes.extraction import router as extraction_router
from app.routes.speech import router as speech_router
from app.routes.records import router as records_router

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("vaanitrace")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    logger.info("Initializing VaaniTrace SQLite database schemas...")
    init_db()
    clean_orphan_uploads()
    logger.info("VaaniTrace startup complete.")
    yield
    logger.info("VaaniTrace shutting down, cleaning temporary resources...")
    clean_orphan_uploads()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multilingual voice-to-action intelligence platform powered by Gnani AI.",
    lifespan=lifespan,
)

# Configure CORS for local development when running separate dev servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(transcription_router)
app.include_router(extraction_router)
app.include_router(speech_router)
app.include_router(records_router)

# Mount Static Assets & SPA Routing for Unified Single Deployment
static_dir = Path(settings.STATIC_DIR)
index_html = static_dir / "index.html"
assets_dir = static_dir / "assets"

if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa_or_fallback(full_path: str, request: Request):
    """Serve single-page application index.html for frontend routes, or API status if not built."""
    # Never intercept /api, /docs, /openapi.json or /redoc
    if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})

    # Check for direct file match inside static_dir (e.g. favicon.svg, vite.svg)
    if static_dir.exists():
        direct_file = static_dir / full_path
        if direct_file.is_file():
            return FileResponse(direct_file)

        # Catch-all to index.html for client-side routing
        if index_html.exists():
            return FileResponse(index_html)

    # Fallback if frontend is not yet built
    return HTMLResponse(
        """
        <!DOCTYPE html>
        <html>
        <head>
            <title>VaaniTrace API Server</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; }
                .card { max-width: 650px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
                h1 { color: #38bdf8; margin-top: 0; }
                a { color: #38bdf8; text-decoration: none; font-weight: 500; }
                a:hover { text-decoration: underline; }
                .status { display: inline-block; padding: 4px 12px; background: #059669; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
            </style>
        </head>
        <body>
            <div class="card">
                <span class="status">● Backend Running</span>
                <h1>VaaniTrace API Server</h1>
                <p>The unified VaaniTrace backend is online and ready.</p>
                <p>• Explore the interactive <a href="/docs">OpenAPI Documentation</a></p>
                <p>• Check system diagnostics at <a href="/api/health">/api/health</a></p>
                <p>• Check Gnani AI connectivity at <a href="/api/health/gnani">/api/health/gnani</a></p>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">Frontend assets are currently building. Once compiled, this page will serve the full React web workspace.</p>
            </div>
        </body>
        </html>
        """
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
