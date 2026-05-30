#
# Created on Thu Jan 15 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

from typing import Optional

from typing import Optional

from backend.io.sensor_input_queue import SensorInputQueue, AccelPacket
from sources.base import SensorSource
from sources.sample import SensorSample



class Esp32QueueSource(SensorSource):
    """
    Source untuk membaca data terbaru dari SensorInputQueue (ESP32 ingestion).

    Catatan:
    - pop_latest() melakukan coalescing (ambil newest, buang backlog).
    - t_sec dibuat relatif dari paket pertama (base timestamp).
    """

    def __init__(self, q: SensorInputQueue):
        self._q = q
        self._base_ts_sec: Optional[float] = None

    def next(self) -> Optional[SensorSample]:
        pkt: Optional[AccelPacket] = self._q.pop_latest()
        if pkt is None:
            return None

        if self._base_ts_sec is None:
            self._base_ts_sec = pkt.ts_sec

        t_sec = max(0.0, pkt.ts_sec - self._base_ts_sec)

        return SensorSample(
            t_sec=t_sec,
            ax_g=pkt.ax_g,
            ay_g=pkt.ay_g,
            az_g=pkt.az_g,
            true_tilt_deg=0.0,
            anomaly_active=False,
        )
