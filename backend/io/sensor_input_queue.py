#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from threading import Lock
from typing import Deque, Optional

@dataclass(frozen=True)
class AccelPacket:
    device_id: str
    ts_sec: float
    ax_g: float
    ay_g: float
    az_g: float
    soil_moisture_percent: float

class SensorInputQueue:
    """
    - Thread-safe bounded queue (drop-oldest).
    - Cocok untuk ingestion real-time yang boleh kehilangan sample lama.
    """
    def __init__(self, maxlen: int = 256):
        self._buf: Deque[AccelPacket] = deque(maxlen=maxlen)
        self._lock = Lock()
    
    def push_drop_oldest(self, pkt: AccelPacket) -> None:
        with self._lock:
            self._buf.append(pkt)
        
    def pop_latest(self) -> Optional[AccelPacket]:
        """
        - Ambil sample terbaru dan kosongkan backlog (coalescing).
        - Ini mencegah runtime mengejar data lama.
        """
        with self._lock:
            if not self._buf:
                return None
            latest = self._buf[-1]
            self._buf.clear()
            return latest
        
    def size(self) -> int:
        with self._lock:
            return len(self._buf)
    