import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ui, workPages, type Locale } from "@/data/site";
import { ContactFooter } from "@/components/sites/rendy/ContactFooter";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(workPages).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = workPages[slug];
  if (!page) return {};
  const l = locale as Locale;

  return {
    title: `${page.title[l]} — ${ui.caseStudy[l]}`,
    description: page.subtitle[l],
  };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = workPages[slug];
  if (!page || !routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const l = locale as Locale;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-[1060px] px-6 py-14">
        <Link
          href="/"
          className="inline-block text-[14px] text-neutral-500 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          {ui.backToHome[l]}
        </Link>

        <article className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
          <div className="flex h-9 items-center gap-2 border-b border-black/10 bg-[#f4f4f5] px-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[13px] text-neutral-600">{`work/${slug}.txt`}</span>
            <span className="w-12" />
          </div>

          <div className="px-8 py-10 md:px-14 md:py-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">{page.label[l]}</p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.1] tracking-[-0.9px] text-black md:text-[40px]">
              {page.title[l]}
            </h1>
            <p className="mt-2 text-[15px] text-neutral-500">{page.subtitle[l]}</p>

            <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
              <div className="flex flex-col gap-4">
                {page.body.map((p, i) => (
                  <p key={i} className="text-[16px] leading-7 text-neutral-700">
                    {p[l]}
                  </p>
                ))}
              </div>

              <div className="overflow-hidden rounded-[10px] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
                <div className="h-[30px] bg-[#f4da71]" />
                <ul className="flex flex-col gap-3.5 px-5 py-5">
                  {page.bullets.map((b) => (
                    <li key={b.en} className="flex gap-2.5 text-[14px] leading-5 text-neutral-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0069d9]" />
                      {b[l]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </article>
      </div>

      <ContactFooter locale={l} />
    </main>
  );
}
