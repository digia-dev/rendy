import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // File MDX blog harus ikut terbundel: halaman admin (force-dynamic) & RSS
  // membaca src/content/blog saat runtime di produksi (Vercel fs read-only).
  outputFileTracingIncludes: {
    "/*": ["src/content/blog/**/*.mdx"],
  },
};

export default withNextIntl(nextConfig);
