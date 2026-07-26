# GeoMonitor — Sistem Early Warning Pemantauan Kemiringan Real-Time

![Python](https://img.shields.io/badge/python-3.10+-3670A0?style=flat-square&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-UI-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?style=flat-square&logo=vite&logoColor=white)
![PyYAML](https://img.shields.io/badge/PyYAML-config-CB171E?style=flat-square&logo=yaml&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**GeoMonitor** adalah prototipe sistem *early warning* berbasis sensor kemiringan (*tilt monitoring*) yang dirancang untuk mendeteksi secara dini perubahan kemiringan struktur atau tanah sebagai indikasi potensi ketidakstabilan.

Sistem ini dibangun sebagai fondasi riset yang **transparan, deterministik, dan dapat diaudit** — bukan sebagai produk akhir siap pakai. Setiap keputusan status keselamatan dapat ditelusuri kembali ke parameter numerik yang menghasilkannya.

> **Status:** Research Prototype — tidak divalidasi untuk sistem keselamatan produksi.

---

## Daftar Isi

1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Struktur Proyek](#2-struktur-proyek)
3. [Pipeline Pemrosesan](#3-pipeline-pemrosesan)
4. [Mesin Keputusan](#4-mesin-keputusan)
5. [Prinsip Desain](#5-prinsip-desain)
6. [Memulai Pengembangan Lokal](#6-memulai-pengembangan-lokal)
7. [Variabel Environment](#7-variabel-environment)
8. [Deployment](#8-deployment)
9. [Ruang Lingkup & Keterbatasan Riset](#9-ruang-lingkup--keterbatasan-riset)
10. [Pengembang](#10-pengembang)
11. [Lisensi](#11-lisensi)

---

## 1. Arsitektur Sistem

### 1.1 Desain Dua Jalur

Sistem GeoMonitor memisahkan tanggung jawab ke dalam dua jalur yang sepenuhnya independen:

| Jalur | Sifat | Tujuan |
|---|---|---|
| **Jalur Operasional** | Safety-Critical, Deterministik, Real-time | Menghasilkan status keselamatan |
| **Jalur Analisis & Advisory** | Non-Safety, Post-Run | Evaluasi performa & interpretasi |

Pemisahan ini memastikan bahwa komponen analitik (termasuk AI) **tidak pernah dapat mempengaruhi keputusan keselamatan runtime**.

---

### 1.2 Diagram Alur Sistem

```
═══════════════════════════════════════════════════════════════════
  JALUR OPERASIONAL (REAL-TIME / SAFETY-CRITICAL)
═══════════════════════════════════════════════════════════════════

  [Sensor Simulator]
   ax, ay, az (g-units)
   true_tilt (ground truth)
   anomaly events
         |
         v
  [Signal Processing]          backend/processing/filters.py
   Filtering, Clipping,
   Outlier Rejection,
   Signal Validation
         |
         v
  [Tilt Estimation]            backend/processing/tilt_estimator.py
   Roll  = atan2(ay, az)
   Pitch = atan2(-ax, sqrt(ay²+az²))
   Magnitude = sqrt(roll²+pitch²)
         |
         v
  [Trend & Stability]          backend/processing/trend.py
   Slope (deg/hr), R²,
   Short-term Delta,
   Noise Level
         |
         v
  [Decision Engine]            backend/decision/rule_engine.py
   Rule-based, Deterministic
   NORMAL / WARNING / DANGER
   + Explicit Justification
         |
         v
  [State Publisher]            backend/io/state_publisher.py
   Runtime Snapshot
         |
         v
  [WebSocket Server]           backend/server/server.py
   /ws  →  Frontend
   /ws/state  →  REST poll
         |
         v
  [React Dashboard]            frontend/
   Real-time display
   Decision indicator
   Tilt chart, History,
   Evidence, Diagnostics

  [CSV Output]
   Per-run log file
   outputs/runs/

═══════════════════════════════════════════════════════════════════
  JALUR ANALISIS & ADVISORY (POST-RUN / NON-SAFETY)
═══════════════════════════════════════════════════════════════════

  [CSV Output]
         |
         v
  [Analysis Layer]             backend/analysis/metrics.py
   MAE, RMSE,
   False Alarm Rate,
   Detection Delay,
   Miss Rate
         |
         v
  [AI Advisory]                backend/ai/assistant.py
   Interpretasi hasil
   Ringkasan eksperimen
   Rekomendasi parameter
         |
         v
  [Report / Documentation]
   Output riset final
```

---

### 1.3 Tanggung Jawab Komponen

| Komponen | Modul | Peran |
|---|---|---|
| Sensor Simulator | `backend/app/` | Sumber data mentah (ax, ay, az, true_tilt) |
| Signal Processing | `backend/processing/filters.py` | Menjaga kualitas sinyal |
| Tilt Estimation | `backend/processing/tilt_estimator.py` | Transformasi akselerometer → sudut |
| Moisture Processing | `backend/processing/moisture_processing.py` | Pemrosesan sensor kelembaban tanah |
| Trend Analysis | `backend/processing/trend.py` | Deteksi pola & stabilitas |
| Decision Engine | `backend/decision/rule_engine.py` | Keputusan keselamatan (deterministik) |
| State Publisher | `backend/io/state_publisher.py` | Publikasi snapshot runtime |
| Queue Publisher | `backend/io/queue_publisher.py` | Antrian data antar komponen |
| WebSocket Server | `backend/server/server.py` | Jembatan backend ↔ frontend |
| Analysis Metrics | `backend/analysis/metrics.py` | Evaluasi performa post-run |
| AI Assistant | `backend/ai/assistant.py` | Interpretasi & rekomendasi (non-safety) |
| React Dashboard | `frontend/src/` | Visualisasi real-time |

**Batasan desain AI Assistant:**
- Tidak boleh menghasilkan status keselamatan
- Tidak boleh mengubah parameter runtime
- Tidak boleh mengontrol Decision Engine

---

## 2. Struktur Proyek

```
geomonitor/
│
├── backend/                          # Python Backend
│   │
│   ├── app/
│   │   ├── main.py                   # Entry point runtime utama
│   │   └── run_with_ui.py            # Entry point dengan UI
│   │
│   ├── processing/                   # Pipeline pemrosesan sinyal
│   │   ├── filters.py                # Filtering & smoothing
│   │   ├── tilt_estimator.py         # Estimasi sudut kemiringan
│   │   ├── trend.py                  # Analisis tren & slope
│   │   └── moisture_processing.py    # Pemrosesan sensor kelembaban
│   │
│   ├── decision/                     # Mesin keputusan keselamatan
│   │   └── rule_engine.py            # Rule-based decision engine
│   │
│   ├── analysis/                     # Analisis pasca-eksekusi
│   │   └── metrics.py                # MAE, RMSE, delay, false alarm
│   │
│   ├── ai/                           # AI Advisory Layer (non-safety)
│   │   ├── assistant.py              # Interpretasi & ringkasan
│   │   ├── prompts.py                # Template prompt AI
│   │   ├── schemas.py                # Schema output AI
│   │   ├── report_runner.py          # Orkestrasi laporan AI
│   │   └── utils.py                  # Utilitas AI
│   │
│   ├── io/                           # Output & komunikasi data
│   │   ├── state_publisher.py        # Publikasi snapshot state
│   │   └── queue_publisher.py        # Antrian data
│   │
│   ├── server/                       # WebSocket & API Server
│   │   ├── server.py                 # FastAPI + WebSocket adapter
│   │   ├── debug_server.py           # Server debug & inspeksi
│   │   └── runtime_task.py           # Task runtime async
│   │
│   ├── config/                       # Konfigurasi eksperimen
│   │   ├── default.yaml
│   │   └── experiments/
│   │
│   ├── outputs/                      # Hasil riset & evaluasi
│   │   ├── runs/                     # Output CSV per eksekusi
│   │   └── figures/                  # Grafik hasil analisis
│   │
│   ├── Procfile                      # Railway start command
│   ├── pyproject.toml
│   └── .env.example

```

---

## 3. Pipeline Pemrosesan

### Stage 1 — Sensor Simulator

Menghasilkan data sintetis yang merepresentasikan output sensor IMU nyata.

| Parameter | Deskripsi |
|---|---|
| `ax, ay, az` | Akselerasi dalam satuan g |
| `true_tilt` | Ground truth kemiringan (derajat) |
| `initial_tilt` | Kemiringan awal simulasi |
| `drift_rate` | Drift linear (deg/jam) |
| `noise_std` | Standar deviasi noise Gaussian |
| `anomaly` | Step change opsional dengan/tanpa recovery |
| `dropout` | Simulasi kehilangan sinyal |

---

### Stage 2 — Signal Processing

`backend/processing/filters.py`

- Filtering sinyal mentah (low-pass / moving average)
- Clipping nilai di luar batas fisik yang valid
- Validasi integritas sinyal (deteksi dropout)
- Output: sinyal akselerometer yang bersih dan stabil

---

### Stage 3 — Tilt Estimation

`backend/processing/tilt_estimator.py`

Estimasi sudut menggunakan asumsi quasi-static (percepatan dinamis kecil):

```
Roll  = atan2(ay, az)
Pitch = atan2(-ax, sqrt(ay² + az²))
Tilt Magnitude = sqrt(roll² + pitch²)
```

Referensi metode: Freescale Application Note AN3461.

> **Catatan:** Metode ini valid selama komponen percepatan dinamis jauh lebih kecil dari gravitasi. Untuk integrasi sensor fisik tahap lanjut, sensor fusion (complementary/Kalman filter) akan dipertimbangkan.

---

### Stage 4 — Trend & Stability Analysis

`backend/processing/trend.py`

| Metrik | Deskripsi |
|---|---|
| `slope` | Laju perubahan tilt (deg/jam), estimasi via regresi linear |
| `r_squared` | Koefisien determinasi — kekuatan tren |
| `delta` | Perubahan tilt jangka pendek |
| `noise_level` | Estimasi variance residual sinyal |

---

### Stage 5 — Decision Engine

Lihat [Bagian 4](#4-mesin-keputusan).

---

### Stage 6 — Output Operasional

**CLI Log (real-time):**

```
[TIMESTAMP] tilt=2.34° slope=0.12 deg/hr delta=0.03° status=NORMAL
```

**CSV Output** (`outputs/runs/`):

| Kolom | Deskripsi |
|---|---|
| `timestamp` | Waktu pengukuran |
| `tilt_filtered` | Tilt hasil filter |
| `true_tilt` | Ground truth |
| `slope` | Laju perubahan |
| `delta` | Delta jangka pendek |
| `status` | NORMAL / WARNING / DANGER |
| `reason` | Alasan keputusan eksplisit |

---

### Stage 7 — Analysis Layer (Post-Run)

`backend/analysis/metrics.py`

| Metrik | Formula |
|---|---|
| MAE | mean(|tilt_filtered - true_tilt|) |
| RMSE | sqrt(mean((tilt_filtered - true_tilt)²)) |
| False Alarm Rate | FP / (FP + TN) |
| Miss Rate | FN / (FN + TP) |
| Detection Delay | t_detected - t_anomaly_start |

---

### Stage 8 — AI Advisory (Post-Run, Non-Safety)

`backend/ai/`

Berjalan setelah eksekusi selesai. Membaca CSV output dan menghasilkan:
- Ringkasan performa eksperimen
- Interpretasi pola anomali
- Rekomendasi parameter untuk eksperimen berikutnya

**AI tidak memiliki akses ke runtime dan tidak dapat mengubah keputusan sistem.**

---

### Stage 9 — WebSocket Server & Frontend

`backend/server/server.py` → `frontend/src/transport/wsClient.js`

- Backend mempublikasikan snapshot runtime ke endpoint `/ws`
- Frontend subscribe melalui WebSocket (`VITE_WS_URL`)
- State diakses via `useSnapshot.js` dan `useDiagnostic.js`
- Komponen UI merender status, chart, evidence, dan history secara real-time

---

## 4. Mesin Keputusan

`backend/decision/rule_engine.py`

Decision Engine bersifat **deterministik dan rule-based**. Tidak menggunakan machine learning atau probabilistik.

### Status Output

| Status | Kondisi |
|---|---|
| `NORMAL` | Semua parameter di bawah threshold |
| `WARNING` | Satu atau lebih parameter mendekati batas kritis |
| `DANGER` | Parameter melampaui threshold bahaya |

### Prinsip Keputusan

Setiap status yang dihasilkan disertai:
- Parameter numerik yang memicu keputusan
- Threshold yang terlampaui
- Alasan eksplisit yang dapat ditelusuri (audit trail)

Contoh output reason:

```
"tilt=4.82° exceeds WARNING threshold=4.0°; slope=0.31 deg/hr (rising trend, R²=0.91)"
```

---

## 5. Prinsip Desain

### 1. Deterministic Core
Semua keputusan keselamatan berbasis aturan eksplisit. Tidak ada komponen probabilistik atau neural network pada jalur operasional. Setiap output decision engine dapat direproduksi dengan input yang sama.

### 2. Explainability First
Setiap status peringatan memiliki parameter numerik yang terlampaui, bukti tren yang terdeteksi, dan alasan eksplisit yang dapat ditelusuri. Tidak ada keputusan "black box".

### 3. AI as Advisor, Not Controller
AI Assistant beroperasi eksklusif pada jalur analisis post-run. Tidak memiliki akses ke runtime, tidak dapat mengubah parameter threshold, dan tidak dapat menghasilkan status keselamatan. AI membantu manusia memahami hasil, bukan menggantikan logika sistem.

### 4. Separation of Concerns
Jalur operasional dan jalur analisis sepenuhnya terisolasi. Kegagalan atau bug pada analisis layer tidak dapat mempengaruhi keputusan runtime. Backend dan frontend di-deploy dan dikomunikasikan secara independen melalui WebSocket.

### 5. Research-Oriented
Sistem dirancang untuk eksperimen parameter secara sistematis, evaluasi akurasi dan stabilitas algoritma, pengujian false alarm rate dan detection delay, serta reproduktibilitas eksperimen melalui konfigurasi YAML.

---

## 6. Memulai Pengembangan Lokal

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip / pipx

### Backend Setup

```bash
cd backend
pip install -e .
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`.
WebSocket tersedia di `ws://localhost:8000/ws`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

### Menjalankan Keduanya Sekaligus

Buka dua terminal terpisah dan jalankan perintah backend dan frontend masing-masing secara bersamaan.

---

## 7. Variabel Environment

### Backend (`backend/.env`)

| Variable | Default | Deskripsi |
|---|---|---|
| `PORT` | `8000` | Port server listen |
| `CORS_ORIGINS` | `*` | Origin frontend yang diizinkan |

### Frontend (`frontend/.env`)

| Variable | Default | Deskripsi |
|---|---|---|
| `VITE_WS_URL` | `ws://localhost:8000/ws` | Endpoint WebSocket backend |

---

## 8. Deployment

### Frontend → Vercel

1. Push repository ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set **Root Directory** ke `frontend/`
4. Build settings akan terdeteksi otomatis dari `vercel.json`
5. Tambahkan environment variable:
   ```
   VITE_WS_URL=wss://your-backend.railway.app/ws
   ```
6. Deploy

`frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### Backend → Railway

1. Push repository ke GitHub
2. Buat project baru di [railway.app](https://railway.app)
3. Connect ke repository, set **Root Directory** ke `backend/`
4. Railway akan mendeteksi `Procfile` secara otomatis
5. Tambahkan environment variables:
   ```
   PORT=8000
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
6. Deploy

`backend/Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 9. Ruang Lingkup & Keterbatasan Riset

| Aspek | Status |
|---|---|
| Mode operasi | Simulasi terkontrol (sensor fisik belum terintegrasi) |
| Asumsi tilt estimation | Quasi-static — tidak valid untuk getaran dinamis tinggi |
| AI Advisory | Eksperimental, belum divalidasi secara akademik |
| Validasi produksi | Belum dilakukan — tidak untuk sistem keselamatan nyata |
| Sensor fisik | MPU6050 dan sensor kelembaban direncanakan untuk tahap berikutnya |

Sistem ini dirancang sebagai **fondasi riset**, bukan solusi siap pakai. Keputusan desain mengutamakan validitas ilmiah, transparansi, dan kemudahan pengembangan jangka panjang.

---

## 10. Pengembang

**Galuh Kurnia Pratama**
Mahasiswa Fisika — Universitas Negeri Surabaya

| Kontak | |
|---|---|
| Email | galuh.23105@mhs.unesa.ac.id |
| No. HP | +62 812-5985-3104 |

---

## 11. Lisensi

© 2026 Galuh Kurnia Pratama