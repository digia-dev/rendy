# Catatan build — situs Rendy Giantara (kloning elenagonci.com)

Status: **selesai** untuk tahap beranda + halaman work. `npm run check` (lint + typecheck + build) lolos; 17 halaman SSG.

## Menjalankan

```bash
npm run dev     # http://localhost:3000 → redirect ke /id atau /en
npm run check   # lint + typecheck + build
```

Deploy: Vercel (OQ-7). `output: standalone` dipertahankan dari template.

## Struktur (lihat PRD.md §8)

```
src/
  proxy.ts                     # deteksi locale (Next 16: konvensi middleware → proxy)
  i18n/{routing,navigation,request}.ts
  data/site.ts                 # SELURUH konten id/en + fakta (satu sumber kebenaran)
  app/[locale]/layout.tsx      # html lang, hreflang id/en, metadata
  app/[locale]/page.tsx        # beranda: hero → achievements → sertifikat → pillar → portfolio → galeri → about → contact
  app/[locale]/work/[slug]/page.tsx   # 6 halaman: rapid-network, home-credit, suryapran, kimia-farma, sertifikat, pendidikan
  components/sites/rendy/*     # komponen (widget di subfolder widgets/)
public/sites/rendy/foto-rendy.png     # crop foto CV hal.1 (PyMuPDF 6×)
docs/research/elenagonci/       # page-brief, asset-map, screenshot sumber + lokal
docs/research/rapid-network/    # riset rapid.net.id
```

Catatan PRD §8.2 menyebut beberapa file `src/data/*`; dikelompokkan jadi `src/data/site.ts`
agar teks dwibahasa tidak terpecah — struktur record tetap seperti tabel §8.2.

## Setara dengan sumber (diverifikasi lewat screenshot 1440 & 390)

| Elemen | Status |
|---|---|
| Menu bar, hero sticky `md:top-0` | 1:1 (dock adalah **sibling** hero di sumber — dipecah: desktop `sticky top-4` utk md+, mobile `sticky bottom-4` melintasi konten & naik saat footer) |
| Docker (nav) — **magnification ala macOS** | Ikon memperbesar kontinu saat pointer mendekat/sliding (kurva Gaussian/paradola, max ~1.45); berlaku desktop & mobile |
| **Floating music mobile** | Tombol musik ala macOS (kanan-atas) + cover & equalizer; **drag & drop** ke posisi mana pun dengan **no-fly zone** agar tidak menutupi deck tengah |
| Kartu kaca (radius 16, blur 40px), marquee 96s, pilar sticky `top-24` menumpuk z-10..13, tab folder, jendela header kuning, `about-me.txt` | 1:1 — **pillar kini "folder besar" macOS** (keputusan pengguna): tab folder besar (clip-path, `#e4e5e8`, label uppercase `#6b6b70`) menempel kiri + body off-white `#f6f7f9` berisi konten 2 kolom; bg `#fafafa`; tanpa border keras |
| Section: achievements 5 kartu, portfolio **grid kartu abu** (bg `#f4f4f5` + ikon folder macOS, keputusan pengguna — menggantikan baris hairline), playground display + deck, contact 3 kolom | 1:1 |
| Font | **Bricolage Grotesque** (webfont `next/font/google`, sama seperti sumber) — keputusan pengguna 21 Okt 2026 menggantikan font sistem Apple |
| Marquee "In the press" | diisi sertifikat (tidak ada data press) |

## Penyimpangan sadar (tercatat, bukan bug)

1. **Musik — pemutar audio lokal penuh** (OQ-4, keputusan pengguna): berkas MP3 Sheila On 7
   ditaruh pengguna & dipasang (`public/sites/rendy/audio/melompat-lebih-tinggi.mp3`, durasi
   3:19 + cover dari Apple iTunes). Widget `MusicCard` kini pemutar nyata: play/pause lokal,
   **progress bar seekable**, dan **rentang waktu** (posisi berjalan / sisa `-0:00`), durasi
   diambil dinamis dari metadata berkas di browser. Diverifikasi: play OK, durasi 199.7s,
   label `0:01 / -3:19`, range terisi.
