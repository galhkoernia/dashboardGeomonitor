PROJECT: PROTOTYPE SISTEM EARLY WARNING GEOMONITOR
======================================================

- ![Python](https://img.shields.io/badge/python-3.10+-3670A0?style=flat-square&logo=python&logoColor=ffdd54) **Python 3.10+**
- ![PyYAML](https://img.shields.io/badge/PyYAML-config-CB171E?style=flat-square&logo=yaml&logoColor=white) **PyYAML (Config)**
- ![Standard Library](https://img.shields.io/badge/Standard%20Library-math%2C%20time%2C%20csv-3776AB?style=flat-square&logo=python&logoColor=white) **Standard Library (math, time, csv)**
- ![React](https://img.shields.io/badge/React-UI-61DAFB?style=flat-square&logo=react&logoColor=black) **React (UI)**

1. TUJUAN PROYEK
----------------
GEOMONITOR adalah sistem prototype _early warning_ berbasis sensor kemiringan _(tilt monitoring)_ yang dirancang untuk mendeteksi secara dini perubahan kemiringan struktur atau tanah yang berpotensi menjadi indikasi ketidakstabilan.

Sistem ini dirancang sebagai :
- Fondasi riset yang kuat
- Transparan dan dapat diaudit
- Deterministik _(tidak berbasis AI sebagai pengambil keputusan")_
- Modular dan siap dikembangkan menuju integrasi sensor fisik

Sistem berjalan dalam mode simulasi real-time terkontrol dan telah memiliki pipeline pemrosesan lengkap dari sensor hingga level peringatan.

---

2. RUANG LINGKUP
----------------
- Bahasa pemrograman: Python
- Mode operasi: real-time (simulasi 1 Hz atau lebih)
- Output: CLI log + file CSV (untuk analisis riset)
- Target penggunaan: Riset & eksperimen (bukan produk akhir)

---

3. KONSEP SISTEM (HIGH LEVEL)
------------------------------
Sistem **GeoMonitor** dirancang sebagai pipeline pemrosesan data yang **modular, deterministik, dan dapat dikembangkan** untuk keperluan simulasi, riset, dan evaluasi sistem monitoring pergeseran tanah.

Pipeline utama dibagi menjadi **dua jalur terpisah**:
1. **Jalur Operasional (Safety-Critical, Deterministik)**
2. **Jalur Analisis & Advisory (Non-Safety, Post-Run)**

---

### 3.1 Jalur Operasional (Runtime / Safety-Critical)

Pipeline ini berjalan **real-time / pseudo real-time** dan bertanggung jawab penuh terhadap **status keselamatan sistem**.
```
[Sensor Simulator / (Future: Real Sensor)]
         |
         v
[Signal Processing]
(Filtering, Clipping, Validation)
         |
         v
[Tilt Estimation]
(Accelerometer → Tilt Angle)
         |
         v
[Trend & Stability Analysis]
(Slope, R², Noise, Consistency)
         |
         v
[Decision Engine]
(Rule-based: NORMAL / WARNING / DANGER)
         |
         v
[CLI Log / CSV Output]
```

**Karakteristik utama:**
- Deterministik
- Tidak menggunakan AI
- Setiap keputusan dapat ditelusuri (audit trail)
- Aman untuk eksperimen dan pengujian batas sistem

---

### 3.2 Jalur Analisis & Advisory (Post-Run / Non-Safety)

Setelah eksekusi selesai, sistem menyediakan **jalur terpisah** untuk analisis lanjutan dan interpretasi berbasis data.
```
[CSV Output]
      |
      v
[Analysis Layer]
(Metrics, Error, Delay, Anomaly Evaluation)
      |
      v
[AI Assistant]
(Summary, Interpretation, Recommendation)
      |
      v
[Report / Documentation]
```
Pengembangan
Sensor Fisik (MPU6050, dll)
         ↓
Mikrokontroler / SBC
         ↓
Data ax, ay, az (REAL)
         ↓
Backend Processing (Python)
         ↓
Estimasi tilt, delta, sigma, slope
         ↓
Rule Engine (NORMAL / WARNING / DANGER)
         ↓
Snapshot Runtime
         ↓
UI (menampilkan)
```

**Karakteristik utama:**
- Tidak mempengaruhi runtime
- Tidak mengubah RuleEngine
- Bersifat advisory & evaluatif
- Cocok untuk riset dan debugging sistem

---

### 3.3 Pemisahan Tanggung Jawab (Design Boundary)

| Komponen           | Peran                     |
|--------------------|---------------------------|
| Sensor / Simulator | Sumber data mentah        | 
| Signal Processing  | Menjaga kualitas sinyal   |
| Tilt Estimation    | Transformasi fisik → sudut|
| Trend Analysis     | Deteksi pola & stabilitas |
| Decision Engine    | Keputusan keselamatan     |
| Analysis Layer     | Evaluasi performa         |
| AI Assistant       | Interpretasi & rekomendasi|

AI Assistant Tidak Boleh:
- Menghasilkan status keselamatan
- Mengubah parameter runtime
- Mengontrol Decision Engine

---

### 3.4 Prinsip Desain Sistem

1. **Deterministic Core**
   - Keputusan keselamatan selalu berbasis rule eksplisit

2. **Explainability First**
   - Semua status dapat dijelaskan dari data & threshold

3. **AI as Advisor, Not Controller**
   - AI membantu manusia, bukan menggantikan logika sistem

4. **Research-Oriented**
   - Mudah melakukan eksperimen parameter & skenario

---

4. FILOSOFI DESAIN
------------------
GEOMONITOR dibangun berdasarkan prinsip berikut :
1. Deterministik Core
   - Semua keputusan keselamatan berbasis aturan eksplisit _(rule-based)_

2. Explainability First
   Setiap status peringatan memiliki :
   - Parameter numerik yang terlampaui
   - Bukti tren yang terdeteksi
   - Alasan eksplisit yang dapat ditelusuri

3. Separation of Concerns
   Sistem dibagi menjadi dua jalur :
   1. Jalur Operasional _Safety Critical_
   2. Jalur Analisis & Advisory _Non Safety_

4. Research-Oriented
   Dirancang untuk :
   - Eksperimen parameter
   - Evaluasi akurasi & stabilitas
   - Pengujian false alarm dan detection delay

---

5. STRUKTUR FOLDER
------------------

```
dashboardGeomonitor/
│
├─ config/                         # Konfigurasi eksperimen 
│  ├─ default.yaml
│  └─ experiments/
│
├─ outputs/                        # Hasil riset & evaluasi
│  ├─ runs/                        # Output per eksekusi simulasi
│  └─ figures/                     # Grafik & visual hasil analisis
│
├─ scripts/                        # Utilitas pendukung (non-runtime)
│  └─ clean.py
│
├─ src/                            # BACKEND PYTHON 
│ │
│ ├─ app/
│ │  └─ main.py                   # Entry point runtime utama
│ │  └─ run_with_ui.py 
│ │
│ ├─ processing/                  # Pemrosesan sinyal & estimasi
│ │  ├─ filters.py                # Filtering & smoothing
│ │  ├─ tilt_estimator.py         # Estimasi sudut kemiringan
│ │  ├─ trend.py                  # Analisis tren & slope
│ │  └─ moisture_processing.py    # Moisture Soil Sensors
│ │
│ ├─ decision/                    # Mesin keputusan keselamatan
│ │  └─ rule_engine.py            # Rule-based
│ │
│ ├─ analysis/                    # Analisis pasca-eksekusi 
│ │  └─ metrics.py                # MAE, RMSE, delay, dll.
│ │
│ ├─ ai/                          # AI
│ │  ├─ assistant.py              # Interpretasi & ringkasan
│ │  ├─ prompts.py
│ │  ├─ schemas.py
│ │  ├─ report_runner.py
│ │  └─ utils.py
│ │
│ ├─ io/                          # Output & komunikasi data
│ │  ├─ state_publisher.py        # Publikasi snapshot state
│ │  └─ queue_publisher.py
│ │
│ ├─ ui/                          # UI BRIDGE 
│ │  ├─ server.py                 # FastAPI WebSocket adapter
│ │  └─ debug_server.py           # Server debug & inspeksi
│ │  └─ runtime_task.py
│ │
│ │
├─ ui/                            # FRONTEND REACT
│  ├─ README.md                   # Dokumentasi UI
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  └─ src/
│     ├─ main.jsx                 # Entry point React
│     ├─ App.jsx                  # Root application
│     │
│     ├─ pages/
│     │  └─ Dashboard.jsx         # Halaman utama observer
│     │
│     ├─ components/              # Komponen UI modular
│     │  ├─ decision/             # Indikator keputusan
│     │  │  ├─ PrimaryTiltDisplay.jsx
│     │  │  └─ index.js
│     │  ├─ diagnostic/           # UI Diagnostic
│     │  │  ├─ DiagnosticPanel.jsx
│     │  │
│     │  ├─ history/              # UI History
│     │  │  ├─ HistoryPanel.jsx
│     │  │  └─ index.js
│     │  ├─ evidence/             # Bukti visual
│     │  │  ├─ EvidencePanel.jsx
│     │  │  └─ index.js
│     │  │
│     │  ├─ stability/            # Metrik stabilitas
│     │  │  ├─ SystemContextBar.jsx
│     │  │  ├─ StabilityMetrics.jsx
│     │  │  └─ index.js
│     │  │
│     │  ├─ system/               # Konteks sistem
│     │  │  ├─ SystemContextBar.jsx
│     │  │  ├─ SystemInfoPanel.jsx # UI System
│     │  ├─ TiltChart.jsx
│     │  └─ SlopeChart.jsx
│     │  │
│     │  └─ layout/               # Kerangka & tata letak UI
│     │     ├─ MainHeader.jsx
│     │     ├─ Sidebar.jsx
│     │     ├─ SystemFooter.jsx
│     │     └─ index.js
│     │
│     ├─ data/                    # Kontrak data & mock
│     │  ├─ snapshotAccessors.js
│     │  ├─ snapshotSchema.js     # Snapshot UI ↔ backend
│     │  ├─ snapshotSource.js     # Switch mock / live source
│     │  ├─ mockSnapshots.js      # Snapshot simulasi
│     │  └─ mockChartData.js
│     │  ├─ diagnosticSchema.js   # Snapshot simulasi
│     │  └─ diagnosticSource.js
│     │
│     ├─ state/                   # State management UI
│     │  └─ useSnapshot.js
│     │  └─ useDiagnostic.js
│     │
│     ├─ transport/               # Transport layer
│     │  └─ wsClient.js           # WebSocket client
│     │
│     └─ styles/                  # Styling & design tokens
│        └─ index.css
│
├─ pyproject.toml
└─ README.md                      # Dokumentasi utama proyek
```

6. SIMULASI SENSOR
------------------
Sensor simulator menghasilkan:
- ax, ay, az (dalam satuan g)
- true_tilt (derajat, sebagai ground truth)
- event anomali (lonjakan tilt)

Komponen simulasi:
- Tilt awal
- Drift linear (deg/jam)
- Noise Gaussian
- Anomali (step change, opsional recovery)
- Dropout data (opsional)

Tujuan utama simulator adalah menyediakan data realistis untuk pengujian algoritma.

---

7. ESTIMASI KEMIRINGAN
---------------------
Estimasi tilt menggunakan asumsi quasi-static:
- Roll  = atan2(ay, az)
- Pitch = atan2(-ax, sqrt(ay^2 + az^2))

Untuk keperluan ringkasan:
- Tilt magnitude = sqrt(roll^2 + pitch^2)

Catatan:
- Metode ini valid untuk kondisi dengan percepatan dinamis kecil.
- Untuk tahap alat nyata, IMU + sensor fusion akan dipertimbangkan.

---

8. ANALISIS & KEPUTUSAN
----------------------
Analisis dilakukan menggunakan pendekatan statistik sederhana:
- Instant tilt
- Trend (slope deg/jam)
- Delta jangka pendek

Decision Engine:
- NORMAL
- WARNING
- DANGER

Setiap status harus memiliki alasan eksplisit
(misal: threshold terlampaui, tren meningkat, lonjakan cepat).

Pendekatan ini dipilih karena:
- Transparan
- Mudah diuji
- Cocok untuk sistem keselamatan

---

9. OUTPUT
---------
1. CLI log real-time
   - Tilt terfilter
   - Slope
   - Delta
   - Status + alasan

2. File CSV
   - Digunakan untuk analisis offline
   - Perhitungan MAE, RMSE, false alarm, detection delay

---

10. TEKNOLOGI
--------------
- Python 3.10+
- PyYAML (config)
- Standard library (math, time, csv)
- React (UI)

---

11. CATATAN AKHIR
-----------------
Proyek ini dirancang sebagai fondasi riset yang kuat,
bukan solusi instan.

Keputusan desain sengaja mengutamakan:
- Validitas ilmiah
- Transparansi
- Kemudahan pengembangan jangka panjang
---

12. PENGEMBANG
* Galuh Kurnia Pratama
* Mahasiswa Fisika - Universitas Negeri Surabaya

Contact :
Email    : galuh.23105@mhs.unesa.ac.id
No. HP   : +62 812-5985-3104

© 2026 — Galuh Kurnia Pratama