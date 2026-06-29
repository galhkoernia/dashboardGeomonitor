#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from pathlib import Path
from typing import Optional

def find_latest_csv(directory: Path) -> Optional[Path]:
    
    if not directory.exists():
        return None
    
    csv_files = list(directory.glob("*.csv"))
    if not csv_files:
        return None
    
    return max(csv_files, key=lambda p: p.stat().st_mtime)