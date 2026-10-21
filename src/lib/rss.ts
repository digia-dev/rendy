import { listPosts } from "./blog";
import { siteUrl } from "./site-url";
import { seo, type Locale } from "@/data/site";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Bangun feed RSS 2.0 untuk satu locale (post published saja — draft dikeluarkan
 * oleh listPosts secara default).
 */
export async function buildRss(locale: Locale): Promise<string> {
  const posts = await listPosts(locale);
  const channelTitle = `${seo.title[locale]} — Blog`;
  const channelDesc =
    locale === "id"
      ? "Catatan tentang marketing, product, dan karier oleh Rendy Giantara."
      : "Notes on marketing, product, and career by Rendy Giantara.";
  const channelLink = siteUrl(`/${locale}/blog`);
  const feedLink = siteUrl(`/${locale}/rss.xml`);

  const items = posts
    .map((p) => {
      const link = siteUrl(`/${locale}/blog/${p.slug}`);
      const pubDate = new Date(`${p.date}T00:00:00+07:00`).toUTCString();
      const categories = p.tags
        .map((tag) => `      <category>${esc(tag)}</category>`)
        .join("\n");
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(p.excerpt)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(channelTitle)}</title>
    <link>${esc(channelLink)}</link>
    <description>${esc(channelDesc)}</description>
    <language>${locale === "id" ? "id-id" : "en-us"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${esc(feedLink)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
