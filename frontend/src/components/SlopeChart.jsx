/*
 * Created on Mon Feb 09 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React, { useEffect, useRef, useMemo } from "react";

const SlopeChart = ({ data, minimalMode = false }) => {
  const canvasRef = useRef(null);

  const width = 600;
  const height = 200;

  /* ----------------------------
   * Normalize backend snapshots
   * ---------------------------- */
  const processedData = useMemo(() => {
    let valid = [];

    if (Array.isArray(data)) {
      valid = data
        .filter((d) => typeof d.slope_deg_per_hour === "number")
        .map((d, i) => ({
          time: typeof d.timestamp === "number" ? d.timestamp : i,
          slope: d.slope_deg_per_hour,
        }));
    }

    return valid;
  }, [data]);

  /* ----------------------------
   * Draw chart
   * ---------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || processedData.length < 2) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    const zeroLine = height / 2;
    const warning = 0.3;
    const danger = 0.5;

    /* Background safe zone */
    ctx.fillStyle = "rgba(16,185,129,0.06)";
    ctx.fillRect(0, zeroLine - height * 0.12, width, height * 0.24);

    /* Zero line */
    ctx.strokeStyle = minimalMode
      ? "rgba(156,163,175,0.2)"
      : "rgba(156,163,175,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, zeroLine);
    ctx.lineTo(width, zeroLine);
    ctx.stroke();

    /* Scale */
    const values = processedData.map((d) => d.slope);
    const minVal = Math.min(...values, -danger);
    const maxVal = Math.max(...values, danger);

    const EPS = 0.01;
    const range = Math.max(maxVal - minVal, EPS);

    const xScale = width / (processedData.length - 1);
    const yScale = (height * 0.6) / range;
    const yOffset = (height - range * yScale) / 2;

    /* Line */
    ctx.beginPath();
    ctx.strokeStyle = minimalMode ? "#1e40af" : "#1e3a8a";
    ctx.lineWidth = minimalMode ? 2 : 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    processedData.forEach((p, i) => {
      const x = i * xScale;
      const y = height - (p.slope - minVal) * yScale - yOffset;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();

    /* Marker */
    const last = processedData[processedData.length - 1];
    const x = (processedData.length - 1) * xScale;
    const y = height - (last.slope - minVal) * yScale - yOffset;

    const abs = Math.abs(last.slope);

    const color =
      abs >= danger ? "#f43f5e" : abs >= warning ? "#f59e0b" : "#10b981";

    ctx.beginPath();
    ctx.fillStyle = `${color}33`;
    ctx.arc(x, y, minimalMode ? 4 : 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc(x, y, minimalMode ? 3 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (!minimalMode) {
      ctx.fillStyle = "#1e293b";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${last.slope.toFixed(3)}°/h`, x, y - 14);
    }
  }, [processedData, minimalMode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
};

export default SlopeChart;