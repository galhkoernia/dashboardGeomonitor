/*
 * Created on Sun Dec 28 2025
 *
 * Copyright (c) 2025 Your Company
 */

import React from "react";

const Sidebar = ({
  activeView = "dashboard",
  onSelectView,
  isMobile = false,
  isVisible = true,
  onClose,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "history", label: "History" },
    { id: "diagnostic", label: "Diagnostic" },
    { id: "system", label: "System" },
  ];

  const getIcon = (itemId) => {
    switch (itemId) {
      case "dashboard":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "history":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "diagnostic":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "system":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleMenuItemClick = (viewId) => {
    if (onSelectView) {
      onSelectView(viewId);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  const mobileClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`
    : "";

  const desktopClasses = !isMobile ? "fixed inset-y-0 left-0" : "";

  return (
    <>
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`${mobileClasses} ${desktopClasses} w-64 h-screen bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-y-auto`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(/assets/G-logo.png)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 75%",
            backgroundSize: "380px",
            opacity: 0.07,
          }}
        />

        <div className="p-5 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                <img src="/assets/G-logo.png" alt="Geometry Logo" className="w-6 h-6 object-contain" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base font-bold text-white">GeoMonitor</h1>
                <div className="text-xs text-gray-300">
                  Structure Tilt Monitoring System
                </div>
              </div>
            </div>

            {isMobile && (
              <button
                onClick={onClose}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="px-5 py-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System Context
          </h2>
        </div>

        {/* Navigation */}
        <nav className="px-2 pb-4">
          <ul className="space-y-0.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeView === item.id
                      ? "bg-blue-900/30 text-blue-300 border-l-2 border-blue-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="mr-3">{getIcon(item.id)}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;