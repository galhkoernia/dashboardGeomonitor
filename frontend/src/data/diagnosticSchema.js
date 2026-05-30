/**
 * File      : diagnosticSchema.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */

export const DIAGNOSTIC_DEFAULT = {
    experiment: null,
    analysis_level: null,
    event_type: null,
    flags: [],
    summary: {
        warning_count: null,
        danger_count: null,
        max_abs_delta_deg: null,
        max_abs_slope_deg_per_hour: null,
    }
}