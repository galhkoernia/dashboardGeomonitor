# ====================================================
# File      : filters.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

@dataclass
class EMAFilter:
    """
    Filter Rata-Rata Bergerak Eksponensial untuk sinyal skalar
    """
    alpha: float
    value: Optional[float] = None

    def reset(self) -> None:
        self.value = None

    def update(self, x: float) -> float:
        if self.value is None:
            self.value = x
            return x
        self.value = self.alpha * x + (1.0 - self.alpha) * self.value
        return self.value