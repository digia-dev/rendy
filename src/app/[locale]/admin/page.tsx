import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ui, type Locale } from "@/data/site";
import { readPostFiles } from "@/lib/blog";
import { isAdminAuthenticated } from "@/lib/admin-session";
import type { AdminLocale } from "@/lib/blog-admin";
import { AdminGate } from "@/components/sites/rendy/blog/AdminGate";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin — Blog",
    robots: { index: false, follow: false },
  };
}

/**
 * Halaman admin blog. Tidak ada sesi → form login (gaya dialog macOS).
 * Ada sesi → editor Notes-style (daftar file + form).
 * Guard di level server; API punya guard sendiri.
 */
export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;

  const authed = await isAdminAuthenticated();
  // Baca daftar file hanya setelah login — tidak ada data yang bocor ke tamu.
  const files = authed ? await readPostFiles() : [];

  const posts = files
    .map((f) => ({
      slug: f.slug,
      // null = file netral (`<slug>.mdx`) yang tampil semua bahasa.
      locale: (f.locale ?? "netral") as AdminLocale,
      title: f.title,
      date: f.date,
      excerpt: f.excerpt,
      tags: f.tags,
      draft: f.draft,
      body: f.body,
    }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

  return (
    <main className="flex min-h-[100svh] items-start justify-center bg-[#f5f5f7] px-3 pt-14 pb-8 md:px-6 md:pt-16">
      {/* Mobile: admin hanya untuk desktop — tampilkan pesan ala dialog macOS. */}
      <div className="mt-6 w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] md:hidden">
        <div className="relative flex items-center justify-center border-b border-black/[0.06] bg-[#f4f4f5] px-3 py-2.5">
          <div className="absolute left-3 flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-center text-[12.5px] font-medium text-neutral-500">
            Blog Admin
          </span>
        </div>
        <div className="flex flex-col items-center px-6 py-7 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f4f5] text-[24px]" aria-hidden="true">
            🖥️
          </div>
          <p className="mt-3.5 text-[15px] font-semibold text-neutral-900">
            {l === "id" ? "Butuh layar desktop" : "Desktop screen required"}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            {ui.blog.adminDesktopOnly[l]}
          </p>
          <Link
            href="/blog"
            className="mt-5 rounded-md bg-black px-3.5 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
          >
            {ui.blog.allPosts[l]}
          </Link>
        </div>
      </div>

      {/* Desktop: editor admin. */}
      <div className="hidden w-full md:block">
        <AdminGate locale={l} authed={authed} initialPosts={posts} />
      </div>
    </main>
  );
}
