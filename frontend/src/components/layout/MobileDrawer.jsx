/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React, { useEffect } from "react";
import NavigationMenu from "./NavigationMenu.jsx";

export default function MobileDrawer({
  open,
  onClose,
  activeView,
  onSelectView,
}) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>

      <div
        className={
          "fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
      />

      <aside
        className={
          "fixed left-4 top-16 z-50 w-72 max-w-[calc(100vw-2rem)] " +
          "rounded-3xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.18)] " +
          "ring-1 ring-black/5 backdrop-blur-sm " +
          "transform transition-transform duration-250 ease-out " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              <img src="/assets/G-logo.png" alt="Geometry Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">GeoMonitor</div>
              <div className="text-xs text-gray-500">Structure Tilt Monitoring System</div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <NavigationMenu
            activeView={activeView}
            onSelectView={(id) => {
              onSelectView?.(id);
              onClose?.();
            }}
            className="w-full"
          />
        </div>
      </aside>
    </>
  );
}

