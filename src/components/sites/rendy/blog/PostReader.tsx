import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import { ui, type Locale } from "@/data/site";
import type { Post } from "@/lib/blog";

interface Props {
  locale: Locale;
  post: Post;
}

/**
 * Styling MDX ala Notes: bersih, hangat, tanpa border kiri.
 * Setiap elemen diberi kelas Tailwind eksplisit (tanpa plugin typography).
 */
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mt-6 mb-3 text-[26px] font-extrabold tracking-[-0.6px] text-black first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-7 mb-2.5 text-[20px] font-bold tracking-[-0.3px] text-black scroll-mt-28" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-5 mb-2 text-[16.5px] font-semibold text-neutral-900 scroll-mt-28" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-3 text-[15.5px] leading-[1.75] text-neutral-700" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-medium text-[#0069d9] underline decoration-[#0069d9]/35 underline-offset-2 transition-colors hover:decoration-[#0069d9]"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-3 flex flex-col gap-1.5 pl-5 text-[15.5px] leading-[1.7] text-neutral-700 [&>li]:relative [&>li]:before:absolute [&>li]:before:-left-5 [&>li]:before:text-[#0069d9]" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-3 flex list-decimal flex-col gap-1.5 pl-5 text-[15.5px] leading-[1.7] text-neutral-700" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="pl-0.5" {...props} />,
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-neutral-900" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="my-4 rounded-xl bg-[#f4f4f5] px-4 py-3 text-[15px] leading-[1.7] text-neutral-600" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-neutral-800" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre className="my-4 overflow-x-auto rounded-xl bg-[#1e1e1e] px-4 py-3.5 text-[13px] leading-relaxed text-neutral-100" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto rounded-xl ring-1 ring-black/[0.07]">
      <table className="w-full border-collapse text-[14px]" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<"thead">) => (
    <thead className="bg-[#f4f4f5] text-left text-[12.5px] uppercase tracking-wide text-neutral-500" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="px-3.5 py-2.5 font-semibold" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border-t border-black/[0.06] px-3.5 py-2.5 text-neutral-700" {...props} />
  ),
  hr: () => <hr className="my-6 border-black/[0.08]" />,
  img: ({ alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-xl shadow-sm" loading="lazy" alt={alt ?? ""} {...props} />
  ),
};

/**
 * Pane kanan: header catatan (judul, meta, aksi) + konten MDX.
 * Menerima `toolbarExtra` untuk tombol aksi client (salin tautan dsb).
 */
export async function PostReader({ locale, post, toolbarExtra }: Props & { toolbarExtra?: ReactNode }) {
  const t = ui.blog;
  const { content } = await compileMDX({
    source: post.body,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
      blockJS: true,
    },
    components: mdxComponents,
  });

  const dateText = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${post.date}T00:00:00`));

  return (
    <>
      {/* Header reader */}
      <header className="shrink-0 border-b border-black/[0.06] bg-white px-5 pt-4 pb-3 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-neutral-400">
            <time dateTime={post.date}>{dateText}</time>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingMinutes} {t.minutes[locale]}
            </span>
            {post.draft ? (
              <span className="rounded bg-[#febc2e]/30 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-[#8a6100]">
                {t.draft[locale]}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">{toolbarExtra}</div>
        </div>
        <h1 className="mt-1.5 text-[26px] font-extrabold leading-[1.15] tracking-[-0.7px] text-black md:text-[30px]">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-neutral-500">{post.excerpt}</p>
        ) : null}
        {post.tags.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-black/[0.055] px-2 py-0.5 text-[11.5px] font-medium text-neutral-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {/* Konten */}
      <article className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-10 md:px-8 md:pt-6">
        <div className="max-w-[680px]">{content}</div>
      </article>
    </>
  );
}
