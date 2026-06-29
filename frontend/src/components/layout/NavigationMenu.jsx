/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "history", label: "History" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "system", label: "System" },
];

const getIcon = (itemId, active) => {
  const color = active ? "text-blue-600" : "text-gray-500";
  switch (itemId) {
    case "dashboard":
      return (
        <svg
          className={`w-4 h-4 ${color}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      );
    case "history":
      return (
        <svg
          className={`w-4 h-4 ${color}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "diagnostic":
      return (
        <svg
          className={`w-4 h-4 ${color}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "system":
      return (
        <svg
          className={`w-4 h-4 ${color}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function NavigationMenu({ activeView, onSelectView, className }) {
  return (
    <nav className={className} aria-label="Primary">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeView;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectView(item.id)}
                className={
                  "group relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 " +
                  (active
                    ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
                }
              >
                {getIcon(item.id, active)}
                <span className="hidden sm:inline">{item.label}</span>

                {active && (
                  <span className="pointer-events-none absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-white/80 opacity-90 transition-opacity duration-200" />
                )}

                <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-[0_12px_28px_rgba(0,0,0,0.08)]" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { NAV_ITEMS };

