# Rencana Fitur Blog — Rendy Site (macOS design)

> Pengganti rencana UI/UX lama (P0–P2 sudah selesai dikerjakan).
> Keputusan user: **Hybrid MDX + password-protected admin**, desain **Notes.app-style**,
> akses via **MenuBar + RSS/sitemap**, **tanpa icon dock baru**.

## 1. Ringkasan

Menambahkan fitur blog berbahasa Indonesia + Inggris dengan desain jendela macOS ala Notes.app:
list artikel di panel kiri, konten artikel di panel kanan. Konten disimpan sebagai file MDX
di repo (`src/content/blog/`), dibaca saat build (SSG) — sama seperti pola `readGalleryDir()`.
Tersedia halaman `/admin` ber-password untuk menulis/mengedit post dari browser tanpa sentuh kode.

## 2. Dependencies

| Package | Untuk | Status |
|---|---|---|
| `gray-matter` | Parsing frontmatter MDX | ✅ terpasang |
| `next-mdx-remote@6` (RSC `compileMDX`) | Render MDX → React di server | ✅ terpasang |
| `remark-gfm` | Tabel/task-list markdown | ✅ terpasang |

> Cek docs lokal `node_modules/next/dist/docs/01-app/02-guides/mdx.md` (Next 16):
> `@next/mdx` tidak support frontmatter bawaan → `gray-matter` dipakai memisahkan frontmatter,
> lalu `compileMDX` dari `next-mdx-remote/rsc` me-render body-nya (aman untuk RSC).
> Auth tidak perlu NextAuth: 1 password env + cookie HMAC-signed (lihat §6).

## 3. Struktur file

```
src/content/blog/                  # sumber konten (build-time fs read)
  <slug>.id.mdx
  <slug>.en.mdx
src/lib/blog.ts                    # readPostFiles(), listPosts(), getPost() — mirror gallery.ts
src/lib/rss.ts                     # buildRss(locale)
src/lib/site-url.ts                # siteUrl() absolut untuk RSS/sitemap
src/lib/admin-auth.ts              # signSession/verifySession (HMAC) + checkPassword timing-safe
src/lib/admin-session.ts           # isAdminAuthenticated() dari cookie
src/lib/blog-admin.ts              # savePost()/deletePost() — fs (dev) vs GitHub Contents API (prod)
src/app/[locale]/blog/page.tsx     # Notes-style list (SSG)
src/app/[locale]/blog/[slug]/page.tsx  # artikel (SSG)
src/app/[locale]/admin/page.tsx    # gate: login dialog → editor (dynamic, noindex)
src/app/api/admin/login/route.ts   # POST: verify password → set signed httpOnly cookie
src/app/api/admin/logout/route.ts  # POST: clear cookie
src/app/api/admin/posts/route.ts   # GET/POST/DELETE (wajib login)
src/app/rss.xml/route.ts           # feed utama (locale default)
src/app/[locale]/rss.xml/route.ts  # feed per-locale: /id/rss.xml, /en/rss.xml
src/app/sitemap.ts                 # home, playground, work, blog, tiap blog slug (per locale)
src/app/robots.ts                  # allow publik, disallow /admin + /api/
src/components/sites/rendy/blog/
  NotesWindow.tsx                  # kerangka jendela: traffic lights + toolbar + 2 pane
  PostListSidebar.tsx              # search + baris post (judul/tanggal/snippet, badge draft/fallback)
  PostReader.tsx                   # header meta + konten MDX (prose styling eksplisit)
  PostActions.tsx                  # ganti bahasa + salin tautan (client)
  AdminGate.tsx                    # login dialog macOS-style + editor form (client)
```

Akses:
- **MenuBar**: dropdown "Blog" berisi 3 post terbaru + "Semua artikel" + RSS (data di-pass dari `HeroDesktop`).
- **Dock**: TIDAK ditambah icon baru (sesuai pilihan user). `SectionDock` tidak diubah.

## 4. Format konten (frontmatter bilingual)

Satu pasang file per post (`slug.id.mdx` + `slug.en.mdx`), di-pair by slug — tubuh artikel
beda per bahasa. Frontmatter:

```yaml
---
title: "Judul artikel"
date: 2026-10-21
excerpt: "Ringkasan singkat untuk list & meta description."
tags: ["marketing", "product"]
draft: true          # true → tampil hanya di admin, tidak di publik/RSS
cover: "/sites/rendy/blog/cover.jpg"   # opsional
---
```

- `src/lib/blog.ts`: `fs.readdir` + `gray-matter`; pair by slug; post 1 bahasa tetap tampil
  (fallback + badge di UI); sort desc by `date`; draft difilter kecuali mode admin.
- `generateStaticParams` hanya memakai slug non-draft; akses draft via URL → `notFound()`.
- SSG: file baru butuh rebuild/deploy di prod, live di dev — konvensi yang diterima.

## 5. Halaman publik — Notes.app design

**`/[locale]/blog`** dan **`/[locale]/blog/[slug]`** memakai `NotesWindow` yang sama:

- **Window chrome**: rounded-2xl, `bg-white`, soft shadow, titlebar `#f4f4f5` + 3 traffic
  lights (merah = kembali ke beranda), toolbar tipis, dua pane.
- **Pane kiri (list)**: search input (filter client-side judul/excerpt/tag), baris post =
  judul + tanggal + excerpt; post terpilih `bg-[#e8e8ed]` ala Notes selection; badge
  "Draf" (kuning) & "Hanya tersedia dalam ID/EN" untuk fallback bahasa.
  Empty state bermakna + link kembali ke beranda.
- **Pane kanan (reader)**: meta (tanggal • reading time • tags) + judul besar + konten MDX
  dengan styling prose eksplisit (tanpa border kiri), `scroll-mt` headings.
