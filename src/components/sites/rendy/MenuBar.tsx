"use client";

import { useEffect, useRef, useState } from "react";
import { profile, ui, type Locale, type L10n } from "@/data/site";

interface Props {
  locale: Locale;
  role: L10n;
  ariaRoleLabel: string;
}

interface DropItem {
  href: string;
  label: string;
  sep?: boolean;
}

/**
 * Menu bar ala macOS (rekreasi Hamza "QuantumOS"):
 * Bar tipis `h-8` frosted glass (blur) di atas; kiri = logo + menu item dengan
 * dropdown bergaya macOS, kanan = jam. Konten tetap mengikuti data profil.
 */
export function MenuBar({ locale, role, ariaRoleLabel }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const start = setTimeout(tick, 100);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, []);

  const date = now
    ? new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
        timeZone: "Asia/Jakarta",
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now)
    : "";
  const time = now
    ? new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "numeric", minute: "2-digit", hour12: true })
        .format(now)
        .replace(/\s+/g, " ")
    : "";

  // Menunya: navigasi section + kontak, bergaya macOS dropdown.
  const menus: { key: string; label: string; items: DropItem[] }[] = [
    {
      key: "tentang",
      label: locale === "id" ? "Tentang" : "About",
      items: [
        { href: "#top", label: locale === "id" ? "Tentang saya" : "About me" },
        { href: "#about", label: locale === "id" ? "Riwayat" : "History" },
        { href: "#contact", label: locale === "id" ? "Portofolio" : "Portfolio" },
      ],
    },
    {
      key: "galeri",
      label: locale === "id" ? "Galeri" : "Gallery",
      items: [
        { href: "/playground", label: locale === "id" ? "Buka galeri" : "Open gallery" },
        { href: "#top", label: locale === "id" ? "Pengesahan" : "Showcase" },
      ],
    },
    {
      key: "kontak",
      label: locale === "id" ? "Kontak" : "Contact",
      items: [
        { href: `mailto:${profile.email}`, label: `${locale === "id" ? "Email" : "Email"} — ${profile.email}` },
        { href: profile.whatsappUrl, label: `WhatsApp — ${profile.whatsappDisplay}` },
        { href: profile.linkedin, label: `LinkedIn — ${profile.linkedinHandle}`, sep: true },
        { href: profile.instagram, label: `Instagram — ${profile.instagramHandle}` },
      ],
    },
  ];

  return (
    <header
      ref={barRef}
      className="fixed left-0 right-0 top-0 z-[60] h-8 border-b border-black/10 bg-white/70 text-neutral-700 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 text-sm">
        <nav className="flex min-w-0 items-center gap-1" aria-label={ui.navAria[locale]}>
          {/* Logo/inisial — klik ke atas */}
          <a
            href="#top"
            aria-label={profile.name}
            className="mx-1 flex h-5 w-5 items-center justify-center rounded-md bg-black/10 text-[10px] font-extrabold text-neutral-800 transition-colors hover:bg-black/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
          >
            {profile.initials}
          </a>

          {/* Nama + peran (desktop) */}
          <span className="ml-1 hidden font-semibold text-neutral-800 sm:inline">{profile.name}</span>
          <span className="ml-2 hidden font-medium text-neutral-500 lg:inline">{role[locale]}</span>
          <span className="sr-only"> ({ariaRoleLabel})</span>

          {/* Menu item + dropdown ala macOS */}
          {menus.map((m) => (
            <MenuDropMenu key={m.key} label={m.label} items={m.items} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={profile.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center rounded-md bg-black px-2.5 py-1 text-[12px] font-semibold text-white transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] md:inline-flex"
          >
            {ui.menuCta[locale]}
          </a>
          <div className="shrink-0 whitespace-nowrap tabular-nums text-[12px] font-medium tracking-wide text-neutral-600">
            {date ? (
              <>
                {date}
                <span className="ml-2">{time}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuDropMenu({ label, items }: { label: string; items: DropItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`rounded px-2.5 py-0.5 font-medium text-neutral-700 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
          open ? "bg-black/10" : ""
        }`}
      >
        {label}
      </button>
      {open ? (
        <div
          className="absolute left-0 top-8 z-[80] w-max min-w-[200px] rounded-lg border border-black/10 bg-white/90 py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          style={{ transformOrigin: "top" }}
        >
          {items.map((it, idx) => (
            <div key={idx}>
              {it.sep ? <hr className="my-1 border-black/10" /> : null}
              <a
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="block whitespace-nowrap px-3 py-1.5 text-[13px] text-neutral-700 transition-colors hover:bg-[#0069d9] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                {it.label}
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}