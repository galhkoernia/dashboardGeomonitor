/**
 * File      : snapshotAccessors.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */

export function getTilt(snapshot) {
    if (!snapshot) return null;
    if (typeof snapshot.tilt_deg === "number") return snapshot.tilt_deg;
    if (typeof snapshot.tilt_filt_deg === "number") return snapshot.tilt_filt_deg;
    if (typeof snapshot.tilt_est_deg === "number") return snapshot.tilt_est_deg;
    return null;
}

export function getDelta(snapshot) {
    if (!snapshot) return null;
    if (typeof snapshot.delta_deg === "number") return snapshot.delta_deg;
    if (typeof snapshot.delta_tilt_deg === "number") return snapshot.delta_tilt_deg;
    return null;
}

export function getSigma(snapshot) {
    if (!snapshot) return null;
    if (typeof snapshot.sigma_deg === "number") return snapshot.sigma_deg;
    return null;
}

export function getSlope(snapshot) {
    if (!snapshot) return null;
    if (typeof snapshot.slope_deg_per_hour === "number")
        return snapshot.slope_deg_per_hour;
    return null;
}

export function getTime(snapshot, index = 0) {
    if (!snapshot) return index;

    if (typeof snapshot.t_sec === "number") {
        return snapshot.t_sec;
    }

    if (typeof snapshot.timestamp === "string") {
        return index;
    }
    
    return index;
}

