# UI Subsystem dan Deployment Boundary (Riset)

Dokumen ini menjelaskan pemisahan peran antara UI statis, UI server (FastAPI/WebSocket), dan runtime core (simulator + decision engine). Tujuan utamanya adalah menjaga core tetap deterministik dan membuat UI bersifat observer read-only.

## 1. Struktur Folder (Disarankan, Minimal Change)

Struktur berikut sudah sesuai dengan boundary yang benar:

foundation_simulation/
├─ src/
│  ├─ app/                 # runtime core (simulator, processing, decision)
│  │  └─ main.py
│  │
│  └─ ui/                  # UI subsystem
│     ├─ server.py         # WebSocket bridge (FastAPI)
│     ├─ debug_server.py
│     └─ web/              # frontend statis
│        ├─ index.html
│        ├─ style.css
│        └─ app.js
└─ README.md

Catatan:
- src/ui/web berisi asset frontend murni (HTML/CSS/JS).
- src/ui/server.py adalah backend kecil untuk WebSocket (bridge), bukan bagian dari core logic keselamatan.

## 2. Boundary dan Peran Komponen

| Komponen        | Peran                                  | Sifat |
|----------------|-----------------------------------------|------|
| Runtime core    | simulasi + processing + rule engine     | deterministik, safety-critical |
| UI server       | streaming snapshot state via WebSocket  | read-only observer |
| UI web          | menampilkan state realtime + diagnosa   | read-only observer |

Aturan tegas:
- UI tidak boleh mengubah parameter runtime.
- UI tidak boleh mempengaruhi RuleEngine.
- Data yang dikirim UI server berasal dari snapshot yang sama dengan CSV output.

## 3. Mode Lokal vs Mode Deploy

### Mode lokal (untuk riset dan debugging)
- FastAPI boleh serve index.html agar satu entry point.
- FastAPI menyediakan:
  - GET / (index.html)
  - /static/* (asset)
  - WS /ws/state (stream snapshot)

Keuntungan:
- cepat untuk test end-to-end di satu proses/host.

### Mode deploy (untuk akses remote / kolaborasi)
- UI web di-host sebagai static site (misal Vercel).
- UI server + runtime core di-host di backend yang mendukung proses panjang dan WebSocket stabil (VPS / Fly.io / Render / Railway).
- UI web melakukan koneksi ke domain backend untuk WebSocket.

Catatan penting:
- Vercel cocok untuk hosting UI statis.
- WebSocket backend sebaiknya tidak memakai platform serverless yang tidak cocok untuk koneksi stateful panjang.

## 4. Asset Path dan Konsistensi

Ada dua opsi yang konsisten:

### Opsi A (ikuti kondisi lokal saat ini, asset lewat /static)
- index.html memuat:
  - /static/style.css
  - /static/app.js
- server.py mount:
  - app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

Untuk deploy Vercel:
- pastikan asset juga tersedia pada path /static (contoh: buat folder static pada output build), atau ubah index.html khusus deploy.

### Opsi B (asset relative untuk static hosting)
- index.html memuat:
  - ./style.css
  - ./app.js

Untuk mode lokal:
- server.py perlu serve file langsung dari WEB_DIR tanpa prefix /static, atau mount static di root.

Rekomendasi untuk saat ini:
- pertahankan Opsi A agar tidak banyak mengubah yang sudah berjalan.
- saat deploy Vercel, buat build step kecil atau struktur folder agar /static tersedia.

## 5. WebSocket URL Strategy (lokal vs deploy)

Di app.js:
- lokal:
  ws://127.0.0.1:8000/ws/state
- deploy:
  wss://<backend-domain>/ws/state

Implementasi sederhana:
- jika hostname adalah localhost gunakan ws lokal
- selain itu gunakan wss backend domain

Catatan:
- gunakan wss pada https site, karena browser biasanya memblok ws non-secure pada origin https.

## 6. Catatan Keras untuk Menjaga Validitas Riset

Jangan lakukan:
- memindahkan rule engine ke UI server
- menjadikan UI sebagai pengambil keputusan keselamatan
- menjadikan hosting static sebagai backend WebSocket

Jika itu dilakukan, sistem akan bergeser dari riset yang audit-able menjadi demo yang rapuh.

## 7. Operasional Backend: Default untuk Riset

Default yang disarankan:
- backend berjalan per eksperimen (start → run → stop)
- cocok untuk simulasi, evaluasi, dan reproducibility

Saat sensor fisik siap:
- backend dapat diubah menjadi continuous monitoring (long-running service)
- tanpa mengubah schema snapshot maupun UI contract
