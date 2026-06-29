/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws';

let ws = null;
let listeners = new Set();

let reconnectTimer = null;
let lastUrl = null;

export const connectWebSocket = (url = WS_URL) => {
  lastUrl = url;

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return ws;
  }

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("WebSocket connected to TFMS backend");

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const snapshot = JSON.parse(event.data);
      listeners.forEach((cb) => cb(snapshot));
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    ws = null;

    if (!reconnectTimer && lastUrl) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket(lastUrl);
      }, 1000); // reconnect tiap 1 detik
    }
  };

  return ws;
};

export const subscribeToSnapshot = (callback) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

export const disconnectWebSocket = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (ws) {
    ws.close();
    ws = null;
  }

  listeners.clear();
};