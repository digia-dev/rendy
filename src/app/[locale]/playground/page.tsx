import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ui, type Locale } from "@/data/site";
import { PlaygroundTerminal } from "@/components/sites/rendy/PlaygroundTerminal";
import { ContactFooter } from "@/components/sites/rendy/ContactFooter";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return {
    title: `${ui.playgroundPage.title[l]} — Rendy Giantara`,
    description: ui.playgroundPage.subtitle[l],
  };
}

export default async function PlaygroundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const pg = ui.playgroundPage;

  return (
    <main className="relative min-h-screen bg-white">
      {/* Back to home */}
      <div className="mx-auto max-w-[1060px] px-6 pt-6">
        <Link
          href="/"
          className="inline-block text-[14px] font-medium text-neutral-500 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          ← {ui.backToHome[l]}
        </Link>
      </div>

      <div className="relative z-[5] mx-auto max-w-[1060px] min-h-[70vh] px-6 pb-24 pt-10 md:grid md:grid-cols-2 md:gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0069d9]">{pg.label[l]}</p>
          <h1 className="mt-3 max-w-3xl text-[36px] font-bold leading-tight tracking-[-0.5px] text-black">
            {pg.title[l]}
          </h1>
          <p className="mt-3 max-w-[460px] text-[16px] leading-6 text-neutral-500">{pg.subtitle[l]}</p>
        </div>

        {/* Catatan personal — kanan bawah, seperti sumber */}
        <div className="mt-10 max-w-[300px] md:self-end md:mt-0 md:justify-self-end md:pb-8">
          <p className="text-[15px] leading-7 text-neutral-700">{pg.note[l]}</p>
          <p className="mt-4 text-[15px] font-semibold text-black">{pg.noteSig[l]}</p>
        </div>
      </div>

      {/* Terminal interaktif (window overlay) */}
      <PlaygroundTerminal locale={l} />

      <ContactFooter locale={l} />
    </main>
  );
}