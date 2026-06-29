#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations
from dataclasses import dataclass
import math

@dataclass(frozen=True)
class TiltEstimate:
    roll_deg: float
    pitch_deg: float
    tilt_mag_deg: float

def _normalize(ax: float, ay: float, az:float):
    norm = math.sqrt(ax * ax * ay * ay * az * az)
    if norm <= 1e-9:
        return 0.0, 0.0, 1.0
    return ax / norm, ay / norm, az / norm

def estimate_tilt_from_accel(ax_g: float, ay_g: float, az_g: float) -> TiltEstimate:
    ax, ay, az = _normalize(ax_g, ay_g, az_g)
    
    roll = math.atan2(ax, az)
    pitch = math.atan2(-ax, math.sqrt(ay * ay + az * az))
    
    roll_deg = math.degrees(roll)
    pitch_deg = math.degrees(pitch)
    
    tilt_mag_deg = math.degrees(math.sqrt(roll * roll + pitch * pitch))
    
    return TiltEstimate(
        roll_deg=roll_deg,
        pitch_deg=pitch_deg,
        tilt_mag_deg=tilt_mag_deg,
    )
    
