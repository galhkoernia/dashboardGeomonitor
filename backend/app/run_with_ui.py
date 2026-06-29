#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

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