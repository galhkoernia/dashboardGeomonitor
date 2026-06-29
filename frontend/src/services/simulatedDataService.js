/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import { WS_URL } from "../transport/wsClient.js";

let ws = null;
let isRunning = false;
let updateCallback = null;

export const startSimulation = (callback) => {
  if (isRunning) return;

  updateCallback = callback;
  isRunning = true;


  console.log("🔌 Connecting to backend WS:", WS_URL);

  ws = new WebSocket(WS_URL);
  
  ws.onopen = () => {
    console.log("Live Sensor WebSocket connected");
  };

  ws.onmessage = (event) => {
    try {
      const snapshot = JSON.parse(event.data);

      if (updateCallback) {
        updateCallback({
          ...snapshot,
          source: "sensor-backend"
        });
      }
    } catch (err) {
      console.error("Invalid snapshot JSON:", err);
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  ws.onclose = () => {
    console.warn("WebSocket closed (sensor stream stopped)");
    isRunning = false;
  };
};

export const stopSimulation = () => {
  if (ws) {
    ws.close();
    ws = null;
  }

  isRunning = false;
  updateCallback = null;
};

export const resetSimulation = () => {
  console.warn("Reset ignored: sensor-only mode (no simulation).");
};

export const getSimulationState = () => {
  return {
    isRunning,
    mode: "live-sensor"
  };
};
