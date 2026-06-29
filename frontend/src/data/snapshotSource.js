/**
 * File      : snapshotSource.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */

import { SNAPSHOT_FIELDS } from "./snapshotSchema.js";

const DEFAULT_SNAPSHOT = {
  timestamp: Date.now(),
  tilt_deg: 0,
  delta_deg: 0,
  slope_deg_per_hour: 0,

  decision: "MENUNGGU",
  status: "TERPUTUS",
  reason: "Menunggu data sensor..."
};

let currentMode = "live";

const normalizeSnapshot = (raw) => {
  const normalized = { ...DEFAULT_SNAPSHOT };

  if (!raw || typeof raw !== "object") return normalized;

  if (raw.timestamp) normalized.timestamp = raw.timestamp;

  if (typeof raw.tilt_deg === "number") normalized.tilt_deg = raw.tilt_deg;
  if (typeof raw.delta_deg === "number") normalized.delta_deg = raw.delta_deg;
  if (typeof raw.slope_deg_per_hour === "number") {
    normalized.slope_deg_per_hour = raw.slope_deg_per_hour;
  }

  if (raw.decision) normalized.decision = raw.decision;
  if (raw.status) normalized.status = raw.status;
  if (raw.reason) normalized.reason = raw.reason;

  return normalized;
};

let latest = normalizeSnapshot(null);

export const setDataSourceMode = () => {
  console.warn("Mock mode disabled. Sensor-only backend is active.");
};

export const setLatestSnapshot = (snap) => {
  latest = normalizeSnapshot(snap);
};

export const getCurrentSnapshot = () => latest;
export const getCurrentMode = () => currentMode;