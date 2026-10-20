# Asset Map — elenagonci.com → proyek Rendy

Aturan: hanya aset yang boleh dipakai (milik Rendy / bebas lisensi). Aset milik pihak ketiga dicatat sebagai “rebuild”.

| Aset sumber | URL sumber | Keputusan lokal |
|---|---|---|
| Font `Bricolage Grotesque` | `/_next/static/media/017d9bea37084d9b-s.p.*.woff2` | **Tidak dipakai** → font sistem Apple (CDN nol) |
| Font `clepto` | `/_next/static/media/clepto-s.p.*.otf` | **Tidak dipakai** (berlisensi pribadi) |
| Ikon folder biru | `/app-icons/folder.png` | **Rebuild** → SVG folder gradien biru (Komponen `FolderIcon`) |
| Ikon dock (Notion, Claude, ChatGPT, Gmail, X, dll.) | `/app-icons/*.png` | **Rebuild** → ikon sendiri: WhatsApp, Email, Instagram, LinkedIn, Website (Rapid), CV, Maps, Globe (bahasa) |
| Foto selfie Elena | `/selfie.jpg` | **Ganti** → `public/sites/rendy/foto-rendy.png` (crop foto dari `Marketing_Sales_CV_Rendy.pdf` hal. 1, 534×564) |
| Album art *Psycho Killer* | `/album-psycho.jpg` | **Ganti** → kartu musik tanpa artwork (mode visual, tautan streaming) |
| Logo media (IBTimes, dll.) | `/press/*` | **Tidak dipakai** → marquee diisi kartu sertifikat milik Rendy |
| Lencana CSSDA | `/cssda-*.svg` | **Tidak dipakai** (penghargaan milik sumber) → lencana milik Rendy dibuat sendiri (SVG) |
| Ikon achievement (graduation cap, dll.) | inline | **Rebuild** dengan `lucide-react` + warna latar sendiri |
| — | — | **Data baru**: logo/tautan Rapid Network → `https://www.rapid.net.id/` (tautan eksternal, tanpa unduh aset) |

## Aset lokal yang dibuat

| File | Asal |
|---|---|
| `public/sites/rendy/foto-rendy.png` | Crop `Marketing_Sales_CV_Rendy.pdf` hal. 1 (PyMuPDF, 6×, RGB) |
| `public/sites/rendy/audio/` | Kosong — menunggu cuplikan audio berlisensi (OQ-4) |