- **Mobile (390)**: single-pane — list page tampilkan sidebar, post page tampilkan reader
  + tombol back "‹ Semua artikel"; keduanya di CSS (`md:` breakpoints), tanpa JS state.
- **Bilingual**: chrome dari locale UI; konten dari file per-bahasa; tombol "Baca versi
  ID/EN" muncul hanya jika versi bahasa lain tersedia (`availableLocales`).
- Metadata per post: title/excerpt/OG article + `alternates.languages`.

**RSS & sitemap**:
- `/rss.xml` (locale default) + `/id/rss.xml` + `/en/rss.xml` (RSS 2.0 + atom:link self).
  Draft otomatis tersaring oleh `listPosts()`.
- `src/app/sitemap.ts`: semua halaman utama + work slug + blog index & slug per locale,
  dengan `alternates.languages`; `src/app/robots.ts` mendaftarkan sitemap + disallow admin/API.

## 6. Admin (login sederhana, tanpa database)

**Auth model — single password:**
- Env: `BLOG_ADMIN_PASSWORD` (password) + `BLOG_ADMIN_SECRET` (sign cookie).
- `POST /api/admin/login`: timing-safe compare → set cookie httpOnly+secure `rendy_admin`
  = `<expiryMs>.<hmac-sha256>` (expiry 12 jam).
- `GET/POST/DELETE /api/admin/*`: `verifySession()` (signature + expiry, timing-safe) → 401.
- `logout`: hapus cookie.
- Halaman `/[locale]/admin`: `dynamic = "force-dynamic"`, `robots: noindex`; belum login →
  dialog login macOS-style; sesudah → editor (daftar file + form).
- Guard: cookie diverifikasi di **server page + setiap API route** (cukup & tanpa redirect
  loop; baca data admin tidak pernah terjadi sebelum auth).

**Editor (Notes.app-style):**
- Pane kiri: semua file termasuk draft (badge kuning) + tombol "Post baru".
- Pane kanan: form slug, tab bahasa ID/EN, judul, tanggal, excerpt, tags, draft toggle,
  textarea MDX, aksi Simpan/Hapus + link "Lihat di situs" (post published).
- Status save: `backend: "github"` → "commit terkirim, deploy menyusul"; `backend: "fs"` →
  reminder rebuild.

**⚠ Vercel (fs read-only/ephemeral) — keputusan implementasi:**
`savePost()`/`deletePost()` memilih backend otomatis:
- **Ada `GITHUB_TOKEN` + `GITHUB_REPO`** → tulis via GitHub Contents API (PUT/DELETE
  dengan sha), commit ke `GITHUB_BRANCH` (default `main`) → permanen di git → Vercel
  auto-rebuild (post live ~1 menit setelah save).
- **Tanpa itu (lokal dev)** → tulis langsung `fs` ke `src/content/blog/`.
- Env opsional: `GITHUB_BRANCH`, `NEXT_PUBLIC_SITE_URL` (URL absolut RSS/sitemap).

## 7. Urutan implementasi & status

1. **Fondasi**: deps → `src/lib/blog.ts` + 4 post contoh (3 published, 1 draft) → ✅
2. **Halaman publik**: `NotesWindow` → list → reader → mobile single-pane → metadata → ✅
3. **Integrasi site**: dropdown "Blog" di `MenuBar.tsx` (+ props `blogPosts`) → ✅
4. **RSS + sitemap + robots** → ✅
5. **Admin**: auth lib → login/logout/posts API → `AdminGate` (login + editor) →
   `savePost()` fs/GitHub → ✅
6. **Verifikasi**: `npm run check` (lint + typecheck + build) → uji 390/1440 manual,
   uji login salah/benar, draft tidak tampil di publik/RSS, RSS valid, sitemap lengkap.

## 8. Kriteria sukses

- `/{id}/blog` & `/{en}/blog` render SSG, list + reader ala Notes.app, theme terang
  konsisten (putih, shadow lembut, tanpa border keras).
- Mobile 390: single-pane, back navigation berfungsi, tanpa overflow horizontal.
- Artikel per bahasa sesuai route; fallback jelas jika 1 bahasa belum ada.
- Draft tidak tampil di publik, sitemap, maupun RSS.
- `/admin` butuh password; cookie expired 12 jam; salah password → error ala macOS dialog.
- Save dari admin (di Vercel, dengan `GITHUB_TOKEN`) → commit MDX di repo → deploy ulang
  otomatis.
- `/rss.xml` (+ per-locale) valid & `sitemap.ts` mencakup semua slug blog.
- `npm run check` hijau; tidak ada `any`; privasi tetap terjaga (tanpa KTP/NIK/alamat).

## 9. Risiko & catatan

- GitHub API commit butuh token; token hilang → admin tulis gagal (baca lokal tetap jalan).
- Rebuild penuh tiap save post (site kecil, masih murah).
- MDX ditulis admin lewat form (tanpa live preview penuh) — link "Lihat di situs" untuk preview.
- Jika nanti butuh komentar/analytics post, pertimbangkan database — di luar scope sekarang.

## Konfigurasi environment

```bash
# Wajib untuk admin aktif:
BLOG_ADMIN_PASSWORD=...
BLOG_ADMIN_SECRET=...        # minimal 8 char; dev fallback otomatis jika kosong

# Opsional — admin tulis dari Vercel (persisten di git):
GITHUB_TOKEN=ghp_...         # fine-grained PAT, Contents: Read & write
GITHUB_REPO=digia-dev/rendy
GITHUB_BRANCH=main           # default "main"

# Opsional — URL absolut RSS/sitemap:
NEXT_PUBLIC_SITE_URL=https://example.com
```
