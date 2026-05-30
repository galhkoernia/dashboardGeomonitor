/**
 * File      : simulatedDataService.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */

import { WS_URL } from "../transport/wsClient.js";

let ws = null;
let isRunning = false;
let updateCallback = null;

/**
 * Start LIVE stream dari backend (bukan simulator)
 */
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

      // kirim snapshot real ke UI callback
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

/**
 * Stop LIVE stream
 */
export const stopSimulation = () => {
  if (ws) {
    ws.close();
    ws = null;
  }

  isRunning = false;
  updateCallback = null;
};

/**
 * Reset tidak diperlukan lagi karena tidak ada simulator
 */
export const resetSimulation = () => {
  console.warn("Reset ignored: sensor-only mode (no simulation).");
};

/**
 * Get state koneksi live stream
 */
export const getSimulationState = () => {
  return {
    isRunning,
    mode: "live-sensor"
  };
};
