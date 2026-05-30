/**
 * File      : snapshotSchema.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */



export function getSoilMoisture(snapshot) {
  if (!snapshot) return null;
  if (typeof snapshot.soil_moisture_percent === "number")
    return snapshot.soil_moisture_percent;
  return null;
}

export function getDryingRate(snapshot) {
  if (!snapshot) return null;
  if (typeof snapshot.drop_percent_per_hour === "number")
    return snapshot.drop_percent_per_hour;
  return null;
}

export const STATUS_VALUES = {
  NORMAL: 'NORMAL',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
};

/**
 * Legacy / compatibility fields (used by snapshotSource + mocks)
 * Keep this export name to avoid breaking existing imports.
 */
export const SNAPSHOT_FIELDS = [
  't_sec',
  'tilt_est_deg',
  'tilt_filt_deg',
  'slope_deg_per_hour',
  'delta_deg',
  'r2',
  'sigma_deg',
  'consistency',
  'slope_ok',
  'status',
  'reason',
  'anomaly_active',
];

/**
 * Optional: legacy list without status/reason, if you need it later
 */
export const LEGACY_SNAPSHOT_FIELDS = [
  't_sec',
  'tilt_est_deg',
  'tilt_filt_deg',
  'r2',
  'sigma_deg',
  'consistency',
  'slope_ok',
  'anomaly_active',
];