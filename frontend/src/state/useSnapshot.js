/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import { useState, useEffect, useRef } from 'react';
import {
  connectWebSocket,
  subscribeToSnapshot,
  disconnectWebSocket,
  WS_URL,
} from '../transport/wsClient.js';
import {
  getCurrentSnapshot,
  setLatestSnapshot,
} from '../data/snapshotSource.js';


function normalizeSnapshot(raw) {
  return {
    timestamp: raw?.timestamp ?? null,
    soil_moisture_percent:
      typeof raw?.soil_moisture_percent === "number"
      ? raw.soil_moisture_percent
      : null,
    drop_percent_per_hour:
      raw?.drop_percent_per_hour === "number"
        ? raw.drop_percent_per_hour
        : null,
    moisture_sigma:
      raw?.moisture_sigma ?? null,
    decision: {
      status: raw?.decision?.status ?? "NORMAL",
      severity: raw?.decision?.severity ?? 0.0,
      reason: raw?.decision?.reason ?? "Moisture Within Safe Range",
      reason_codes: raw?.decision?.reason_codes ?? [],
    },
  };
}

export const useSnapshot = () => {
  const [snapshot, setSnapshot] = useState(
    normalizeSnapshot(getCurrentSnapshot())
  );
  const [loading, setLoading] = useState(false);
  const connectedRef = useRef(false);

 useEffect(() => {
  if (!WS_URL) {
    const interval = setInterval(() => {
      const raw = getCurrentSnapshot();
      setSnapshot(normalizeSnapshot(raw));
    }, 1000);

    return () => clearInterval(interval);
  }

  if (connectedRef.current) return;

  connectedRef.current = true;

  connectWebSocket(WS_URL);

  const unsubscribe = subscribeToSnapshot((data) => {
    setLatestSnapshot(data);
    setSnapshot(normalizeSnapshot(data));
    setLoading(false);
  });

  return () => {
    unsubscribe();
    disconnectWebSocket();
    connectedRef.current = false;
  };
}, []);



  return { snapshot, loading };
};