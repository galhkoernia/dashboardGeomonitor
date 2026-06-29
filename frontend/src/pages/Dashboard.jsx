/*
 * Created on Wed Dec 31 2025
 *
 * Copyright (c) 2025 Your Company
 */

import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "../state/useSnapshot.js";
import { stopSimulation } from "../services/simulatedDataService.js";
import AppLayout from "../components/layout/AppLayout.jsx";
import PrimaryTiltDisplay from "../components/decision/PrimaryTiltDisplay.jsx";
import StabilityMetrics from "../components/stability/StabilityMetrics.jsx";
import EvidencePanel from "../components/evidence/EvidencePanel.jsx";
import SystemFooter from "../components/layout/SystemFooter.jsx";
import DiagnosticPanel from "../components/diagnostic/DiagnosticPanel.jsx";
import HistoryPanel from "../components/history/HistoryPanel.jsx";
import SystemInfoPanel from "../components/system/SystemInfoPanel.jsx";
import {
  connectWebSocket,
  subscribeToSnapshot,
  WS_URL,
} from "../transport/wsClient.js";
import {
  setLatestSnapshot,
  setDataSourceMode,
} from "../data/snapshotSource.js";

const MAX_HISTORY = 120; // 2 menit @1Hz

const Dashboard = () => {
  const { snapshot: liveSnapshot } = useSnapshot();

  const [activeView, setActiveView] = useState("dashboard");
  const [isDemoMode] = useState(false);
  const [demoSnapshot, setDemoSnapshot] = useState(liveSnapshot);

  const historyRef = useRef([]);
  const [history, setHistory] = useState([]);

  const currentSnapshot = isDemoMode ? demoSnapshot : liveSnapshot;

  const handleSearch = () => console.log("Search clicked");
  const handleNotifications = () => console.log("Notifications clicked");
  const handleProfile = () => console.log("Profile clicked");

  useEffect(() => {
    setDataSourceMode("live");

    console.log("[UI] Connecting WS:", WS_URL);


  connectWebSocket(WS_URL);

  const unsubscribe = subscribeToSnapshot((snap) => {
    console.log("[UI] Snapshot received:", snap);

    setLatestSnapshot(snap);
  });

  return () => unsubscribe();
}, []);


  useEffect(() => {
    const handleSimulationUpdate = (newSnapshot) => {
      setDemoSnapshot(newSnapshot);
    };
    window.simulationCallback = handleSimulationUpdate;
    return () => stopSimulation();
  }, []);

  useEffect(() => {
    if (!currentSnapshot) return;

    historyRef.current = [...historyRef.current, currentSnapshot];
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY);
    }
    setHistory([...historyRef.current]);
  }, [currentSnapshot]);


  if (!currentSnapshot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 font-sans">
          Memuat data pemantauan sistem...
        </div>
      </div>
    );
  }

  function pickTiltValue(s) {
    if (!s) return null;
    if (typeof s.tilt_deg === "number") return s.tilt_deg; // schema baru
    if (typeof s.tilt_filt_deg === "number") return s.tilt_filt_deg; // legacy
    if (typeof s.tilt_est_deg === "number") return s.tilt_est_deg; // legacy
    return null;
  }

  function pickTimestamp(s) {
    if (!s) return null;
    if (typeof s.timestamp === "string") return s.timestamp; // schema baru
    if (typeof s.t_sec === "number") return `t=${s.t_sec.toFixed(0)}s`; // legacy
    return null;
  }

  function pickDecision(s) {
    if (!s) return null;
    if (s.decision) return s.decision;
    return {
      status: s.status || "NORMAL",
      severity: 0.0,
      reason: s.reason || "within thresholds",
      reason_codes: [],
    };
  }

  return (
    <AppLayout
      activeView={activeView}
      onSelectView={setActiveView}
      onSearchClick={handleSearch}
      onNotificationsClick={handleNotifications}
      onProfileClick={handleProfile}
      footer={
        <SystemFooter
          isDemoMode={isDemoMode}
          dataSource={isDemoMode ? "Simulated Sensors" : "Live Sensors"}
        />
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {activeView === "dashboard" && (

              <>
                <div className="mb-8">
                  <PrimaryTiltDisplay
                    tiltValue={pickTiltValue(currentSnapshot)}
                    decision={pickDecision(currentSnapshot)}
                    timestamp={pickTimestamp(currentSnapshot)}
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Indikator Utama
                  </h2>
                  <StabilityMetrics snapshot={currentSnapshot} />
                </div>

                <div className="mb-8">
                  <EvidencePanel
                    tiltData={history}
                    slopeData={history}
                    currentSnapshot={currentSnapshot}
                  />
                </div>
              </>
            )}

            {activeView === "history" && (
              <div className="mb-8">
                <HistoryPanel />
              </div>
            )}
            
            {activeView === "diagnostic" && (
              <div className="mb-8">
                <DiagnosticPanel />
              </div>
            )}

            {activeView === "system" && (
              <div className="mb-8">
                <SystemInfoPanel />
              </div>
            )}

            {!["dashboard", "diagnostic", "history", "system"].includes(
              activeView
            ) && (
              <div className="text-gray-600">
                Tampilan belum diimplementasikan
              </div>
            )}

          </div>
    </AppLayout>
  );
};

export default Dashboard;
