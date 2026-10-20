import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ui, type Locale } from "@/data/site";
import { AchievementsGrid } from "@/components/sites/rendy/AchievementsGrid";
import { AboutTxt } from "@/components/sites/rendy/AboutTxt";
import { CertificatesMarquee } from "@/components/sites/rendy/CertificatesMarquee";
import { ContactFooter } from "@/components/sites/rendy/ContactFooter";
import { HeroDesktop } from "@/components/sites/rendy/HeroDesktop";
import { SectionDock } from "@/components/sites/rendy/SectionDock";
import { PillarStack } from "@/components/sites/rendy/PillarStack";
import { PlaygroundDeck } from "@/components/sites/rendy/PlaygroundDeck";
import { PortfolioList } from "@/components/sites/rendy/PortfolioList";

const tz = "Asia/Jakarta";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const now = new Date();
  const todayISO = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(now);
  const dayOfMonth = Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "numeric" }).format(now));
  const weekdayShort = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(now);

  return (
    <main>
      <HeroDesktop locale={l} todayISO={todayISO} />
      {/* Sibling hero (sumber: parent utuh `min-h-screen` + `md:-mt-32 md:h-32`) agar dock sticky span halaman */}
      <SectionDock locale={l} dayOfMonth={dayOfMonth} weekdayShort={weekdayShort} />
      <AchievementsGrid locale={l} />
      <CertificatesMarquee locale={l} />
      <PillarStack locale={l} />
      <PortfolioList locale={l} />
      <PlaygroundDeck locale={l} />
      <AboutTxt locale={l} />
      <ContactFooter locale={l} />
      <p className="sr-only">{ui.navAria[l]}</p>
    </main>
  );
}
