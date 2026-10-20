# Page Brief — /playground (elenagonci.com)

Inspeksi: 20 Okt 2026, Playwright, viewport 1440×900 & 390×844.
Halaman satu-layar (scrollHeight 900) dengan terminal interaktif overlay.

## Urutan / struktur

1. **Menu/nav**: home link kecil di kiri-atas (`← Back to home`); tidak ada nav-dock sticky
   (berbeda dari beranda).
2. **Label** `PLAYGROUND` (11px, uppercase, spasi huruf lebar) + **H1**
   "Old work, side projects & earlier gigs." (36px, weight 700) + **subtitle** (abu, ~15px).
3. Kolom kiri berisi label/H1/subtitle; **catatan personal** (15px) di sisi kanan bawah.
4. **Terminal window** (overlay `fixed left-1/2 top-1/2 z-[70]`, 470×380, radius 12,
   bg gelap `#1c1c24/95`, border white/10, monospace 13px).

## Terminal macam zsh

- **Titlebar** (`h-10`, bg `#2a2b33`, border-b white/10, draggable `cursor-grab`):
  3 lampu — merah `#ff5f57` (tombol tutup), kuning `#febc2e`, hijau `#28c840`; judul tengah
  `visitor@<host> — zsh — 80×24` (text-xs white/50).
- **Prompt**: `visitor@<host>` hijau `#4FDE73` + `~ %` putih/45 + input transparan.
- **Shell**: `rendy-5 shell. Ask anything about Rendy, or type \`help\`.` +
  `Last login: just now on ttys001`.
- **Perintah**: `help` · `ls` · `cat contact.txt` · `whoami` · `clear` · `exit`; selain itu
  diteruskan ke AI (Claude/ChatGPT — sama dengan link "Ask" di dock).
- `ls` → `case-studies/  playground/  press/  contact.txt  resume.pdf`
- `cat contact.txt` → kontak Rendy: email, whatsapp, linkedin, instagram.

## Reproduksi (proyek Rendy)

- Route lokal: `src/app/[locale]/playground/page.tsx` → `/id/playground` & `/en/playground`.
- Terminal: `src/components/sites/rendy/PlaygroundTerminal.tsx`.
- Tombol menu dari beranda: section `PlaygroundDeck` kini menautkan ke `/playground`
  (judul deck + CTA "View Playground →").
- Konten & perintah diterjemahkan ke kontak/fakta Rendy (PRD §5/§7); identitas person =
  Rendy, bukan Elena.
- Font terminal monospace sistem (`ui-monospace, Menlo, Monaco...`); tidak memakai aset PNG/code
  source; digambar dengan data lokal.