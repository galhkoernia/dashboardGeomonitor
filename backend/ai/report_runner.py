# ====================================================
# File      : report_runner.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================



from __future__ import annotations

import json
from pathlib import Path

from analysis.metrics import summarize_run
from ai.assistant import AIAssistant
from ai.schemas import AIConfig

OUTPUT_DIR = Path("outputs/runs")
LATEST_DIAGNOSTIC = OUTPUT_DIR / "latest_diagnostic.json"

def run_diagnostic_from_csv(csv_path: Path) -> Path:
    
    if not csv_path.exists():
        raise FileNotFoundError(csv_path)
    
    summary = summarize_run(str(csv_path))
    
    ai_cfg = AIConfig(
        enabled=True,
        provider="none",
        model="analysis-only",
        report_path=""
    )
    
    assistant = AIAssistant(ai_cfg)
    report = assistant.generate_report(
        exp_name=csv_path.stem,
        summary=summary,
    )
    
    diagnostic = {
        "experiment": csv_path.stem,
        "analysis_level": report.analysis.analysis_level,
        "event_type": report.analysis.event_type,
        "flags": report.analysis.flags,
        "summary": {
            "warning_count": summary.warning_count,
            "danger_count": summary.danger_count,
            "slope_ok_true_ratio": summary.slope_ok_true_ratio,
            "max_abs_delta_deg": summary.max_abs_delta_deg,
            "max_abs_slope_deg_per_hour": summary.max_abs_slope_deg_per_hour
        },
    }
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(LATEST_DIAGNOSTIC, "w", encoding="utf-8") as f:
        json.dump(diagnostic, f, indent=2)
        
        
    print(f"AI Diagnostic written to {LATEST_DIAGNOSTIC}")
    return LATEST_DIAGNOSTIC