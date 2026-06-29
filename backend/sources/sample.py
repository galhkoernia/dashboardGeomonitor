#
# Created on Tue Feb 10 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SensorSample:
    """
    Authoritative runtime sensor sample contract.

    Semua source (simulator, ESP32 ingestion, replay CSV)
    HARUS menghasilkan struktur ini.
    """

    t_sec: float

    ax_g: float
    ay_g: float
    az_g: float

    true_tilt_deg: float = 0.0
    anomaly_active: bool = False
