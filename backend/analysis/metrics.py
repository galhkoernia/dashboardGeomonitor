# ====================================================
# File      : metrics.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from __future__ import annotations

import csv
import math
from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class RunSummary:
    n_rows: int
    duration_sec: int
    rmse_tilt_deg: float
    max_abs_delta_deg: float
    max_abs_slope_deg_per_hour: float
    warning_count: int
    danger_count: int
    first_warning_t: Optional[int]
    first_danger_t: Optional[int]
    avg_r2: float
    avg_sigma: float
    slope_ok_true_ratio: float


def _safe_float(x: str, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default


def _safe_int(x: str, default: int = 0) -> int:
    try:
        return int(float(x))
    except Exception:
        return default


def load_csv_rows(path: str, max_rows: Optional[int] = None) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            rows.append(row)
            if max_rows is not None and (i + 1) >= max_rows:
                break
    return rows


def summarize_run(csv_path: str) -> RunSummary:
    rows = load_csv_rows(csv_path)
    if not rows:
        return RunSummary(
            n_rows=0,
            duration_sec=0,
            rmse_tilt_deg=float("nan"),
            max_abs_delta_deg=0.0,
            max_abs_slope_deg_per_hour=0.0,
            warning_count=0,
            danger_count=0,
            first_warning_t=None,
            first_danger_t=None,
            avg_r2=0.0,
            avg_sigma=0.0,
            slope_ok_true_ratio=0.0,
        )

    n = len(rows)

    # time
    t_last = _safe_int(rows[-1].get("t_sec", "0"))
    duration = t_last

    # RMSE between tilt_filt_deg and true_tilt_deg (if present)
    se_sum = 0.0
    se_n = 0

    max_abs_delta = 0.0
    max_abs_slope = 0.0

    warning_count = 0
    danger_count = 0
    first_warning_t = None
    first_danger_t = None

    r2_sum = 0.0
    sigma_sum = 0.0
    diag_n = 0

    slope_ok_true = 0
    slope_ok_n = 0

    for row in rows:
        t = _safe_int(row.get("t_sec", "0"))

        true_tilt = _safe_float(row.get("true_tilt_deg", "nan"), float("nan"))
        tilt_filt = _safe_float(row.get("tilt_filt_deg", "nan"), float("nan"))
        if not math.isnan(true_tilt) and not math.isnan(tilt_filt):
            se_sum += (tilt_filt - true_tilt) ** 2
            se_n += 1

        delta = _safe_float(row.get("delta_deg", "0.0"))
        slope = _safe_float(row.get("slope_deg_per_hour", "0.0"))
        max_abs_delta = max(max_abs_delta, abs(delta))
        max_abs_slope = max(max_abs_slope, abs(slope))

        status = (row.get("status", "") or "").upper().strip()
        if status == "WARNING":
            warning_count += 1
            if first_warning_t is None:
                first_warning_t = t
        elif status == "DANGER":
            danger_count += 1
            if first_danger_t is None:
                first_danger_t = t

        if "r2" in row and "sigma" in row:
            r2_sum += _safe_float(row.get("r2", "0.0"))
            sigma_sum += _safe_float(row.get("sigma", "0.0"))
            diag_n += 1

        if "slope_ok" in row:
            slope_ok_n += 1
            if (row.get("slope_ok", "") or "").strip() in ("1", "true", "True", "TRUE"):
                slope_ok_true += 1

    rmse = math.sqrt(se_sum / max(se_n, 1)) if se_n > 0 else float("nan")
    avg_r2 = (r2_sum / diag_n) if diag_n > 0 else 0.0
    avg_sigma = (sigma_sum / diag_n) if diag_n > 0 else 0.0
    slope_ok_ratio = (slope_ok_true / slope_ok_n) if slope_ok_n > 0 else 0.0

    return RunSummary(
        n_rows=n,
        duration_sec=duration,
        rmse_tilt_deg=rmse,
        max_abs_delta_deg=max_abs_delta,
        max_abs_slope_deg_per_hour=max_abs_slope,
        warning_count=warning_count,
        danger_count=danger_count,
        first_warning_t=first_warning_t,
        first_danger_t=first_danger_t,
        avg_r2=avg_r2,
        avg_sigma=avg_sigma,
        slope_ok_true_ratio=slope_ok_ratio,
    )
