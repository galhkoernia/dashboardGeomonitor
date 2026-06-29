#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations
from dataclasses import dataclass
from collections import deque
from typing import Deque, Tuple

@dataclass(frozen=True)
class MoistureResult:
    moisture_percent: float
    drop_percent_per_hour: float
    dryness_index: float
    
class MoistureProcessor:
    def __init__(self, window_sec: int = 300) -> None:
        self._history: Deque[Tuple[float, float]] = deque()
        self._window_sec = window_sec
    
    def update(self, t_sec: float, moisture: float) -> MoistureResult:
        self._history.append((t_sec, moisture))
    
        while self._history and (t_sec - self._history[0][0]) > self._window_sec:
            self._history.popleft()
            
        if len(self._history) >= 2:
            t0, m0 = self._history[0]
            dt = max(t_sec - t0, 1e-6)
            drop_per_sec = (moisture - m0) / dt
            drop_per_hour = drop_per_sec * 3600.0
        else:
            drop_per_hour = 0.0
        
        dryness = max(0.0, min(1.0, (50.0 - moisture) / 50.0))
        
        return MoistureResult(
            moisture_percent=moisture,
            drop_percent_per_hour=drop_per_hour,
            dryness_index=dryness,
        )
        