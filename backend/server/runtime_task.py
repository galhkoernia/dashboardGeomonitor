#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

import asyncio
from typing import Dict, Any


async def run_simulation(publisher) -> None:
    tick_hz = 1.0
    dt = 1.0 / tick_hz

    while True:
        
        snapshot: Dict[str, Any] = {
            "t_sec": 0.0,
            "tilt_est_deg": 0.0,
            "tilt_filt_deg": 0.0,
            "slope_deg_per_hour": 0.0,
            "delta_deg": 0.0,
            "r2": 0.0,
            "sigma_deg": 0.0,
            "consistency": 1.0,
            "slope_ok": True,
            "status": "NORMAL",
            "reason": "init",
            "anomaly_active": False,
        }
        publisher.publish(snapshot)
        await asyncio.sleep(dt)