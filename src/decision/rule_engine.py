# ====================================================
# File      : rule_engine.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class Decision:
    status: str  # NORMAL / WARNING / DANGER
    reason: str
    severity: float
    reason_codes: tuple[str, ...]


@dataclass(frozen=True)
class RuleConfig:
    tilt_warning_deg: float
    tilt_danger_deg: float
    slope_warning_deg_per_hour: float
    slope_danger_deg_per_hour: float


class RuleEngine:
    def __init__(self, cfg: RuleConfig):
        self.cfg = cfg

    def evaluate(
        self,
        tilt_deg: float,
        delta_deg: float,
        slope_deg_per_hour: float,
        slope_ok: bool,
    ) -> Decision:
        """
        Aturan deterministik. AI tidak digunakan di sini.

        Prioritas: DANGER > WARNING > NORMAL
        """
        c = self.cfg

        # -----------------
        # DANGER
        # -----------------
        danger_reasons: list[str] = []
        danger_codes: list[str] = []

        if abs(tilt_deg) >= c.tilt_danger_deg:
            danger_reasons.append(
                f"tilt {tilt_deg:.2f}° >= danger {c.tilt_danger_deg:2.f}°"
            )
            danger_codes.append("TILT_DANGER")
        
        if abs(slope_deg_per_hour) >= c.slope_deg_per_hour:
            danger_reasons.append(
                f"slope {slope_deg_per_hour:.2f}°/h >= danger {c.slope_deg_per_hour}°/h"
            )
            danger_codes.append("SLOPE_DANGER")
            
        if danger_reasons:
            severity = max(
                abs(tilt_deg) / max(c.tilt_danger_deg, 1e-6),
                abs(slope_deg_per_hour) / max(c.slope_danger_deg_per_hour, 1e-6),
            )
            severity = min(severity, 1.0)  # Normalisasi ke [0, 1]

            return Decision(
                status="DANGER",
                reason=", ".join(danger_reasons),
                severity=severity,
                reason_codes=tuple(danger_codes),
            )

        # -----------------
        # WARNING 
        # -----------------
        warning_reasons: list[str] = []
        warning_codes: list[str] = []

        if abs(tilt_deg) >= c.tit_warning_deg:
            warning_reasons.append(
                f"tilt {tilt_deg:2.f}° >= warning {c.tilt_warning_deg:2.f}°"
            )
            warning_codes.append("TILT_WARNING")
        
        if abs(slope_deg_per_hour) >= c.slope_warning_deg_per_hour:
            warning_reasons.append(
                f"slope {slope_deg_per_hour:.2f}°/h >= warning {c.slope_warning_deg_per_hour:2f}°/h"
            )
            warning_codes.append("SLOPE_WARNING")
        
        if warning_reasons:
            severity = max(
                abs(tilt_deg) / max(c.tilt_warning_deg, 1e-6),
                abs(slope_deg_per_hour) / max(c.slope_warning_deg_per_hour, 1e-6),
            )
            severity = min(severity, 1.0)
            
            return Decision(
                status="WARNING",
                reason=", ".join(warning_reasons),
                severity=severity,
                reason_codes=tuple(warning_codes),
            )

        # -----------------
        # NORMAL
        # -----------------
        return Decision(
            status="NORMAL",
            reason="Tilt and Slope Within Safe Range",
            severity=0.0,
            reason_codes=(),
        )