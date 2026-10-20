"use client";

import { useEffect, useRef, useState } from "react";
import { profile, ui, type Locale, type L10n } from "@/data/site";

interface Props {
  locale: Locale;
  role: L10n;
  ariaRoleLabel: string;
}

const langs: Record<Locale, string> = {
  id: "Beranda halaman utama ini",
  en: "Landing page for this site",
};

/**
 * Menu bar ala macOS — frosted glass + menu dropdown interaktif.
 * Klik nama/logo membuka menu bergaya macOS (blur, item hover highlight,
 * short separator), tutup saat klik di luar atau Escape.
 */
export function MenuBar({ locale, role, ariaRoleLabel }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // tutup saat klik di luar / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
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

  const menu = (href: string, label: string, sep = false) => (
    <>
      {sep ? <div className="my-1 h-px bg-black/10" /> : null}
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] text-neutral-700 transition-colors hover:bg-[#0069d9] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
      >
        {label}
      </a>
    </>
  );

  return (
    <div
      ref={menuRef}
      className="flex h-7 items-center justify-between overflow-visible border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md"
    >
      <div className="relative flex min-w-0 items-center gap-4 whitespace-nowrap">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={langs[locale]}
          className={`-mx-1 flex items-center gap-1.5 rounded px-1.5 py-0.5 font-semibold text-black/70 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
            open ? "bg-black/5" : ""
          }`}
        >
          {profile.initials}
        </button>
        <span className="hidden text-black sm:inline">{profile.name}</span>
        <span className="hidden text-black/35 sm:inline">{role[locale]}</span>
        <span className="sr-only"> ({ariaRoleLabel})</span>

        {/* dropdown menu macOS */}
        {open ? (
          <div className="absolute left-2 top-7 z-[80] flex w-max flex-col rounded-lg border border-black/10 bg-white/90 py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="px-3 py-1 text-[11px] font-bold text-black/50">{langs[locale]}</div>
            {menu("#top", locale === "id" ? "Tentang saya" : "About me")}
            {menu("/playground", locale === "id" ? "Galeri (playground)" : "Playground")}
            {menu("#contact", locale === "id" ? "Portofolio" : "Portfolio")}
            <div className="my-1 h-px bg-black/10" />
            {menu(`mailto:${profile.email}`, `${locale === "id" ? "Email" : "Email"} — ${profile.email}`)}
            {menu(profile.whatsappUrl, `WhatsApp — ${profile.whatsappDisplay}`)}
            {menu(profile.linkedin, `LinkedIn — ${profile.linkedinHandle}`, true)}
            {menu(profile.instagram, `Instagram — ${profile.instagramHandle}`)}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {/* B1 — CTA kuat di menu bar */}
        <a
          href={profile.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center rounded-full bg-black px-3 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] md:inline-flex"
        >
          {ui.menuCta[locale]}
        </a>
        <div className="shrink-0 tabular-nums" style={{ minWidth: 124 }}>
          <span className="whitespace-nowrap text-right">
            {date}
            <span>&nbsp;&nbsp;{time}</span>
          </span>
        </div>
      </div>
    </div>
  );
}