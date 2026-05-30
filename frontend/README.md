# Structural Tilt Monitoring UI

## Observer Dashboard (Engineering-Grade, Read-Only)

---

## 1. Gambaran Umum

Project ini merupakan **antarmuka web (UI)** untuk **pemantauan kemiringan struktur / pondasi** berbasis data snapshot dari backend deterministik.

UI berfungsi sebagai:

* **observer real-time** data kemiringan dan stabilitas,
* visualisasi **status keselamatan sistem**,
* media riset, demo, dan observasi teknis,
* **tanpa pengaruh apa pun terhadap logika keselamatan backend**.

UI **tidak melakukan perhitungan fisik**, **tidak mengambil keputusan**, dan **tidak mengubah data**.
Seluruh status keselamatan (**NORMAL / WARNING / DANGER**) bersifat **authoritative dari backend**.

---

## 2. Filosofi Desain

UI dirancang mengikuti prinsip berikut:

1. **Observer-Only Interface**

   * UI hanya membaca snapshot.
   * Tidak ada kontrol runtime.
   * Tidak ada feedback ke sistem keselamatan.

2. **Safety-First Visual Hierarchy**

   * Status sistem harus terbaca < 1 detik.
   * Warna dan struktur visual mendahului angka mentah.

3. **Snapshot-Driven Architecture**

   * Seluruh UI bergantung pada satu struktur snapshot.
   * Snapshot identik dengan CSV backend dan payload WebSocket.

4. **Engineering-Grade UI**

   * Fokus pada keterbacaan dan konsistensi teknis.
   * Tanpa gimmick visual atau animasi dekoratif.

5. **Demo-Ready & Integration-Ready**

   * Mendukung mock data dan WebSocket real-time.
   * Struktur UI tetap sama untuk demo maupun live.

---

## 3. Batasan Sistem (Design Boundary)

UI **TIDAK BOLEH**:

* menghitung ulang tilt / slope / sigma / delta,
* menentukan status keselamatan,
* mengubah threshold atau rule,
* memodifikasi reason status,
* mengirim perintah ke backend.

UI **HANYA BOLEH**:

* menerima snapshot,
* memetakan snapshot ke visual,
* menyajikan konteks angka dan grafik.

---

## 4. Arsitektur Konseptual

```
Backend Deterministik
(Simulator / Sensor Fisik)
|
v
Snapshot State (JSON)
|
v
WebSocket / Mock Source
|
v
UI Observer (React)
```

Jika UI mati, backend **tetap berjalan normal**.

---

## 5. Struktur Folder UI (Aktual & Terorganisir)

Struktur berikut **sesuai 100% dengan folder yang Anda unggah**:

```
ui/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                  # Entry point React
   ├─ App.jsx                   # Root application
   │
   ├─ pages/
   │  └─ Dashboard.jsx          # Halaman utama observer
   │
   ├─ components/
   │  ├─ decision/              # Indikator keputusan (read-only)
   │  │  ├─ PrimaryTiltDisplay.jsx
   │  │  └─ index.js
   │  │
   │  ├─ evidence/              # Bukti visual pendukung (charts)
   │  │  ├─ EvidencePanel.jsx
   │  │  └─ index.js
   │  │
   │  ├─ stability/             # Metrik stabilitas
   │  │  ├─ StabilityMetrics.jsx
   │  │  └─ index.js
   │  │
   │  ├─ system/                # Konteks sistem & status global
   │  │  ├─ SystemContextBar.jsx
   │  │  ├─ TiltChart.jsx
   │  │  └─ SlopeChart.jsx
   │  │
   │  └─ layout/                # Tata letak UI
   │     ├─ MainHeader.jsx
   │     ├─ Sidebar.jsx
   │     ├─ SystemFooter.jsx
   │     └─ index.js
   │
   ├─ data/                     # Kontrak data & mock
   │  ├─ snapshotSchema.js      # Definisi schema snapshot
   │  ├─ snapshotSource.js      # Switch mock / live
   │  ├─ mockSnapshots.js       # Data simulasi
   │  ├─ mockChartData.js
   │  ├─ diagnosticSchema.js
   │  ├─ diagnosticSchema.js
   │  └─ snapshotAccessors.js
   │
   ├─ state/
   │  └─ useSnapshot.js         # State management snapshot
   │
   ├─ transport/
   │  └─ wsClient.js            # WebSocket client
   │
   └─ styles/                   # Styling global & token
```

---

## 6. Peran Modul UI

### 6.1 `decision/`

Menampilkan **indikator keputusan utama**:

* nilai tilt utama,
* status sistem,
* indikator visual keselamatan.

⚠️ Tidak melakukan logika keputusan.

---

### 6.2 `evidence/`

Menyediakan **bukti visual pendukung**:

* grafik tilt vs waktu,
* grafik laju perubahan (slope).

Digunakan untuk **konteks dan validasi visual**, bukan keputusan.

---

### 6.3 `stability/`

Menampilkan **metrik stabilitas sistem**:

* slope,
* sigma,
* delta,
* konsistensi,
* R².

---

### 6.4 `system/`

Menampilkan **konteks global sistem**:

* status keselamatan,
* grafik inti,
* informasi runtime.

---

### 6.5 `layout/`

Mengatur **kerangka UI**:

* header,
* sidebar,
* footer.

---

## 7. Struktur Snapshot Data (Kontrak UI ↔ Backend)

UI hanya mengenal **struktur snapshot berikut**:

```json
{
  "t_sec": 72,
  "tilt_est_deg": 0.2563,
  "tilt_filt_deg": 0.2481,
  "slope_deg_per_hour": 1.1314,
  "delta_deg": -0.0216,
  "r2": 0.0513,
  "sigma_deg": 0.0289,
  "consistency": 5,
  "slope_ok": false,
  "status": "NORMAL",
  "reason": "within thresholds",
  "anomaly_active": false
}
```

Aturan:

* Struktur **tidak boleh diubah UI**.
* `status` dan `reason` bersifat **final**.

---

## 8. Mode Operasi UI

### 8.1 Demo / Mock

* Data berasal dari `data/mockSnapshots.js`.
* Digunakan untuk riset dan presentasi.

### 8.2 Live (WebSocket)

* Data diterima dari backend deterministik.
* Update ±1 Hz.
* UI tetap observer-only.

---

## 9. Grafik

UI hanya menampilkan **grafik kontekstual**:

1. Tilt vs Time
2. Slope Rate vs Time

Grafik:

* non-interaktif berlebihan,
* tidak mempengaruhi status.

---

## 10. Menjalankan UI

```bash
npm install
npm run dev
```

Akses:

```
http://localhost:5173
```

---

## 11. Catatan Penting

UI ini:

* **bukan dashboard bisnis**,
* **bukan sistem kontrol**,
* **bukan decision engine**.

UI adalah **alat observasi teknik**.

---