/*
 * SystemInfoPanel
 * ----------------
 * Informasi umum sistem
 * Observer-only
 * Tahap pengembangan
 */

import React from "react";

const SystemInfoPanel = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Informasi Sistem
        </h2>
        <p className="text-sm text-gray-600">
          Konteks teknis dan batasan sistem pemantauan
        </p>
      </div>

      {/* System Identity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Identitas Sistem
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>Nama: Sistem Pemantauan Kemiringan Struktur</li>
          <li>Mode: Observer-only</li>
          <li>Sumber Data: Live Sensors / Simulasi</li>
          <li>Pengambilan Keputusan: Backend Deterministik</li>
        </ul>
      </div>

      {/* Architecture */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Arsitektur
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Sistem ini memisahkan proses pengukuran, analisis,
          dan pengambilan keputusan keselamatan. Antarmuka pengguna
          hanya berfungsi sebagai sarana observasi dan visualisasi data.
        </p>
      </div>

      {/* Development Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-xs text-blue-800">
          Halaman ini masih dalam tahap pengembangan dan akan
          diperluas dengan konfigurasi, metadata sensor,
          serta informasi versi sistem.
        </p>
      </div>
    </div>
  );
};

export default SystemInfoPanel;