import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { seo, ui, type Locale } from "@/data/site";
import { listPosts } from "@/lib/blog";
import { NotesWindow } from "@/components/sites/rendy/blog/NotesWindow";
import { PostListSidebar } from "@/components/sites/rendy/blog/PostListSidebar";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;

  const title = l === "id" ? "Blog — Rendy Giantara" : "Blog — Rendy Giantara";
  return {
    title,
    description:
      l === "id"
        ? "Catatan tentang marketing, product, dan karier — ditulis Rendy Giantara."
        : "Notes on marketing, product, and career — written by Rendy Giantara.",
    alternates: {
      canonical: `/${l}/blog`,
      languages: { id: "/id/blog", en: "/en/blog" },
    },
    openGraph: { title, type: "website", locale: l === "id" ? "id_ID" : "en_US" },
  };
}

/**
 * Halaman daftar blog — jendela ala Notes.app:
 * pane kiri daftar + pencarian, pane kanan prompt pilih catatan.
 */
export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  setRequestLocale(locale);
  const l = locale as Locale;

  const posts = await listPosts(l);

  return (
    <main className="flex min-h-[100svh] flex-col items-center bg-[#f5f5f7] px-3 pt-12 pb-6 md:px-6 md:pt-16">
      <div className="w-full max-w-[1180px]">
        <NotesWindow
          locale={l}
          title={`${ui.blog.windowTitle[l]} — ${seo.title[l].split("—")[0].trim()}`}
          showSidebarOnMobile
          sidebar={<PostListSidebar locale={l} posts={posts} />}
        >
          {/* Pane kanan: prompt pilih catatan (desktop) */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-[#fafafa] px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <span className="text-[24px]" aria-hidden="true">
                📝
              </span>
            </div>
            <p className="max-w-[320px] text-[14px] leading-relaxed text-neutral-500">
              {ui.blog.pickPrompt[l]}
            </p>
            <Link
              href="/"
              className="text-[13px] text-neutral-400 underline-offset-2 transition-colors hover:text-neutral-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {ui.backToHome[l]}
            </Link>
          </div>
        </NotesWindow>
      </div>
    </main>
  );
}
