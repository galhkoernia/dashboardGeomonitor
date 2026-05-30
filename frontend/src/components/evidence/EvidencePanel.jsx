/*
 * Created on Sun Dec 28 2025
 *
 * Copyright (c) 2025 Your Company
 */

import React from "react";
import TiltChart from "../TiltChart.jsx";
import SlopeChart from "../SlopeChart.jsx";

const EvidencePanel = ({ tiltData, slopeData, currentSnapshot }) => {
  const tiltValue =
    currentSnapshot && typeof currentSnapshot.tilt_deg === "number"
      ? currentSnapshot.tilt_deg
      : null;

  const slopeValue =
    currentSnapshot && typeof currentSnapshot.slope_deg_per_hour === "number"
      ? currentSnapshot.slope_deg_per_hour
      : null;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-navy-800">Monitoring</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Supporting Visual Evidence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tilt Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Slope Variations
              </h3>
              <p className="text-xs text-gray-500">
                The angle of inclination of the structure with respect to time
              </p>
            </div>

            <div className="px-3 py-1 rounded-md border border-gray-200 bg-gray-50">
              <span className="text-xs font-mono text-gray-800">
                {typeof tiltValue === "number" ? tiltValue.toFixed(3) : "---"}°
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <TiltChart data={tiltData} minimalMode={true} />
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-navy-600"></div>
              <span>Tilt Value (real-time)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Last Measurement Point</span>
            </div>
          </div>
        </div>

        {/* Slope Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Rate of Change of Slope
              </h3>
              <p className="text-xs text-gray-500">
                Angular Change Speed (deg/hour)
              </p>
            </div>

            <div className="px-3 py-1 rounded-md border border-gray-200 bg-gray-50">
              <span className="text-xs font-mono text-gray-800">
                {typeof slopeValue === "number" ? slopeValue.toFixed(3) : "---"}
                °/hour
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <SlopeChart data={slopeData} minimalMode={true} />
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-800"></div>
              <span>Rate of change (slope)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>Danger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-gradient-to-r from-navy-50 to-white border border-navy-100 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-navy-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-navy-800 mb-1">Note:</div>
            <div className="text-xs text-gray-700">
              This graph serves as supporting visual evidence. 
              Key decision-making is based on{" "}
              <span className="font-medium text-navy-700">Key Indicators</span>{" "}
              and{" "}
              <span className="font-medium text-navy-700">
                Status Indicator
              </span>
              . All data is monitored in real-time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidencePanel;
