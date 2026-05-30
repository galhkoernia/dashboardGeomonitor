# ====================================================
# File      : run_with_ui.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

import os

import uvicorn

from server.server import app


def run() -> None:
    """
    Start the FastAPI backend server.
    """
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "8000")),
        log_level="info",
    )


if __name__ == "__main__":
    run()