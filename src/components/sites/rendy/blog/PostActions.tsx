"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ui, type Locale } from "@/data/site";

interface Props {
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  /** Post netral (konten sama di semua bahasa) — tombol ganti bahasa disembunyikan. */
  neutral?: boolean;
}

/**
 * Aksi di header reader: ganti bahasa (jika ada terjemahan berbeda) + salin tautan.
 */
export function PostActions({ slug, locale, availableLocales, neutral = false }: Props) {
  const t = ui.blog;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const other: Locale = locale === "id" ? "en" : "id";
  // Post netral: konten identik di semua bahasa — ganti bahasa tidak berguna.
  const canSwitch = !neutral && availableLocales.includes(other);

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
      {canSwitch ? (
        <Link
          href={`/blog/${slug}`}
          locale={other}
          className="rounded-md bg-black/[0.055] px-2 py-1 text-[11.5px] font-medium text-neutral-600 transition-colors hover:bg-black/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          {t.switchLang[locale]} {other === "id" ? "ID" : "EN"}
        </Link>
      ) : null}
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
