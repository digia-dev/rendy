import { buildRss } from "@/lib/rss";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/data/site";

export const runtime = "nodejs";

/**
 * Feed RSS per-locale: `/id/rss.xml` & `/en/rss.xml`.
 * (Proxy matcher mengecualikan path bertitik, jadi route ini langsung dicocokkan
 * Next tanpa rewrite i18n.)
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return new Response("Not found", { status: 404 });
  }
  const xml = await buildRss(locale as Locale);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
