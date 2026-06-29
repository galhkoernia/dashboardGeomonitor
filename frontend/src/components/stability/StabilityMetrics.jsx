/*
 * Created on Sun Dec 28 2025
 *
 * Copyright (c) 2025 Your Company
 */

import React from "react";

const STATUS_MAP = {
  NORMAL: "normal",
  WARNING: "warning",
  DANGER: "danger",
};
 
const StabilityMetrics = ({ snapshot }) => {
  const status = snapshot?.decision?.status ?? snapshot?.status ?? "NORMAL";
  const statusKey = STATUS_MAP[status] || "normal";

  const statusConfig = {
    normal: {
      bg: "bg-gradient-to-br from-emerald-50/70 to-white",
      border: "border-emerald-100",
      text: "text-emerald-700",
      indicator: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-50/70 to-white",
      border: "border-amber-100",
      text: "text-amber-700",
      indicator: "bg-gradient-to-r from-amber-400 to-amber-500",
    },
    danger: {
      bg: "bg-gradient-to-br from-rose-50/70 to-white",
      border: "border-rose-100",
      text: "text-rose-700",
      indicator: "bg-gradient-to-r from-rose-400 to-rose-500",
    },
  };


  const config = statusConfig[statusKey];


  const sigma =
    snapshot && typeof snapshot.sigma_deg === "number"
      ? snapshot.sigma_deg
      : null;

  const delta =
    snapshot && typeof snapshot.delta_deg === "number"
      ? snapshot.delta_deg
      : null;

  const slope =
    snapshot && typeof snapshot.slope_deg_per_hour === "number"
      ? snapshot.slope_deg_per_hour
      : null;

  const metrics = [
    {
      key: "sigma",
      label: "SIGMA",
      value: sigma,
      unit: "deg",
      description: "Deviation of Data from the Mean Value",
    },
    {
      key: "delta",
      label: "DELTA",
      value: delta,
      unit: "deg",
      description: "Change in Tilt Angle",
    },
    {
      key: "slope",
      label: "SLOPE",
      value: slope,
      unit: "deg/h",
      description: "Rate of Change of Slope",
    },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={`rounded-xl border-2 ${config.border} ${config.bg}
            p-5 backdrop-blur-sm shadow-lg transition-all duration-300`}
        >

          <div className="mb-4 relative">
            <div className="absolute -top-1 -left-1 w-3 h-8 bg-gradient-to-b from-navy-500 to-navy-600 rounded-r-lg"></div>
            <div className="pl-4">
              <div className="text-xs font-bold text-navy-800 uppercase tracking-[0.15em]">
                {metric.label}
              </div>
              <div className="text-xs text-navy-600 font-medium mt-1">
                {metric.unit}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="font-digital text-3xl font-bold text-navy-800 tracking-[0.05em]">
              {typeof metric.value === "number"
                ? metric.value.toFixed(3)
                : "0.000"}
            </div>

            <div className="mt-3 h-1.5 w-full bg-navy-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${config.indicator}`}
                style={{
                  width:
                    typeof metric.value === "number"
                      ? `${Math.min(Math.abs(metric.value) * 50, 100)}%`
                      : "0%",
                }}
              />
            </div>
          </div>

          <div className="pt-5 border-t border-navy-100/50">
            <span
              className={`text-xs font-bold uppercase tracking-wide ${config.text}`}
            >
              {statusKey === "normal"
                ? "Stable"
                : statusKey === "warning"
                ? "Elevated"
                : "Critical"}
            </span>
            <div className="text-[10px] text-navy-600 mt-1">
              {metric.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StabilityMetrics;