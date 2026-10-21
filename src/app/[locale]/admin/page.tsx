import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/data/site";
import { readPostFiles } from "@/lib/blog";
import { isAdminAuthenticated } from "@/lib/admin-session";
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
      locale: f.locale,
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
      <AdminGate locale={l} authed={authed} initialPosts={posts} />
    </main>
  );
}
