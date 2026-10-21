"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { type Locale } from "@/data/site";

const LOCALES: readonly Locale[] = ["id", "en"];

/**
 * Pemilih bahasa ala segmented control macOS (ID | EN) di titlebar jendela
 * Notes. Berganti locale tanpa mengubah path: post netral menyajikan file
 * yang sama untuk kedua bahasa, jadi halaman/post yang sedang dibuka ikut
 * berpindah bahasa chrome-nya.
 */
export function BlogLangSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={locale === "id" ? "Pilih bahasa" : "Choose language"}
      className="flex items-center gap-0.5 rounded-md bg-black/[0.06] p-0.5"
    >
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0069d9] ${
            l === locale
              ? "bg-white text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
