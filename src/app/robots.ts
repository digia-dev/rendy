import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Robots: publik boleh di-crawl, area admin & API tidak.
 * Sitemap didaftarkan di sini.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/id/admin", "/en/admin", "/api/"],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
