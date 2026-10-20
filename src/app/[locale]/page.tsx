import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ui, type Locale } from "@/data/site";
import { AchievementsGrid } from "@/components/sites/rendy/AchievementsGrid";
import { AboutTxt } from "@/components/sites/rendy/AboutTxt";
import { CertificatesMarquee } from "@/components/sites/rendy/CertificatesMarquee";
import { ContactFooter } from "@/components/sites/rendy/ContactFooter";
import { FaqSection } from "@/components/sites/rendy/FaqSection";
import { HeroDesktop } from "@/components/sites/rendy/HeroDesktop";
import { SectionDock } from "@/components/sites/rendy/SectionDock";
import { PillarStack } from "@/components/sites/rendy/PillarStack";
import { PlaygroundDeck } from "@/components/sites/rendy/PlaygroundDeck";
import { PortfolioList } from "@/components/sites/rendy/PortfolioList";
import { FloatingMusicMobile } from "@/components/sites/rendy/widgets/FloatingMusic";

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
      {/* Dock navigasi desktop — sticky di atas (perilaku asli md+) */}
      <SectionDock mode="top" locale={l} dayOfMonth={dayOfMonth} weekdayShort={weekdayShort} />
      <AchievementsGrid locale={l} />
      <CertificatesMarquee locale={l} />
      <PillarStack locale={l} />
      <PortfolioList locale={l} />
      <PlaygroundDeck locale={l} />
      <AboutTxt locale={l} />
      {/* C1 — FAQ section, diletakkan di bawah #about */}
      <FaqSection locale={l} />
      {/* Dock navigasi mobile — sticky di bawah, naik saat footer */}
      <SectionDock mode="bottom" locale={l} dayOfMonth={dayOfMonth} weekdayShort={weekdayShort} />
      {/* Floating music (mode mobile) */}
      <div className="md:hidden">
        <FloatingMusicMobile />
      </div>
      <ContactFooter locale={l} />
      <p className="sr-only">{ui.navAria[l]}</p>
    </main>
  );
}
