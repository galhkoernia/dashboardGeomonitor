/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React, { useMemo, useState } from "react";
import NavigationMenu from "./NavigationMenu.jsx";
import NavigationActions from "./NavigationActions.jsx";
import MobileDrawer from "./MobileDrawer.jsx";

export default function FloatingNavigation({
  activeView,
  onSelectView,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoBlock = useMemo(() => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden">
          <img src="/assets/G-logo.png" alt="Geometry Logo" className="w-6 h-6 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-gray-900">GeoMonitor</div>
          <div className="text-xs text-gray-500">Dashboard History Diagnostic System</div>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className="sticky top-4 z-40">
        <div className="mx-4 lg:mx-auto lg:max-w-7xl rounded-2xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-black/5 transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-2">


            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {logoBlock}
            </div>

            <div className="hidden lg:flex flex-1 justify-center">
              <NavigationMenu activeView={activeView} onSelectView={onSelectView} />
            </div>


            <div className="hidden sm:flex items-center">
              <NavigationActions
                onSearchClick={onSearchClick}
                onNotificationsClick={onNotificationsClick}
                onProfileClick={onProfileClick}
              />
            </div>

            <div className="lg:hidden">
              <NavigationActions
                onSearchClick={onSearchClick}
                onNotificationsClick={onNotificationsClick}
                onProfileClick={onProfileClick}
              />
            </div>

          </div>
        </div>
      </div>

      {mobileOpen && (
        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          activeView={activeView}
          onSelectView={onSelectView}
        />
      )}
    </>
  );
}

