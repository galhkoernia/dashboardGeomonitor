/*
 * Created on Wed Dec 31 2025
 *
 * Copyright (c) 2025 Your Company
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useSnapshot } from "../state/useSnapshot.js";
import { stopSimulation } from "../services/simulatedDataService.js";
import Sidebar from "../components/layout/Sidebar.jsx";
import MainHeader from "../components/layout/MainHeader.jsx";
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

  /* ------------------ UI HANDLERS ------------------- */

  const handleSearch = () => console.log("Search clicked");
  const handleNotifications = () => console.log("Notifications clicked");
  const handleProfile = () => console.log("Profile clicked");

  const initialIsMobile = window.innerWidth < 768;

  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const [sidebarVisible, setSidebarVisible] = useState(initialIsMobile);

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarVisible(!mobile);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  /* --------------------- LIVE MODE: CONNECT WS ONCE --------------------- */
  useEffect(() => {
  setDataSourceMode("live");


  console.log("[UI] Connecting WS:", WS_URL);

  // WAJIB: buka koneksi WebSocket
  connectWebSocket(WS_URL);

  // subscribe snapshot realtime
  const unsubscribe = subscribeToSnapshot((snap) => {
    console.log("[UI] Snapshot received:", snap);

    // update snapshot global source
    setLatestSnapshot(snap);
  });

  return () => unsubscribe();
}, []);


  /* ------------------ DEMO MODE (UNCHANGED) ------------------ */

  useEffect(() => {
    const handleSimulationUpdate = (newSnapshot) => {
      setDemoSnapshot(newSnapshot);
    };
    window.simulationCallback = handleSimulationUpdate;
    return () => stopSimulation();
  }, []);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const closeSidebar = () => isMobile && setSidebarVisible(false);

  /* ------------------ HISTORY BUFFER (NEW, MINIMAL) ------------------ */

  useEffect(() => {
    if (!currentSnapshot) return;

    historyRef.current = [...historyRef.current, currentSnapshot];
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY);
    }
    setHistory([...historyRef.current]);
  }, [currentSnapshot]);

  /* ------------------ LOADING GUARD (UNCHANGED) ------------------ */

  if (!currentSnapshot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 font-sans">
          Memuat data pemantauan sistem...
        </div>
      </div>
    );
  }

  /* ------------------ TITLE & SUBTITLE ------------------- */
  const HEADER_CONFIG = {
    dashboard: {
      title: "Dashboard",
      subtiltle:
        "Pemantauan dan evaluasi geometrik kemiringan serta stabilitas struktur",
    },

    history: {
      title: "History",
      subtiltle: "Data historis kemiringan dan peristiwa",
    },

    diagnostic: {
      title: "System Diagnostic",
      subtiltle: "Analisis dan diagnostik sistem",
    },

    system: {
      title: "System",
      subtiltle: "Informasi konfigurasi dan status sistem",
    },
  };

  const header = HEADER_CONFIG[activeView] ?? HEADER_CONFIG.dashboard;

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

  function pickStatus(s) {
    const d = pickDecision(s);
    return d?.status || "NORMAL";
  }

  /* ------------------ RENDER ------------------ */

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex">
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          isMobile={isMobile}
          isVisible={sidebarVisible}
          onClose={closeSidebar}
        />

        <div className={`flex-1 ${!isMobile ? "ml-64" : ""}`}>
          <MainHeader
            title={header.title}
            subtitle={header.subtiltle}
            onMenuToggle={toggleSidebar}
            isSidebarVisible={sidebarVisible}
            status={pickStatus(currentSnapshot)}
            dataRate="1Hz"
            onSearchClick={handleSearch}
            onNotificationsClick={handleNotifications}
            onProfileClick={handleProfile}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Toggle */}
            {activeView === "dashboard" && (
              <>
                {/* Decision Layer */}
                <div className="mb-8">
                  <PrimaryTiltDisplay
                    tiltValue={pickTiltValue(currentSnapshot)}
                    decision={pickDecision(currentSnapshot)}
                    timestamp={pickTimestamp(currentSnapshot)}
                  />
                </div>

                {/* Stability Layer */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Indikator Utama
                  </h2>
                  <StabilityMetrics snapshot={currentSnapshot} />
                </div>

                {/* Evidence Layer  */}
                <div className="mb-8">
                  <EvidencePanel
                    tiltData={history}
                    slopeData={history}
                    currentSnapshot={currentSnapshot}
                  />
                </div>
              </>
            )}

            {/* History */}
            {activeView === "history" && (
              <div className="mb-8">
                <HistoryPanel />
              </div>
            )}

            {/* Diagnostic */}
            {activeView === "diagnostic" && (
              <div className="mb-8">
                <DiagnosticPanel />
              </div>
            )}

            {/* System */}
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

            <SystemFooter
              isDemoMode={isDemoMode}
              dataSource={isDemoMode ? "Simulated Sensors" : "Live Sensors"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
