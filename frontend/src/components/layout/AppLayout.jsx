/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React from "react";
import FloatingNavigation from "./FloatingNavigation.jsx";
import PageHeader from "./PageHeader.jsx";

export default function AppLayout({
  activeView,
  onSelectView,
  header,
  children,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  footer,
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <FloatingNavigation
        activeView={activeView}
        onSelectView={onSelectView}
        onSearchClick={onSearchClick}
        onNotificationsClick={onNotificationsClick}
        onProfileClick={onProfileClick}
      />

      <div className="mt-8">
        <PageHeader title={header?.title} subtitle={header?.subtitle} />
      </div>

      <main className="pb-10">{children}</main>
      
      {footer}
    </div>
  );
}

