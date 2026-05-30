#
# Created on Mon Jan 12 2026
#
# Copyright (c) 2026 Your Company
#

from abc import ABC, abstractmethod
from src.sources.sample import SensorSample
from typing import Optional


class SensorSource(ABC):
    """
    Docstring for SensorSource
    """
    
    @abstractmethod
    def next(self) -> Optional[SensorSample]:
        """
        Docstring for next
        
        :param self: Description
        :return: Description
        :rtype: SensorSample | None
        """