2. **Booking mandiri bertema macOS → Google Calendar** (OQ-9, keputusan pengguna 20 Okt 2026 —
   menggantikan Cal.com dan popup DaySchedule): kartu kalender hero membuka **dialog jendela
   macOS** (`BookingDialog.tsx`) dengan grid bulan navigasi (hari ini di-highlight, tanggal lampau
   disabled) + daftar slot jam (`widgets.calendar.slots`, 30 mnt, zona Asia/Jakarta).
   - Pilih tanggal + jam → tombol **“Simpan ke Google Calendar”** membangkitkan tautan template
     event `calendar.google.com/calendar/render?action=TEMPLATE&…&ctz=Asia/Jakarta` (judul, waktu,
     detail, lokasi sudah terisi) dan membukanya di tab baru. **Tanpa backend/OAuth** — cocok untuk
     hosting statis Vercel; tidak ada kredensial Google yang diperlukan.
   - Cadangan WhatsApp selalu tampil di dialog (`fallbackUrl`, 081776890009 / wa.me/6281776890009).
   - Paket npm `dayschedule-widget`, `src/lib/dayschedule.ts`, dan `BookingTrigger.tsx` sudah dihapus.
   - Dialog dirender lewat **portal ke `document.body`** — wajib, karena wrapper `Draggable`
     memakai `transform` yang menjadikan ancestor itu containing block untuk `position: fixed`.
   - Aksesibilitas: `role=dialog` + `aria-modal`, jebakan fokus (Tab), Escape menutup, fokus
     kembali ke kartu pemicu, kunci gulir latar, tombol tutup berlabel (lampu merah + ×).
   - Ikon dock “Jadwalkan meeting” & pil footer tetap tautan WhatsApp (pilihan pengguna sebelumnya).
3. **Drag-and-drop semua widget hero** (keputusan pengguna, seperti elenagonci.com): wrapper
   `Draggable.tsx` meniru mekanisme sumber — pointer-event asli tanpa pustaka, kelas
   `cursor-grab touch-none select-none active:cursor-grabbing`, `draggable={false}`, angkat
   `translate3d + scale(1.03)` saat digeser, posisi bertahan di tempat jatuh (tanpa snap-back).
   - Yang bisa digeser: jam, musik, kalender, cuaca, foto, 6 folder, dock aplikasi (12 elemen).
     Folder memakai mode `inFlow` (ikut alur flex, hanya offset geser) agar tata letak persis.
   - **Deviasi dari sumber**: posisi disimpan ke `localStorage` (`rendy:widget:<id>`) sehingga
     susunan bertahan setelah muat ulang — sumber mengembalikan posisi awal. Tanpa JS/layout
     server tetap posisi awal (offset dihydrate lewat effect, aman SSR).
   - Drag ≠ klik: gerak < 4px dianggap tap; drag nyata memblokir klik berikutnya
     (`onClickCapture`) supaya folder/tombol kalender tidak ikut terpicu.
4. **Satu jam saja: JAKARTA** (keputusan pengguna): `widgets.clocks` tinggal 1 entri
   `Asia/Jakarta` (WIB); kartu kedua (dulu Tegal/Brebes) dihapus, kartu musik digeser ke
   `left: 195px`.
5. **Hero self-sentris** (keputusan pengguna, 20 Okt 2026): posisi teks hero diubah dari
   `absolute top-[334px]` menjadi **flex centering penuh** (`pointer-events-none absolute inset-0
   flex items-center justify-center`) — cara yang sama dipakai sumber — sehingga judul+subjudul
   selalu tepat di tengah kanvas (diverifikasi: offset v/h = 0 px). Kopi = teks EN dari pengguna:
   “I’m Rendy. / Marketing & Product Manager / at Rapid Network. / Handling 200+ clients, …”.
