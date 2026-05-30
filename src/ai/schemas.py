# ====================================================
# File      : schemas.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================



from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

@dataclass(frozen=True)
class AIConfig:
    enabled: bool = False
    provider: str = "none"      # "none" untuk default; setelah tersambung: "openai"
    model: str = "gpt-4.1-mii"
    report_path: str = "outputs/runs/latest_report.txt"

@dataclass(frozen=True)
class AnalysisResult:
    analysis_level: str         # Normal / Warning / Danger
    event_type: str             # None / Slow_drift / Step_anomaly / Mixed
    flags: List[str]            # Delta_spike, Extreme_Slope, Low_Trend_Quality

@dataclass(frozen=True)
class AIReport:
    title: str
    experiment: str
    summary_lines: List[str]
    analysis: AnalysisResult
    interpretation_lines: List[str]
    recommendations: List[str]
    notes: Optional[str] = None