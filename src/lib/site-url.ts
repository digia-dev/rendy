/**
 * URL absolut untuk RSS, sitemap, dan OG.
 * Prioritas: NEXT_PUBLIC_SITE_URL → domain Vercel → localhost (dev).
 */
export function siteUrl(path = "/"): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const clean = base.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${clean}${suffix}`;
}
