# Page Brief — elenagonci.com (beranda)

Inspeksi: 20 Okt 2026, Playwright, viewport 1440×900 & 390×844. Screenshots di folder ini (`screenshots/`).
Sumber: Next.js App Router + Turbopack, Tailwind v4, 1 stylesheet (`/_next/static/chunks/f39d368fed01e03f.css`, 89 KB).

## Token

| Token | Nilai |
|---|---|
| Body | `bg white`, teks `rgb(30,30,30)`, font 16/24 |
| Font | `Bricolage Grotesque` (body) + `clepto` (display) → **proyek kita: font sistem Apple** |
| H1 hero | 48px / 50,4px, weight 800, `letter-spacing -1,2px`, center, `max-w` ~576px |
| H2 section | 30px / 36px, weight 800, `-0,75px`; H2 pillar: 30px / 37,5px weight 700 |
| Container | `max-w ~1060px` center (x=190 pada 1440) |
| Kaca (kartu widget) | radius **16px**, bg `oklab(1 0 0 / .3)`, border `0,8px` putih/.45, shadow `inset 0 1px 0 rgba(255,255,255,.6)` + `0 8px 32px rgba(0,0,0,.12)`, `backdrop-filter: blur(40px) saturate(1.5)` |
| Kartu achievement | bg abu terang (~`#f5f5f5`), radius 16, ikon aplikasi 72px radius ~24% |
| Jendela (pillar) | radius `28px 28px 0 0`, `inset 0 2px 1px rgba(255,255,255,.35)`, `0 -4px 16px rgba(0,0,0,.03)` |
| Tombol pill | gradien biru `#57a4f0 → #3e8fe4`, teks putih bold 13px, radius full |
| Breakpoints | Tailwind default (md 768px); hero & dock `md:sticky` |

## Urutan section (y pada 1440px)

1. **Menu bar** (0–28): kiri `EG · Elena Gonci · Head of Product` (12px), kanan tanggal live `Tue, Oct 20  9:52 AM`; border-b tipis. Bukan fixed (scrolls away).
2. **Hero** (0–900): `min-h-[100svh] md:sticky md:top-0`, bg putih.
   - Kiri: clock 150×150 (24,98) · calendar 150×150 (195,98) · music 320×150 (365,98); weather 320×108 (24,272); foto 150×150 (24,412).
   - Tengah: H1 (432,362,576×101) + sub paragraf `text-neutral-500` center.
   - Kanan: 5 folder (x≈1330) ikon folder biru 64px + label 12px center.
   - Dock kanan-bawah (1130,670,262×118): 2 baris × 5 ikon aplikasi, kartu kaca.
   - **Nav dock** tengah-bawah: `sticky top-4 z-[60] pointer-events-none flex justify-center` → ikon besar (44px): folder, app, sparkle, heart, kalender, green; pemisah divider. Karena sticky, dock ini tetap di atas konten saat scroll (lihat semua screenshot ter-scroll).
3. **#achievements** (900, h451, `py-80 px-24`, bg putih): H2 + 5 kartu (grid 5 kolom, gap 24). Kartu: ikon 72px, judul bold 15px, deskripsi abu 14px (di bawah kartu).
4. **In the press** (1351, h374): H2 center + **marquee** `.marquee-track` animasi `96s linear infinite`, kartu putih radius 12 border tipis shadow: logo, judul bold 15px, “Read the article ↗”.
5. **#pillar-stack** (1725, h3216, bg `#fafafa`): 4 baris sticky `md:sticky md:top-24` (804px tinggi) dengan z-index menumpuk (z-10..13), radius atas 28px. Tiap baris: tab folder kiri-atas berlabel (`AI SYSTEMS`, `PRODUCT`, `ENGINEERING`, `CUSTOMER SUCCESS`) — posisi tab naik bertingkat (tab ke-2 lebih rendah, dst), lalu konten 2 kolom: kiri label `SUPERPOWER NºN` (11px uppercase, tracking lebar), H2, paragraf abu, tombol pill; kanan “jendela” (radius 10, header kuning `#f4da71` 30px, body putih) berisi 3 butir **judul bold + deskripsi abu**.
6. **Venture studio & portfolio** (5042): H2 + meta kanan (`Work spanning 2019 to 2024`, abu 14px), lalu daftar baris: nama bold 15px (kiri) — deskripsi abu 14px right-aligned (kanan), pemisah hairline `#e5e7eb`, tinggi baris ~56px.
7. **Playground** (~5900): judul display raksasa (~96px, weight 800) “The **[deck kartu]** Playground” — di tengah judul ada widget tumpukan kartu gambar (~176×100) yang bisa di-hover; sub judul abu center.
8. **#about** (6495, h441, max-w 1060, `py-64`): jendela macOS `about-me.txt` (radius 12, titlebar 36px bg `#f5f5f5` + 3 lampu merah/kuning/hijau 12px + judul center 13px), body putih padding 40, grid 2 kolom: label `THEN`/`NOW` (11px uppercase tracking) + paragraf abu; tombol `THE FUTURE ⊕` (expandable).
9. **#contact** (6936, h269, `py-64`): 3 kolom — (kiri) badge inisial 44px (kartu putih radius 10, shadow) + nama bold + tagline abu + baris 6 ikon sosial 44px; (tengah) daftar tautan `Email →, LinkedIn →, X →, Book a meeting →, CV →` (14px, gap 20); (kanan) 4 lencana bundar + “CSS Design Awards, 2026” + `© 2026`.
10. **CSSDA badge** fixed kiri (`W. Nominee`) — pihak ketiga, **tidak** direplikasi.

## Perilaku

- **Hero sticky** (md) → konten section berikutnya menutupi hero saat scroll.
- **Nav dock** sticky `top-4` → selalu terlihat di atas konten (z-60).
- **Pillar stack** sticky `top-24` menumpuk (efek folder bertumpuk).
- **Marquee** press: 96s linear infinite (duplicated track).
- Jam & tanggal live (JS), cuaca live, kalender bulan berjalan dengan hari ini di-highlight.
- Kalender di mobile: hanya “TUESDAY 20 / Tap to book a meeting” (grid bulan disembunyikan).
- Mobile (<768px): clock, music, weather disembunyikan; H1 masuk kartu putih radius 16; folders jadi grid 4 kolom; dock aplikasi jadi panel penuh (grid 5×2); nav dock jadi baris horizontal scroll.
- `prefers-reduced-motion` dihormati.

## Keputusan replikasi (proyek Rendy)

- Struktur, ukuran, token warna/radius/shadow, sticky behaviour, marquee, jendela about-me.txt → **1:1**.
- Font → **sistem Apple** (`-apple-system`, SF Pro, fallback Segoe UI/Roboto) sesuai keputusan desain.
- Konten, angka, nama, tautan, foto → milik Rendy (lihat `PRD.md` §5), bukan sumber.
- Logo/aset berhak cipta sumber (foto Elena, album art, logo media, lencana CSSDA) → **tidak** dibawa; memakai aset sendiri + `lucide-react`.
