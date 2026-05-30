/*
 * Created on Sun Dec 28 2025
 * 
 * Copyright (c) 2025 Your Company
 */

import React from "react";

const PrimaryTiltDisplay = ({
  tiltValue,
  unit = "deg",
  decision,
  timestamp,
  snapshot,
}) => {
  const statusValue = decision?.status || "NORMAL";
  const normalizedStatus =
    typeof statusValue === "string" ? statusValue.toLowerCase() : "normal";

  const statusConfig = {
    normal: {
      primary: "text-emerald-700",
      secondary: "text-emerald-500",
      bg: "bg-gradient-to-br from-emerald-50/80 to-white",
      border: "border-emerald-100",
      glow: "shadow-emerald-100/20",
      label: "Masih dalam batas aman",
      indicator:
        "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-emerald-300/30",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      progress: "from-emerald-300 via-emerald-400 to-emerald-300",
      accent: "bg-emerald-500",
      statusColor: "text-emerald-600",
    },
    warning: {
      primary: "text-amber-700",
      secondary: "text-amber-500",
      bg: "bg-gradient-to-br from-amber-50/80 to-white",
      border: "border-amber-100",
      glow: "shadow-amber-100/20",
      label: "Memerlukan Pemantauan",
      indicator:
        "bg-gradient-to-r from-amber-400 to-amber-500 shadow-amber-300/30",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      progress: "from-amber-300 via-amber-400 to-amber-300",
      accent: "bg-amber-500",
      statusColor: "text-amber-600",
    },
    danger: {
      primary: "text-rose-700",
      secondary: "text-rose-500",
      bg: "bg-gradient-to-br from-rose-50/80 to-white",
      border: "border-rose-100",
      glow: "shadow-rose-100/20",
      label: "Memerlukan Tindakan Segera",
      indicator:
        "bg-gradient-to-r from-rose-400 to-rose-500 shadow-rose-300/30 animate-pulse",
      badge: "bg-rose-50 text-rose-800 border-rose-200",
      progress: "from-rose-300 via-rose-400 to-rose-300",
      accent: "bg-rose-500",
      statusColor: "text-rose-600",
    },
  };

  const reasonIdMap = {
    "Within Thresholds": "Dalam Batas Aman",
    "Threshold Exceeded": "Melebihi Ambang Batas",
    "Rapid Change Detected": "Perubahan Cepat Terdeteksi",
    "Sensor Unstable": "Data Sensor Tidak Stabil",
  };

  const config = statusConfig[normalizedStatus] || statusConfig.normal;

  // Format value
  const hasTilt = typeof tiltValue === "number" && Number.isFinite(tiltValue);

  const formattedValue = hasTilt ? tiltValue.toFixed(3) : null;

  // Soil Moisture
  const hasMoisture =
    typeof snapshot?.soil_moisture_percent === "number"
  
  const moisture = hasMoisture
    ? snapshot.soil_moisture_percent
    : null;
  
  const drynessIndex = hasMoisture
    ? Math.max(0, Math.min(1, (50 - moisture) / 50))
    : null;

  // Rainfall
  const rainRate =
    typeof snapshot?.rain_rate_mm_per_hour === "number"
    ? snapshot.rain_rate_mm_per_hour
    : 0;
  
  const rainStatus =
    typeof snapshot?.rain_intensity === "string"
    ? snapshot.rain_intensity
    : "No Rain";

  // Split value
  const [integerPart, decimalPart] = formattedValue
    ? formattedValue.split(".")
    : ["--", "---"];

  return (
    <div
      className={`w-full rounded-xl border ${config.border} ${config.glow} shadow-xl overflow-hidden ${config.bg} backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-200/50 bg-gradient-to-r from-white to-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-6 bg-gradient-to-b from-navy-600 to-navy-400 rounded-full"></div>
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                Structure Tilt Monitoring System
              </h3>
            </div>
            <div className="flex items-center gap-3 ml-5">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision Variables
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="text-xs text-gray-500 font-mono">Real-time</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {timestamp && (
              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-500 font-medium">
                  Last Update
                </div>
                <div className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                  {timestamp}
                </div>
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg border ${config.border} ${config.badge} flex items-center gap-3 shadow-sm`}
            >
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full ${config.indicator}`}
                ></div>
              </div>
              {/* Display authoritative status */}
              <span className="text-sm font-semibold tracking-wide">
                {statusValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Digital Numbers */}
      <div className="px-6 py-8 bg-gradient-to-b from-white to-gray-50/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Display */}
          <div className="lg:col-span-2 min-w-0">
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Measurement
              </span>
              <div className="text-xs text-gray-500 mt-1">
                Active Monitoring •{" "}
                {hasTilt ? `±0.001${unit} resolusi` : "menunggu data"}
              </div>
            </div>
            <div className="flex items-baseline">
              <div className={`relative ${config.primary}`}>
                <div className="absolute -inset-4 bg-gradient-to-r from-navy-50/30 to-transparent rounded-2xl blur-xl opacity-50"></div>
                <div className="relative flex items-baseline">
                  <span className="font-[family-name:var(--font-digital)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.1em] leading-none text-navy-800">
                    {integerPart}
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-600 mx-[0.05em]">
                    .
                  </span>
                  <span className="font-[family-name:var(--font-digital)] text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.1em] leading-none text-navy-600">
                    {decimalPart}
                  </span>
                </div>
              </div>
              <span className="text-xl md:text-2xl font-medium text-navy-600 ml-3 mb-2 tracking-wide">
                {unit}
              </span>
            </div>

            {/* Measurement Scale */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Min</span>
                <span>Opt</span>
                <span>Max</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full w-2/3 bg-gradient-to-r ${config.progress} rounded-full`}
                ></div>
              </div>
            </div>
          </div>

          {/* Status Panel Soil Moisture and Rainfall */}
          <div className="w-full h-full">
            <div
              className={`rounded-xl border ${config.border} p-5 ${config.bg} shadow-sm h-full flex flex-col`}
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100 flex items-center justify-center shadow-inner">
                    <img
                      src="/assets/G-logo.png"
                      alt="Soil Moisture Logo"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Condition Evaluation
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Evaluation of Environmental Conditions
                  </p>
                </div>
              </div>

              {/* Status Text */}
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-900 leading-tight">
                  {decision?.reason
                    ? reasonIdMap[decision.reason] || decision.reason
                    : "Kelembaban Dalam Rentang Normal"}
                </p>
              </div>

              {/* Moisture Percentage Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Soil Moisture</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {typeof moisture === "number"
                      ? `${moisture.toFixed(1)}%`
                      : "0.0%"}
                  </span>
                </div>
              </div>

              {/* Rainfall Rate */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rainfall</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {`${rainRate.toFixed(1)} mm/h`}
                  </span>
                </div>
              </div>

              {/* Rain Status */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rain Status</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {rainStatus}
                  </span>
                </div>
              </div>

              {/* Dryness Indicator */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">
                    Soil Dryness Estimate
                  </span>
                  <span className="font-mono text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded tracking-wider">
                    {`${(drynessIndex * 100).toFixed(1)}%`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-red-500 rounded-full"
                      style={{
                        width: `${drynessIndex * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gradient-to-r from-navy-50/30 to-white/30 border-t border-gray-200/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${config.accent}`}></div>
              <span className="text-xs text-gray-600">
                GeoMonitor &copy; 2026 •{" "} Structure Tilt Monitoring System
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryTiltDisplay;
