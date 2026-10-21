import type { MetadataRoute } from "next";
import { folders, type Locale } from "@/data/site";
import { routing } from "@/i18n/routing";
import { listPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site-url";

const LOCALES = routing.locales as readonly Locale[];

/**
 * Sitemap: halaman utama + tiap work slug + halaman blog (index & tiap post)
 * untuk kedua bahasa. Post draft dikeluarkan oleh `listPosts()`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    // Halaman utama
    entries.push({
      url: siteUrl(`/${locale}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languageAlternates(`/${locale}`) },
    });
    entries.push({
      url: siteUrl(`/${locale}/playground`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: languageAlternates(`/${locale}/playground`) },
    });

    // Work
    for (const folder of folders) {
      entries.push({
        url: siteUrl(`/${locale}${folder.href}`),
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: { languages: languageAlternates(folder.href) },
      });
    }

    // Blog index
    entries.push({
      url: siteUrl(`/${locale}/blog`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languageAlternates("/blog") },
    });

    // Tiap post (published only — slug dari file non-draft)
    const posts = await listPosts(locale);
    for (const post of posts) {
      const path = `/blog/${post.slug}`;
      entries.push({
        url: siteUrl(`/${locale}${path}`),
        lastModified: new Date(`${post.date}T00:00:00+07:00`),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}

function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, siteUrl(`/${l}${path}`)]));
}
