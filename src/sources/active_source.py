#
# Created on Thu Jan 15 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

from typing import Optional

from src.sources.base import SensorSource
from src.simulator.sensor_simulator import SensorSample


class ActiveSensorSource(SensorSource):
    """
    Prioritas: primary (ESP32) -> fallback (simulator).
    """

    def __init__(self, primary: SensorSource, fallback: SensorSource):
        self._primary = primary
        self._fallback = fallback
        self.last_source: str = "SIM"

    def next(self) -> Optional[SensorSample]:
        s = self._primary.next()
        if s is not None:
            self.last_source = "ESP32"
            return s

        s2 = self._fallback.next()
        if s2 is not None:
            self.last_source = "SIM"
            return s2

        # (FUTURE CHANGE): bisa set last_source="NONE" kalau mau debugging
        return None
