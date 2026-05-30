# BACKEND: GEOMONITOR CORE (Python)

**Prototype Sistem Early Warning Geomonitor**

Backend ini adalah jantung dari sistem GEOMONITOR, sebuah mesin pemrosesan deterministik yang bertanggung jawab atas pengolahan sinyal sensor, estimasi kemiringan, hingga pengambilan keputusan keselamatan secara *real-time*.

---

## 1. ARSITEKTUR BACKEND (PIPELINE)

Backend bekerja dalam alur kerja linier untuk menjamin transparansi data:

1. **Ingestion:** Menerima data mentah (akselerasi $a_x, a_y, a_z$) dari simulator atau sensor fisik.
2. **Processing:** Melakukan pembersihan data menggunakan filter digital.
3. **Estimation:** Mengonversi data percepatan menjadi sudut kemiringan (tilt).
4. **Inference (Rule Engine):** Menentukan status keselamatan berdasarkan ambang batas (*threshold*) yang ditentukan di konfigurasi.
5. **Distribution:** Mengirimkan *state snapshot* ke UI melalui WebSocket dan mencatatnya ke CSV.

---

## 2. KOMPONEN UTAMA & LOGIKA TEKNIS

### 2.1 Estimasi Kemiringan (Tilt Estimation)

Sistem menggunakan asumsi *quasi-static* untuk menghitung sudut dari data akselerometer:

* **Roll:** $\text{atan2}(a_y, a_z)$
* **Pitch:** $\text{atan2}(-a_x, \sqrt{a_y^2 + a_z^2})$
* **Magnitude:** $\sqrt{\text{roll}^2 + \text{pitch}^2}$

### 2.2 Decision Engine (Deterministik)

Berbeda dengan sistem berbasis AI, mesin keputusan di sini adalah **Rule-based**. Status ditentukan oleh:

* **Instant Tilt:** Nilai sudut saat ini.
* **Slope/Trend:** Laju perubahan sudut terhadap waktu ($\Delta \text{deg} / \Delta t$).
* **Consistency:** Validasi data untuk menghindari *false alarm* akibat noise sesaat.

### 2.3 Jalur Analisis & AI Assistant

Backend menyediakan layer `analysis/` dan `ai/` yang berjalan secara *asynchronous* atau *post-run*:

* **Metrics:** Menghitung MAE, RMSE, dan *detection delay* setelah simulasi selesai.
* **AI Assistant:** Menggunakan LLM untuk memberikan interpretasi naratif terhadap data CSV tanpa mengintervensi logika keselamatan utama.

---

## 3. STRUKTUR DIREKTORI BACKEND

```text
src/
│
├─ app/
│  ├─ main.py                # Entry point (CLI mode)
│  └─ run_with_ui.py         # Entry point (Full System)
│
├─ processing/               # Core Physics & Signal
│  ├─ filters.py             # Smoothing & Noise Reduction
│  ├─ tilt_estimator.py      # Trigonometri percepatan -> sudut
│  ├─ trend.py               # Analisis regresi & slope
│  └─ moisture_processing.py # Ekstensi untuk sensor kelembapan
│
├─ decision/                 # Safety Logic
│  └─ rule_engine.py         # Penentu status NORMAL/WARNING/DANGER
│
├─ analysis/                 # Research Tools
│  └─ metrics.py             # Evaluasi performa (MAE, RMSE)
│
├─ ai/                       # Advisory Layer
│  ├─ assistant.py           # Integrasi LLM
│  └─ report_runner.py       # Generator laporan otomatis
│
├─ io/                       # Data Egress
│  ├─ state_publisher.py     # Broadcast data ke internal queue
│  └─ storage.py             # Penulisan CSV hasil run
│
└─ ui/                       # Bridge to Frontend
   ├─ server.py              # FastAPI & WebSocket Server
   └─ runtime_task.py        # Bridge antara loop utama & socket

```

---

## 4. KONFIGURASI & OUTPUT

### Konfigurasi (`config/`)

Semua parameter sistem dikontrol melalui file YAML. Anda dapat mengubah:

* `sampling_rate`: Frekuensi pengambilan data (default 1 Hz).
* `thresholds`: Batas sudut untuk memicu peringatan.
* `filter_alpha`: Koefisien untuk *low-pass filter*.

### Output

1. **CLI Logs:** Menampilkan status sistem per detik secara transparan.
2. **CSV Logs (`outputs/runs/`):** Dataset lengkap untuk audit atau riset lanjutan di Python/Excel.

---

## 5. PERSYARATAN SISTEM

* **Python:** 3.10 atau lebih baru.
* **Dependencies Utama:**
* `PyYAML`: Untuk manajemen konfigurasi.
* `FastAPI` & `Uvicorn`: Untuk komunikasi WebSocket ke Frontend.
* `NumPy`: (Opsional) Untuk perhitungan matriks tingkat lanjut.

---

## 6. PENGEMBANG
* Galuh Kurnia Pratama
* Mahasiswa Fisika - Universitas Negeri Surabaya

Contact :
Email    : galuh.23105@mhs.unesa.ac.id
No. HP   : +62 812-5985-3104

© 2026 — Galuh Kurnia Pratama
