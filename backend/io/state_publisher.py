#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from abc import ABC, abstractmethod
from typing import TypedDict, List


class DecisionSnapshot(TypedDict):
    status: str
    severity: float
    reason: str
    reason_codes: List[str]


class RuntimeSnapshot(TypedDict):
    timestamp: str
    
    # Tilt
    tilt_deg: float
    delta_deg: float
    slope_deg_per_hour: float
    sigma_deg: float
    
    # Moisture
    soil_moisture_percent: float
    drop_percent_per_hour: float
    moisture_dryness_index: float
    
    # Rain
    rain_rate_mm_per_hour: float
    rain_intensity: str
    
    decision: DecisionSnapshot


class StatePublisher(ABC):
    """
    Kelas dasar abstrak untuk mempublikasikan snapshot status runtime.

    Boundary ketat antara runtime safety-critical
    dan observer eksternal (UI, logger, transport).
    """

    @abstractmethod
    def publish(self, snapshot: RuntimeSnapshot) -> None:
        """
        Publikasikan satu snapshot runtime.

        Snapshot harus:
        - Read-only
        - JSON-serializable
        - Tidak memblokir runtime
        """
        ...