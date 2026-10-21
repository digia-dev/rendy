import { buildRss } from "@/lib/rss";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";

/**
 * `/rss.xml` — feed utama (locale default). Feed per-bahasa:
 * `/id/rss.xml` & `/en/rss.xml`.
 * Draft otomatis tersaring oleh `listPosts()`.
 */
export async function GET() {
  const xml = await buildRss(routing.defaultLocale);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
