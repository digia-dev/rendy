"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { ui, type Locale } from "@/data/site";

/**
 * Aksi di header reader: salin tautan. Ganti bahasa kini lewat pemilih
 * ID/EN di titlebar jendela Notes (BlogLangSwitcher) — berlaku untuk
 * daftar maupun post — sehingga tombol "Baca versi" per-post dihapus
 * agar tidak ganda.
 */
export function PostActions({ locale }: { locale: Locale }) {
  const t = ui.blog;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? t.copied[locale] : t.copyLink[locale]}
        title={copied ? t.copied[locale] : t.copyLink[locale]}
        className="flex items-center gap-1 rounded-md bg-black/[0.055] px-2 py-1 text-[11.5px] font-medium text-neutral-600 transition-colors hover:bg-black/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#28c840]" aria-hidden="true" />
            {t.copied[locale]}
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t.copyLink[locale]}
          </>
        )}
      </button>
    </>
  );
}
