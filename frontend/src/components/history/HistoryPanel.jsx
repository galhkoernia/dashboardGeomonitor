/*
 * Created on Thu Feb 26 2026
 *
 * Copyright (c) 2026 Your Company
 */

import React from "react";

const HistoryPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Riwayat Data Sistem
        </h2>
        <p className="text-sm text-gray-600">
          Rekaman historis pengukuran dan peristiwa
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Data Historis
          </span>
          <span className="text-xs text-gray-400">Observer-only</span>
        </div>

        <div className="text-sm text-gray-500 italic py-10 text-center">
          Riwayat data akan ditampilkan pada tahap pengembangan selanjutnya.
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-amber-800">
          Catatan: Tampilan ini bersifat informatif dan tidak digunakan sebagai
          dasar pengambilan keputusan keselamatan.
        </p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-xs text-blue-800">
          Halaman ini masih dalam tahap pengembangan dan akan diperluas dengan
          konfigurasi, metadata sensor, serta informasi versi sistem.
        </p>
      </div>
    </div>
  );
};

export default HistoryPanel;
