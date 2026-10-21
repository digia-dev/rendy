"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ui, type Locale } from "@/data/site";
import type { PostMeta } from "@/lib/blog";

interface Props {
  locale: Locale;
  posts: PostMeta[];
  /** Slug yang sedang dibuka (ditandai selected ala Notes). */
  activeSlug?: string;
}

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Daun kiri ala Notes.app: kotak pencarian + baris catatan
 * (judul, tanggal, cuplikan). Post terpilih mendapat sorotan abu ala Notes.
 */
export function PostListSidebar({ locale, posts, activeSlug }: Props) {
  const [query, setQuery] = useState("");
  const t = ui.blog;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [posts, query]);

  const fmt = (iso: string) => formatDate(iso, locale);

  return (
    <>
      {/* Pencarian */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder[locale]}
          aria-label={t.searchPlaceholder[locale]}
          className="w-full rounded-md bg-black/[0.055] px-2.5 py-1.5 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-[#0069d9]/40 focus:outline-none"
        />
      </div>

      {/* Daftar post */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3" aria-label={t.windowTitle[locale]}>
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center text-[13px] leading-relaxed text-neutral-400">
            {posts.length === 0 ? t.emptyState[locale] : t.noResults[locale]}
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {filtered.map((p) => {
              const active = p.slug === activeSlug;
              const isDraft = p.draft;
              const fallback = p.sourceLocale !== locale;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className={`block rounded-lg px-2.5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
                      active ? "bg-[#e8e8ed]" : "hover:bg-black/[0.045]"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13.5px] font-semibold text-neutral-900">
                        {p.title}
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-neutral-400">
                        {fmt(p.date)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-neutral-500">
                      {p.excerpt}
                    </p>
                    {isDraft || fallback ? (
                      <div className="mt-1 flex gap-1.5">
                        {isDraft ? (
                          <span className="rounded bg-[#febc2e]/30 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-[#8a6100]">
                            {t.draft[locale]}
                          </span>
                        ) : null}
                        {fallback ? (
                          <span className="rounded bg-black/[0.06] px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                            {t.onlyIn[locale]} {p.sourceLocale === "id" ? "ID" : "EN"}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </>
  );
}