6. **Ikon ala macOS / setara sumber** (keputusan pengguna + audit clone-website 20 Okt 2026):
   semua ikon dibuat ulang agar seakurat mungkin dengan sumber (elenagonci.com) tanpa menyalin
   aset PNG miliknya:
   - **Folder** = **direkonstruksi persis** dari `/app-icons/folder.png` sumber (ikon sistem
     macOS generik, bukan karya Elena): folder biru-muda flat — warna body `rgb(116,208,250)`,
     tab/tepi `rgb(147,220,254)`, sisi `rgb(101,201,248)`; dirender 56×56 (`h-14 w-14`) di kolom
     kanan (`w-20`, sejajar x≈1332), 12 instance. Terverifikasi pixel sample `rgb(116,208,250)`.
   - **Nav dock** = **setara sumber**: 6 tautan 40×40, tiap icon **rounded-square berwarna**
     (`rounded-[24%]`, `shadow`) berisi ikon *filled* 20px (`h-1/2 w-1/2`, `fill="currentColor"`)
     — home inisial **“R”** (bg putih + border black/10, `hover:bg-[#f3f3f3]`), folder **gradien
     biru** `#5FB0FF→#2E7CF6`, sparkle **gradien ungu** `#C489FB→#8231E8`, heart **gradien
     merah** `#FF7A93→#F92D50`, kotak **Kalender putih** (`rounded-[24%]`) hari+tanggal,
     phone **gradien hijau** `#4FDE73→#1FB84A`. Semua icon punya **animasi hover macOS**:
     `transition-[filter,background-color] hover:brightness-105`. Satu pemisah vertikal
     `bg-black/15` setelah inisial; pill `glass-card` `gap-2.5` `items-start`.
   - **Dock apps** = **PNG ikon real berwarna & membulat** (dibangkitkan dari logo merek resmi
     simple-icons via `scripts/gen_real_icons.mjs` + sharp): rounded-square konsisten
     (sudut transparan), logo resmi putih di atas latar warna brand. Brand dialog (WhatsApp,
     Instagram, Gmail, LinkedIn, Claude, ChatGPT) memakai path logo asli; generic (Website,
     CV, Maps, Bahasa) pakai glyph setara. Diverifikasi: semua sudut transparan (round) &
     mark putih hadir.
   - **Ikon achievements** = **setara sumber**: 72×72, `rounded-[22%]`, **gradien vertikal**
     (dari `lighten(color,0.28)` ke `color`), glyph Lucide 24px `stroke-width 1.8`.
   - **Menu bar** = **setara sumber**: `h-7 bg-white/70 backdrop-blur-md border-b
     border-black/10 text-[11px]` → efek **kaca buram macOS**; kiri `RG · Rendy Giantara ·
     role`, kanan tanggal+jam `tabular-nums min-w-124px`.
   - **Animasi hover macOS** = **setara sumber + magnification seamless**: pinggir dock & nav memakai
     `transition-[filter,transform,scale,translate,background-color] duration-200
     ease-[cubic-bezier(0.16,1,0.3,1)]` (easeOutExpo — mulus) dengan
     `hover:-translate-y-1.5 hover:scale-110 hover:brightness-110`. Semua 6 ikon termasuk
     **kalender** (dulu tak punya efek) kini sama: ikon **naik, membesar, & cerah** dengan
     timing 200ms eksponensial (seamless). Terverifikasi: `scale=1.1`, `translate=0 -5.7px`,
     `filter=brightness(1.1)` berjalan mulus saat hover.
   - Tidak memakai aset PNG/kode milik sumber; hanya nuansa/bentuk visual serta warna persisnya.
7. **`next-intl` `messages: {}`**: seluruh copy ada di `src/data/site.ts` sebagai `{id,en}`,
   jadi file JSON messages sengaja kosong (routing/hreflang/toggle tetap dipakai next-intl).
8. **CV**: tidak ada tautan unduh PDF (PDF memuat KTP/ijazah/nilai → §7) — folder "Pendidikan"/"CV"
   membuka halaman ringkasan `/work/pendidikan`.
9. Logo media/lencana source (awwards/cssda, logo press, footage PNG) diganti SVG sendiri —
   lihat `docs/research/elenagonci/asset-map.md`.
10. **Custom cursor scheme ala macOS (Capitaine-style)** (keputusan pengguna): SVG cursor di
    `public/sites/rendy/cursors/` (arrow hitam outline putih, hand, I-beam, busy) menggantikan
    semua state cursor di desktop (`@media pointer:fine`); **smooth scroll** via `SmoothAnchor`
    (scrollIntoView, bukan hanya CSS) agar bekerja lintas-browser; **menu bar dropdown** macOS
    (frosted glass, item link, tutup via klik-luar/Escape); **deck magnification** ala macOS.

## Masukan yang masih dibutuhkan

- (opsional) konfirmasi foto profil = crop `Marketing_Sales_CV_Rendy.pdf` hal. 1 (sudah dipakai sementara).

## Verifikasi Playwright

Screenshot sumber vs lokal tersimpan di `docs/research/elenagonci/screenshots/`
(`desktop-*` sumber, `local-*` lokal; termasuk mobile 390 & halaman `/id/work/rapid-network`).
Uji manual: `/` → redirect `/id` sesuai Accept-Language, `/en` menampilkan copy EN + `hreflang`,
toggle bahasa di dock, anchor `#pillar-stack` `#achievements` `#about` `#contact`,
marquee jalan (mati pada `prefers-reduced-motion`), cuaca Open-Meteo segar 1 jam.

**Dialog booking macOS** (uji di production build, `next start` port 3001): klik kartu kalender
(desktop 1440 & mobile 390) → dialog jendela macOS terpusat (lampu lalu lintas, judul "kalender",
grid bulan dengan tanggal 20 ter-highlight, daftar slot jam kanan); pilih tanggal + jam → tombol
“Simpan ke Google Calendar” muncul dengan `href` template Google Calendar yang benar (dates/ctz
Asia/Jakarta); Escape/tombol tutup menutup dan fokus kembali ke kartu.

**Drag-and-drop** (uji di 1440): 12 elemen `.cursor-grab` ter-render (jam, musik, kalender, cuaca,
foto, 6 folder, dock); simulasi pointer down→move→up pada jam mengubah transform
`translate3d(0,0,0)` → `translate3d(70px,45px,0)` dan tersimpan ke
`localStorage["rendy:widget:clock"] = {"x":70,"y":45}`.
