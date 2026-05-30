# ====================================================
# File      : csv_logger.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================


import csv
import os
import time

class CSVLogger:
    def __init__(self, filepath: str):
        self.filepath = filepath
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        if not os.path.exists(filepath):
            with open(filepath, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp",
                    "tilt_deg",
                    "delta_deg",
                    "sigma_deg",
                    "slope_deg_per_hour",
                    "status",
                    "severity",
                    "reason"
                ])

    def append(self, snapshot):
        with open(self.filepath, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                time.time(),
                snapshot["tilt_deg"],
                snapshot["delta_deg"],
                snapshot["sigma_deg"],
                snapshot["slope_deg_per_hour"],
                snapshot["decision"]["status"],
                snapshot["decision"]["severity"],
                snapshot["decision"]["reason"]
            ])
