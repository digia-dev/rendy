import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/data/site";

/** Folder sumber konten blog (dibaca saat build/SSG — sama seperti gallery.ts). */
export const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

const LOCALES: readonly Locale[] = ["id", "en"];

export interface PostFrontmatter {
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags: string[];
  draft: boolean;
  cover?: string;
}

/** Metadata untuk list/RSS/sitemap (tanpa body). */
export interface PostMeta extends PostFrontmatter {
  slug: string;
  /**
   * true = post memakai file netral (`<slug>.mdx`) yang tampil di semua bahasa;
   * false = post punya file per-bahasa (`<slug>.<locale>.mdx`).
   */
  neutral: boolean;
  /** Bahasa yang tersedia untuk slug ini. */
  availableLocales: Locale[];
  readingMinutes: number;
  url: string;
}

/** Post lengkap (metadata + body MDX). */
export interface Post extends PostMeta {
  body: string;
}

interface RawFile extends PostFrontmatter {
  slug: string;
  /** null = file netral (`<slug>.mdx`) yang dipakai semua locale. */
  locale: Locale | null;
  body: string;
}

/**
 * `hello.id.mdx` → { slug: "hello", locale: "id" }
 * `hello.mdx`    → { slug: "hello", locale: null } (netral — tampil semua bahasa)
 * null jika bukan pola yang dikenal.
 */
function parseName(name: string): { slug: string; locale: Locale | null } | null {
  if (!name.toLowerCase().endsWith(".mdx")) return null;
  const base = name.slice(0, -4);
  for (const locale of LOCALES) {
    if (base.endsWith(`.${locale}`)) {
      const slug = base.slice(0, -(locale.length + 1));
      if (slug.length > 0) return { slug, locale };
    }
  }
  // Tanpa suffix bahasa → netral (tampil di semua locale).
  if (base.length > 0 && !base.includes(".")) return { slug: base, locale: null };
  return null;
}

/**
 * js-yaml mem-parse `date: 2026-10-15` (tanpa kutip) jadi objek Date —
 * normalisasi kembali ke string `YYYY-MM-DD` agar konsisten untuk sort/meta.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const m = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
  }
  return "2026-01-01";
}

function normalizeFm(data: Record<string, unknown>, fallbackTitle: string): PostFrontmatter {
  const str = (v: unknown, fb: string) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : fb);
  return {
    title: str(data.title, fallbackTitle),
    date: normalizeDate(data.date),
    excerpt: str(data.excerpt, ""),
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [],
    draft: data.draft === true,
    ...(typeof data.cover === "string" && data.cover.length > 0 ? { cover: data.cover } : {}),
  };
}

/** Estimasi waktu baca (kata/200 wpm, minimal 1 menit). */
function readingMinutesOf(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Baca semua file `.mdx` (termasuk draft) dari src/content/blog. */
export async function readPostFiles(): Promise<RawFile[]> {
  let names: string[];
  try {
    names = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const files: RawFile[] = [];
  for (const name of names) {
    const parsed = parseName(name);
    if (!parsed) continue;
    const source = await fs.readFile(path.join(BLOG_DIR, name), "utf8");
    const { data, content } = matter(source);
    const fm = normalizeFm(data, parsed.slug);
    files.push({ ...fm, slug: parsed.slug, locale: parsed.locale, body: content });
  }
  return files;
}

function toMeta(
  slug: string,
  neutral: boolean,
  availableLocales: Locale[],
  fm: PostFrontmatter,
  body: string,
): PostMeta {
  return {
    ...fm,
    slug,
    neutral,
    availableLocales,
    readingMinutes: readingMinutesOf(body),
    url: `/${slug}`,
  };
}

/**
 * Daftar post untuk satu locale, terbaru dulu.
 * - Draft disertakan hanya jika `includeDrafts` (dipakai halaman admin).
 * - Resolusi per slug: file `<slug>.<locale>.mdx` > netral `<slug>.mdx` >
 *   file bahasa lain (post lama single-bahasa tetap tampil).
 */
export async function listPosts(
  locale: Locale,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<PostMeta[]> {
  const files = await readPostFiles();
  const bySlug = new Map<string, RawFile[]>();
  for (const f of files) {
    const list = bySlug.get(f.slug) ?? [];
    list.push(f);
    bySlug.set(f.slug, list);
  }

  const posts: PostMeta[] = [];
  for (const [slug, list] of bySlug) {
    const published = list.filter((f) => includeDrafts || !f.draft);
    if (published.length === 0) continue;

    const exact = published.find((f) => f.locale === locale);
    const neutral = published.find((f) => f.locale === null);
    const chosen = exact ?? neutral ?? published[0];
    posts.push(
      toMeta(
        slug,
        chosen.locale === null,
        availableLocalesOf(published, chosen),
        chosen,
        chosen.body,
      ),
    );
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/**
 * Bahasa yang tersedia untuk satu post:
 * - File netral → semua locale (konten tampil sama di ID & EN).
 * - Selain itu → gabungan locale file per-bahasa; file netral pendamping juga
 *   menutupi locale yang belum punya terjemahan.
 */
function availableLocalesOf(list: RawFile[], chosen: RawFile): Locale[] {
  if (chosen.locale === null) return [...LOCALES];
  return [...LOCALES].filter((l) => list.some((f) => f.locale === l || f.locale === null));
}

/** Ambil satu post lengkap (metadata + body). Null jika tidak ada / draft saat non-admin. */
export async function getPost(
  slug: string,
  locale: Locale,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const files = await readPostFiles();
  const list = files.filter((f) => f.slug === slug && (includeDrafts || !f.draft));
  if (list.length === 0) return null;

  const exact = list.find((f) => f.locale === locale);
  const neutral = list.find((f) => f.locale === null);
  const chosen = exact ?? neutral ?? list[0];
  return {
    ...toMeta(slug, chosen.locale === null, availableLocalesOf(list, chosen), chosen, chosen.body),
    body: chosen.body,
  };
}

/**
 * Semua slug yang punya setidaknya satu post published (untuk generateStaticParams).
 * Draft-only sengaja dikecualikan agar tidak ter-prerender ke publik.
 */
export async function getAllSlugs(): Promise<string[]> {
  const files = await readPostFiles();
  return [...new Set(files.filter((f) => !f.draft).map((f) => f.slug))].sort();
}
