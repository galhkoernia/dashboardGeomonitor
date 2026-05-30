# ====================================================
# File      : main.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from __future__ import annotations

import sys
import csv
import os
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional

import yaml
import math

from src.processing.filters import EMAFilter
from src.processing.tilt_estimator import estimate_tilt_from_accel
from src.processing.trend import TrendAnalyzer
from src.processing.moisture_processing import MoistureProcessor
from src.decision.rule_engine import RuleConfig, RuleEngine
from src.io.state_publisher import StatePublisher
from src.io.sensor_input_queue import SensorInputQueue

from src.sources.base import SensorSource
from src.sources.esp32_queue_source import Esp32QueueSource


# =========================
# Integrasi AI Report
from src.ai.assistant import parse_ai_config

# =========================
# Config models
# =========================

@dataclass
class RuntimeConfig:
    sample_hz: int
    duration_sec: int
    seed: int
    enable_plot: bool
    mode: str = "sim"


@dataclass
class OutputConfig:
    save_csv: bool
    csv_path: str
    print_every_n: int


# =========================
# Utilities
# =========================

def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def ensure_parent_dir(filepath: str) -> None:
    parent = os.path.dirname(filepath)
    if parent:
        os.makedirs(parent, exist_ok=True)


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))

# =========================
# Helper Safety
# =========================
def safe_float(x: float) -> float:
    if x is None:
        return 0.0
    if math.isnan(x) or math.isinf(x):
        return 0.0
    return float(x)

# =========================
# Normalize accel vector
# =========================
def normalize_accel(ax: float, ay: float, az: float) -> tuple[float, float, float]:
    """
    Normalisasi vektor akselerometer sehingga magnitudinya menjadi ~1g.
    """
    norm = math.sqrt(ax * ax + ay * ay + az * az)
    if norm <= 1e-6:
        return 0.0, 0.0, 1.0
    return ax / norm, ay / norm, az / norm

# =========================
# Runtime Loop (Callable)
# =========================

