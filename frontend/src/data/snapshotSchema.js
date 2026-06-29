/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
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