/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React from "react";

export default function NavigationActions({ onSearchClick, onNotificationsClick, onProfileClick }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSearchClick}
        className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onNotificationsClick}
        className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
          3
        </span>
      </button>

      <button
        type="button"
        onClick={onProfileClick}
        className="p-1 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        aria-label="Profile"
      >
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.25)]">
          <img
            src="assets/galuh-kurnia.png"
            onError={(e) => {
              e.currentTarget.src = "/default.png";
            }}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </button>
    </div>
  );
}