def run_runtime_loop(
    cfg_path: str,
    publisher: Optional[StatePublisher] = None,
    ingest_queue: Optional["SensorInputQueue"] = None,
    run_forever: bool = False,
) -> None:
    """
    Runtime loop

    Fungsi ini identik dengan implementasi main() sebelumnya,
    namun diekstrak agar dapat dipanggil dari:
    - CLI (publisher=None)
    - FastAPI background task (publisher aktif)

    Runtime tetap deterministik dan blocking.
    """

    # ---------------------------------
    # CONFIG LOADING
    # ---------------------------------
    cfg = load_config(cfg_path)

    rt = RuntimeConfig(**cfg["runtime"])
    out = OutputConfig(**cfg["output"])

    # ---------------------------------
    # SENSOR ONLY MODE
    # ---------------------------------

    if ingest_queue is None:
        raise RuntimeError(
            "Mode sensor saja memerlukan ingest_queue (input ESP32)."
        )

    source: SensorSource = Esp32QueueSource(ingest_queue)
    print("[runtime] Sensor source: ESP32 Only")

    # ---------------------------------
    # Processing
    # ---------------------------------
    ema_alpha = float(cfg["processing"]["ema_alpha"])
    outlier_clip_g = float(cfg["processing"]["outlier_clip_g"])

    ema_tilt = EMAFilter(alpha=ema_alpha)
    ema_roll = EMAFilter(alpha=ema_alpha)

    # ---------------------------------
    # Trend
    # ---------------------------------
    trend_cfg = cfg.get("trend", {})

    trend = TrendAnalyzer(
        window_sec=int(trend_cfg.get("window_sec", 600)),
        min_points=int(trend_cfg.get("min_points", 60)),
        r2_min=float(trend_cfg.get("r2_min", 0.6)),
        sigma_max=float(trend_cfg.get("sigma_max", 0.05)),
        consistency_n=int(trend_cfg.get("consistency_n", 3)),
        consistency_m=int(trend_cfg.get("consistency_m", 5)),
    )

    # ---------------------------------
    # Decision
    # ---------------------------------
    dec_cfg = RuleConfig(**cfg["decision"])
    engine = RuleEngine(dec_cfg)

    # ---------------------------------
    # Delta window
    # ---------------------------------
    delta_window_sec = 30
    delta_min_points = 10
    delta_window: list[tuple[float, float]] = []
    
    # ---------------------------------
    # Moisture
    # ---------------------------------
    moisture_proc = MoistureProcessor()

    # ---------------------------------
    # CSV
    # ---------------------------------
    writer: Optional[csv.DictWriter] = None
    csv_file = None

    if out.save_csv:
        ensure_parent_dir(out.csv_path)
        csv_file = open(out.csv_path, "w", newline="", encoding="utf-8")
        writer = csv.DictWriter(
            csv_file,
            fieldnames=[
                "t_sec",
                "tilt_est_deg",
                "tilt_filt_deg",
                "slope_deg_per_hour",
                "delta_deg",
                "r2",
                "sigma_deg",
                "consistency",
                "slope_ok",
                "status",
                "reason",
                "anomaly_active",
            ],
        )
        writer.writeheader()

    # ---------------------------------
    # Loop
    # ---------------------------------
    sample_period = 1.0 / max(rt.sample_hz, 1)
    start_time = time.monotonic()
    last_print_t = -1

    warmup_sec = 60

    infinite = bool(run_forever) or int(rt.duration_sec) == 0
    max_ticks = None if infinite else int(rt.duration_sec * rt.sample_hz)
    
    try:
        tick = 0

        while True:
            # Stop condition hanya berlaku kalau tidak infinite
            if (max_ticks is not None) and (tick >= max_ticks):
                break

            loop_target = start_time + tick * sample_period

            sample = source.next()
            if sample is None:
                if tick % 50 == 0:
                    print("[Runtime] no sample (queue empty)")
                tick += 1
                now = time.monotonic()
                if now < loop_target:
                    time.sleep(loop_target - now)
                continue

            if tick % 10 == 0:
                print(
                    f"[Runtime] sample ax={sample.ax_g:.4f} ay={sample.ay_g:.4f} az={sample.az_g:.4f}"
                )

            t_sec = tick / max(rt.sample_hz, 1)

            # Raw accel from ESP32 (m/s²)
            ax_raw = float(sample.ax_g)
            ay_raw = float(sample.ay_g)
            az_raw = float(sample.az_g)
            
            # Normalize
            G = 9.80665
            ax_g = ax_raw / G
            ay_g = ay_raw / G
            az_g = az_raw / G

            # Tilt estimation
            est = estimate_tilt_from_accel(ax_g, ay_g, az_g)

            tilt_est = est.tilt_mag_deg
            tilt_filt = ema_tilt.update(tilt_est)


            # ---------------------------------
            # Delta window 
            # ---------------------------------
            delta_window.append((float(t_sec), float(tilt_filt)))

            # Buang sampel lama
            while delta_window and (float(t_sec) - float(delta_window[0][0])) > float(delta_window_sec):
                delta_window.pop(0)

            # Hitung delta
            if len(delta_window) >= int(delta_min_points):
                oldest_t, oldest_val = delta_window[0]
                delta = float(tilt_filt) - float(oldest_val)
            else:
                delta = 0.0

            trend_res = trend.update(float(t_sec), float(tilt_filt))

            slope = safe_float(trend_res.slope_deg_per_hour)
            r2 = safe_float(trend_res.r2)
            sigma = safe_float(trend_res.sigma_deg)
            consistency = safe_float(trend_res.consistency)
            slope_ok = bool(trend_res.slope_ok)

            decision = engine.evaluate(
                safe_float(tilt_filt),
                safe_float(delta),
                safe_float(slope),
                slope_ok,
            )
            
            # Dummy (diganti dengan sensor real nanti)
            soil_moisture_raw = 45.0
            
            moisture_res = moisture_proc.update(t_sec, soil_moisture_raw)
            
            soil_moisture = moisture_res.moisture_percent
            drop_percent_per_hour = moisture_res.drop_percent_per_hour
            dryness_index = moisture_res.dryness_index
            
            rain_rate_mm_per_hour = 0.0
            rain_intensity = "No_Rain"
            

            # Perbaikan Snapshot
            snapshot = {
                "timestamp": time.strftim("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                
                # Tilt 
                "tilt_deg": safe_float(tilt_filt),
                "delta_deg": safe_float(delta),
                "slope_deg_per_hour": safe_float(slope),
                "sigma_deg": safe_float(sigma),
                
                # Moisture
                "soil_moisture_percent": soil_moisture,
                "drop_percent_per_hour": drop_percent_per_hour,
                "moisture_dryness_index": dryness_index,
                
                # Rain
                "rain_rate_mm_per_hour": rain_rate_mm_per_hour,
                "rain_intensity": rain_intensity,
                
                # Decision
                "decision": {
                    "status": decision.status,
                    "severity": safe_float(decision.severity),
                    "reason": decision.reason,
                    "reason_codes": list(decision.reason_codes),
                },
            }

            if publisher is not None:
                publisher.publish(snapshot)


            # ---------------------------------
            # CSV write
            # ---------------------------------
            if writer is not None:
                writer.writerow(
                    {
                        "t_sec": float(t_sec),
                        "tilt_est_deg": float(tilt_est),
                        "tilt_filt_deg": float(tilt_filt),
                        "slope_deg_per_hour": float(slope),
                        "delta_deg": float(delta),
                        "r2": safe_float(r2),
                        "sigma_deg": safe_float(sigma), 
                        "consistency": int(consistency),
                        "slope_ok": bool(slope_ok),
                        "status": decision.status,
                        "reason": decision.reason,
                        "anomaly_active": bool(getattr(sample, "anomaly_active", False)),
                    }
                )

            if (tick - last_print_t) >= out.print_every_n:
                src_name = getattr(source, "last_source", "SIM")
                print(
                    f"[t={int(t_sec):05d}] SRC={src_name} "
                    f"tilt_f={tilt_filt:6.3f}° slope={slope:7.3f}°/h "
                    f"sig={sigma:6.3f} status={decision.status}"
                )
                last_print_t = tick

            tick += 1

            now = time.monotonic()
            if now < loop_target:
                time.sleep(loop_target - now)

    finally:
        print("> Finally Block Entered")
