/*
 * Created on Mon Feb 09 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React, { useEffect, useRef, useMemo } from "react";

const TiltChart = ({ data, minimalMode = false }) => {
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
        .filter((d) => typeof d.tilt_deg === "number")
        .map((d, i) => ({
          time: typeof d.timestamp === "number" ? d.timestamp : i,
          tilt: d.tilt_deg,
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

    /* Grid */
    ctx.strokeStyle = minimalMode
      ? "rgba(156,163,175,0.1)"
      : "rgba(156,163,175,0.15)";
    ctx.lineWidth = 0.5;

    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    /* Center line */
    ctx.beginPath();
    ctx.strokeStyle = minimalMode
      ? "rgba(156,163,175,0.2)"
      : "rgba(156,163,175,0.3)";
    ctx.lineWidth = 1;
    ctx.moveTo(0, zeroLine);
    ctx.lineTo(width, zeroLine);
    ctx.stroke();

    /* Scale */
    const values = processedData.map((d) => d.tilt);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    const EPS = 0.001;
    const range = Math.max(maxVal - minVal, EPS);

    const xScale = width / (processedData.length - 1);
    const yScale = (height * 0.7) / range;
    const yOffset = (height - range * yScale) / 2;

    /* Line */
    ctx.beginPath();
    ctx.strokeStyle = minimalMode ? "#1e293b" : "#334155";
    ctx.lineWidth = minimalMode ? 2 : 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    processedData.forEach((p, i) => {
      const x = i * xScale;
      const y = height - (p.tilt - minVal) * yScale - yOffset;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();

    /* Marker */
    const last = processedData[processedData.length - 1];
    const x = (processedData.length - 1) * xScale;
    const y = height - (last.tilt - minVal) * yScale - yOffset;

    ctx.beginPath();
    ctx.fillStyle = "rgba(16,185,129,0.25)";
    ctx.arc(x, y, minimalMode ? 4 : 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.arc(x, y, minimalMode ? 3 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (!minimalMode) {
      ctx.fillStyle = "#1e293b";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${last.tilt.toFixed(3)}°`, x, y - 14);
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

export default TiltChart;