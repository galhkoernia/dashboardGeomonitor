# TILT FOUNDATION MONITORING SYSTEM
## Research-Oriented Simulation & Monitoring Architecture

---

## 1. Nama Proyek

**Tilt Foundation Monitoring System (TFMS)**

Proyek ini merupakan kelanjutan dan pematangan dari sistem simulasi
pemantauan kemiringan pondasi yang telah dikembangkan sebelumnya,
dengan fokus utama pada:

- validitas riset
- determinisme sistem
- auditability
- kesiapan integrasi sensor fisik
- kesiapan integrasi UI real-time tanpa mengganggu core logic

---

## 2. Tujuan Proyek

TFMS bertujuan untuk:

1. Mengembangkan sistem pemantauan kemiringan pondasi berbasis data sensor
   (simulasi terlebih dahulu, sensor fisik di tahap lanjut).
2. Mengevaluasi algoritma estimasi tilt, tren, dan stabilitas secara terukur.
3. Menghasilkan keputusan keselamatan berbasis aturan deterministik.
4. Menyediakan data dan visualisasi real-time untuk observasi dan riset,
   tanpa mempengaruhi jalur keselamatan.
5. Menjadi fondasi jangka panjang untuk prototipe lapangan.

AI tidak digunakan sebagai pengambil keputusan keselamatan.

---

## 3. Ruang Lingkup

### Termasuk
- Simulasi data sensor accelerometer
- Estimasi kemiringan (tilt)
- Filtering dan validasi sinyal
- Analisis tren dan stabilitas
- Rule-based decision engine
- Logging CLI dan CSV
- State snapshot untuk UI real-time (read-only)

### Tidak Termasuk (Tahap Ini)
- Sensor fisik
- Sistem notifikasi operasional
- Dashboard produksi
- Kontrol parameter melalui UI
- AI dalam loop real-time

---

## 4. Filosofi Desain

1. **Deterministic First**  
   Semua keputusan keselamatan bersifat eksplisit dan dapat ditelusuri.

2. **Separation of Concerns**  
   Core runtime tidak bergantung pada UI, AI, atau jaringan.

3. **Auditability**  
   Semua status sistem dapat dijelaskan dari data dan threshold.

4. **Research-Friendly**  
   Mudah direproduksi, diuji, dan dibandingkan antar eksperimen.

5. **Future-Ready**  
   Siap transisi ke sensor fisik dan IoT tanpa refactor besar.

---

## 5. Arsitektur Sistem Tingkat Tinggi

Sistem dibagi menjadi dua jalur utama:

### 5.1 Jalur Operasional (Safety-Critical)

```

Sensor (Simulator / Real Sensor)
|
Signal Processing
|
Tilt Estimation
|
Trend & Stability Analysis
|
Rule-Based Decision Engine
|
CLI Log + CSV Output

```

Karakteristik:
- Deterministik
- Tidak menggunakan AI
- Tidak bergantung UI
- Aman untuk eksperimen dan validasi

---

### 5.2 Jalur Observasi & Analisis (Non-Safety)

```

Runtime Snapshot
|
State Publisher (Read-Only)
|
Queue / MQTT
|
Web UI (Real-Time Visualization)

```

Karakteristik:
- Observer only
- Tidak mempengaruhi keputusan
- Boleh mati tanpa menghentikan sistem

---

## 6. Struktur Folder (Terkunci)

Struktur proyek lanjutan tetap mengikuti struktur yang sudah ada:

```

foundation_simulation/
│
├─ config/
│   ├─ default.yaml
│   └─ experiments/
│
├─ outputs/
│   ├─ runs/
│   └─ figure/
│
├─ scripts/
│
├─ src/
│   ├─ app/
│   │   └─ main.py
│   │
│   ├─ simulator/
│   │   └─ scenarios.py
│   │
│   ├─ processing/
│   │   ├─ filters.py
│   │   ├─ tilt_estimator.py
│   │   ├─ trend.py
│   │   └─ validation.py
│   │
│   ├─ decision/
│   │   └─ rule_engine.py
│   │
│   ├─ analysis/
│   │   ├─ metrics.py
│   │   └─ anomaly.py
│   │
│   ├─ ai/
│   │   ├─ assistant.py
│   │   ├─ prompts.py
│   │   └─ schemas.py
│   │
│   ├─ common/
│   │   ├─ config.py
│   │   └─ types.py
│   │
│   └─ io/
│       └─ state_publisher.py   (baru)
│
└─ README.md

````

---

## 7. Snapshot Runtime (Kontrak Data Final)

Snapshot merupakan **hasil akhir per tick**, bersifat read-only,
dan digunakan untuk CSV, Queue, dan MQTT tanpa perubahan format.

### Struktur Snapshot

```json
{
  "t_sec": 72,
  "tilt_est_deg": 0.2563725718898733,
  "tilt_filt_deg": 0.2481374249693496,
  "slope_deg_per_hour": 1.1314854780630539,
  "delta_deg": -0.021606647402508894,
  "r2": 0.0513341509771309,
  "sigma_deg": 0.02886033473722858,
  "consistency": 5,
  "slope_ok": false,
  "status": "NORMAL",
  "reason": "within thresholds",
  "anomaly_active": false
}
````

Aturan:

* Flat structure
* JSON serializable
* Identik dengan CSV header
* Tidak mengandung parameter kontrol

---

## 8. Mekanisme Publikasi State

### Tahap Riset (Saat Ini)

* Menggunakan Queue lokal (multiprocessing)
* Tanpa dependency jaringan
* Deterministik dan mudah diuji

### Abstraksi

Core runtime hanya mengenal:

```
publisher.publish(snapshot)
```

Implementasi transport dapat diganti tanpa mengubah core logic.

---

## 9. Integrasi UI Real-Time

UI:

* Berjalan sebagai process terpisah
* Read-only
* Tidak mempengaruhi RuleEngine

Teknologi:

* FastAPI + WebSocket
* Update rate ±1 Hz
* Visualisasi berbasis snapshot

---

## 10. Peran AI (Terkunci)

AI Assistant:

* Membaca CSV hasil run
* Menghitung dan merangkum metrik
* Memberikan interpretasi dan rekomendasi

AI tidak:

* Masuk ke runtime loop
* Mengubah status keselamatan
* Mengontrol parameter sistem

---

## 11. Pengembangan Selanjutnya

Tahapan pengembangan yang disarankan:

1. Audit dan konsistensi metrik (trend → metrics → AI)
2. Implementasi `StatePublisher` + QueuePublisher
3. UI WebSocket minimal untuk visualisasi riset
4. Integrasi sensor fisik (mengganti simulator)
5. Penambahan MQTT sebagai transport alternatif
6. Multi-node monitoring
7. Evaluasi false alarm dan detection delay
8. Penyusunan laporan riset otomatis

---

## 12. Penutup

TFMS dirancang sebagai fondasi riset yang kuat,
bukan solusi instan.

Keputusan desain diambil untuk memastikan:

* keselamatan
* transparansi
* kemudahan pengembangan jangka panjang
* kesiapan menuju sistem lapangan

```

---
