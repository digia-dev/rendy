import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ui, type Locale } from "@/data/site";
import { getAllSlugs, getPost, listPosts } from "@/lib/blog";
import { NotesWindow } from "@/components/sites/rendy/blog/NotesWindow";
import { PostListSidebar } from "@/components/sites/rendy/blog/PostListSidebar";
import { PostReader } from "@/components/sites/rendy/blog/PostReader";
import { PostActions } from "@/components/sites/rendy/blog/PostActions";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const post = await getPost(slug, l);
  if (!post) return {};

  return {
    title: `${post.title} — Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/${l}/blog/${slug}`,
      languages: Object.fromEntries(post.availableLocales.map((al) => [al, `/${al}/blog/${slug}`])),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: l === "id" ? "id_ID" : "en_US",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

/**
 * Halaman artikel — jendela Notes yang sama: daftar kiri (post aktif tersorot),
 * reader MDX di kanan. Mobile: reader penuh + tombol kembali.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const l = locale as Locale;

  // Draft tidak bisa diakses publik.
  const post = await getPost(slug, l);
  if (!post) notFound();

  const posts = await listPosts(l);

  return (
    <main className="flex min-h-[100svh] flex-col items-center bg-[#f5f5f7] px-3 pt-12 pb-6 md:px-6 md:pt-16">
      <div className="w-full max-w-[1180px]">
        <NotesWindow
          locale={l}
          title={`${ui.blog.windowTitle[l]} — ${post.title}`}
          showSidebarOnMobile={false}
          sidebar={<PostListSidebar locale={l} posts={posts} activeSlug={post.slug} />}
        >
          {/* Mobile: tombol kembali ke daftar */}
          <div className="shrink-0 border-b border-black/[0.06] bg-white px-4 pt-3 pb-2 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center text-[13px] font-medium text-neutral-500 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {ui.blog.backToList[l]}
            </Link>
          </div>
          <PostReader
            locale={l}
            post={post}
            toolbarExtra={
              <PostActions
                slug={post.slug}
                locale={l}
                availableLocales={post.availableLocales}
                neutral={post.neutral}
              />
            }
          />
        </NotesWindow>
      </div>
    </main>
  );
}
