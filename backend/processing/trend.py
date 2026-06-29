#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

import math
from dataclasses import dataclass
from collections import deque
from typing import Deque, Tuple


@dataclass(frozen=True)
class TrendResult:
    slope_deg_per_hour: float
    r2: float
    sigma_deg: float
    consistency: float
    slope_ok: bool


class TrendAnalyzer:
    """
    Penganalisis tren berbasis regresi linier dengan validasi statistik:
    - R² (kesesuaian)
    - sigma (lantai kebisingan)
    - penghitung konsistensi (N dari M window)
    """

    def __init__(
        self,
        window_sec: int = 600,
        min_points: int = 60,
        r2_min: float = 0.6,
        sigma_max: float = 0.05,
        consistency_n: int = 3,
        consistency_m: int = 5,
    ):
        
        self.window_sec = window_sec
        self.min_points = min_points
        self.r2_min = r2_min
        self.sigma_max = sigma_max
        self.consistency_n = consistency_n
        self.consistency_m = consistency_m


        self._slope_deg_per_hour: float = 0.0
        self._r2: float = 0.0
        self._sigma: float = 0.0
        self._is_consistent: bool = False

        self.samples: Deque[Tuple[int, float]] = deque()
        
        def update(self, t_sec: float, value_deg: float) -> TrendResult:
            self.samples.append((float(t_sec), float(value_deg)))
        self.slope_history: Deque[int] = deque(maxlen=consistency_m)

    @property
    def slope_deg_per_hour(self) -> float:
        return float(self._slope_deg_per_hour)

    @property
    def r2(self) -> float:
        return float(self._r2)

    @property
    def sigma(self) -> float:
        return float(self._sigma)

    @property
    def is_consistent(self) -> bool:
        return bool(self._is_consistent)

    def update(self, t_sec: int, value_deg: float) -> TrendResult:

        self.samples.append((t_sec, value_deg))

        while self.samples and (t_sec - self.samples[0][0]) > self.window_sec:
            self.samples.popleft()

        if len(self.samples) < self.min_points:
            self._slope_deg_per_hour = 0.0
            self._r2 = 0.0
            self._sigma = float("inf")
            self._is_consistent = False

            return TrendResult(
                slope_deg_per_hour=0.0,
                r2=0.0,
                sigma_deg=float("inf"),
                consistency=0.0,
                slope_ok=False,
            )

        ts = [t for t, _ in self.samples]
        ys = [v for _, v in self.samples]

        n = len(ts)
        t_mean = sum(ts) / n
        y_mean = sum(ys) / n

        denom = sum((t - t_mean) ** 2 for t in ts)
        if denom <= 1e-12:
            self._slope_deg_per_hour = 0.0
            self._r2 = 0.0
            self._sigma = float("inf")
            self._is_consistent = False

            return TrendResult(
                slope_deg_per_hour=0.0,
                r2=0.0,
                sigma_deg=float("inf"),
                consistency=0.0,
                slope_ok=False,
            )

        slope_per_sec = sum(
            (t - t_mean) * (y - y_mean) for t, y in zip(ts, ys)
        ) / denom

        intercept = y_mean - slope_per_sec * t_mean

        y_hat = [slope_per_sec * t + intercept for t in ts]

        residuals = [y - yh for y, yh in zip(ys, y_hat)]

        sigma = math.sqrt(sum(r * r for r in residuals) / n)

        ss_tot = sum((y - y_mean) ** 2 for y in ys)
        ss_res = sum(r * r for r in residuals)
        r2 = 0.0 if ss_tot <= 1e-12 else 1.0 - ss_res / ss_tot

        slope_deg_per_hour = slope_per_sec * 3600.0

        sign = 0
        if abs(slope_deg_per_hour) > 1e-6:
            sign = 1 if slope_deg_per_hour > 0 else -1

        if sign != 0:
            self.slope_history.append(sign)

        consistent = (
            sign != 0 and self.slope_history.count(sign) >= self.consistency_n
        )

        slope_ok = (
            r2 >= self.r2_min and sigma <= self.sigma_max and consistent
        )

        self._slope_deg_per_hour = slope_deg_per_hour
        self._r2 = r2
        self._sigma = sigma
        self._is_consistent = consistent

        return TrendResult(
            slope_deg_per_hour=slope_deg_per_hour,
            r2=r2,
            sigma_deg=sigma,
            consistency=float(self.slope_history.count(sign)),
            slope_ok=slope_ok,
        )