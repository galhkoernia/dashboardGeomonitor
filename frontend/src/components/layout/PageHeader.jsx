/*
 * Created on Mon Jun 29 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React from "react";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pt-9 pb-5">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm sm:text-base text-gray-600">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

