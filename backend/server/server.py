
from __future__ import annotations

import asyncio
import json
import os
import sys
import threading
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

BACKEND_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_ROOT.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.report_runner import run_diagnostic_from_csv
from ai.utils import find_latest_csv
from backend.io.queue_publisher import AsyncQueueStatePublisher
from backend.io.sensor_input_queue import SensorInputQueue, AccelPacket


CFG_PATH = os.environ.get("TFMS_CONFIG", "config/default.yaml")
DIAG_PATH = os.environ.get("TFMS_DIAGNOSTIC", "outputs/runs/latest_diagnostic.json")


app = FastAPI(title="TFMS Backend Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


snapshot_queue: Optional[asyncio.Queue] = None
ingest_queue: Optional[SensorInputQueue] = None

class IngestPayload(BaseModel):
    device_id: str = Field(min_length=1, max_length=64)
    ts: float
    ts_unit: str = Field(pattern="(s|ms)$")
    ax: float
    ay: float
    az: float


@app.on_event("startup")
async def startup_event() -> None:
    global snapshot_queue, ingest_queue

    snapshot_queue = asyncio.Queue(maxsize=1)
    ingest_queue = SensorInputQueue(maxlen=256)

    app.state.last_snapshot = None

    loop = asyncio.get_running_loop()
    publisher = AsyncQueueStatePublisher(snapshot_queue, loop)

    def runtime_thread():
        from app.main import run_runtime_loop

        print("[runtime-thread] starting runtime loop")
        run_runtime_loop(
            cfg_path=CFG_PATH,
            publisher=publisher,
            ingest_queue=ingest_queue,
            run_forever=True,
        )
        print("[runtime-thread] runtime loop exited")

    t = threading.Thread(
        target=runtime_thread,
        name="TFMS-Runtime",
        daemon=True,
    )
    t.start()

    print("[startup] runtime thread started")

@app.on_event("shutdown")
def shutdown_event() -> None:
    """
    Optional: run diagnostic on latest CSV.
    """
    output_dir = Path("outputs/runs")
    latest_csv = find_latest_csv(output_dir)

    if latest_csv:
        print(f"[shutdown] AI running diagnostic for {latest_csv.name}")
        run_diagnostic_from_csv(latest_csv)
    else:
        print("[shutdown] no CSV found, skipping diagnostic")


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/ingest/sensor")
async def ingest_sensor(p: IngestPayload) -> Dict[str, Any]:
    """
    Receive sensor packet and push to ingest_queue.
    This endpoint must NOT build runtime snapshot and must NOT broadcast WS.
    Runtime core is the only place where decision is computed and snapshots are built.
    """
    if ingest_queue is None:
        return JSONResponse(
            status_code=503,
            content={"ok": False, "error": "ingest not ready"},
        )

    ts_sec = p.ts / 1000.0 if p.ts_unit == "ms" else p.ts

    pkt = AccelPacket(
        device_id=p.device_id,
        ts_sec=float(ts_sec),
        ax_g=float(p.ax),
        ay_g=float(p.ay),
        az_g=float(p.az),
        soil_moisture_percent= float
    )

    ingest_queue.push_drop_oldest(pkt)

    print(
        f"[INGEST] dev={p.device_id} "
        f"ax={pkt.ax_g:.4f} ay={pkt.ay_g:.4f} az={pkt.az_g:.4f}"
    )

    return {"ok": True, "queued": ingest_queue.size()}

@app.get("/diagnostic/latest")
def get_latest_diagnostic() -> Dict[str, Any]:
    if not os.path.isfile(DIAG_PATH):
        return {"available": False, "diagnostic": None}

    with open(DIAG_PATH, "r", encoding="utf-8") as f:
        return {"available": True, "diagnostic": json.load(f)}


@app.websocket("/ws")
@app.websocket("/ws/state")
async def websocket_state(websocket: WebSocket) -> None:
    """
    Stream snapshots produced by runtime core via snapshot_queue.
    Single authoritative source for UI.
    """
    await websocket.accept()

    if snapshot_queue is None:
        await websocket.close(code=1011)
        return

    print("[WS] client connected")

    last_snapshot = getattr(app.state, "last_snapshot", None)
    if last_snapshot is not None:
        try:
            await websocket.send_json(last_snapshot)
        except Exception:
            pass

    try:
        while True:
            snapshot = await snapshot_queue.get()
            app.state.last_snapshot = snapshot
            
            await websocket.send_json(snapshot)

    except WebSocketDisconnect:
        print("[WS] client disconnected")
        return

    except Exception as e:
        print("[WS ERROR]", repr(e))
        try:
            await websocket.close(code=1011)
        except Exception:
            pass
        return
