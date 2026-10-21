import { Link } from "@/i18n/navigation";
import { folders, hero, profile, ui, widgets, type Locale } from "@/data/site";
import { FolderIcon } from "./icons";
import { MenuBar } from "./MenuBar";
import { Draggable } from "./Draggable";
import { DockApps } from "./widgets/DockApps";
import { CalendarCard } from "./widgets/CalendarCard";
import { ClockCard } from "./widgets/ClockCard";
import { MusicCard, PhotoCard } from "./widgets/StaticCards";
import { WeatherCard } from "./widgets/WeatherCard";
import { readGalleryDir } from "@/lib/gallery";
import { listPosts } from "@/lib/blog";

interface Props {
  locale: Locale;
  todayISO: string;
}

function FolderLink({ href, label, aria }: { href: string; label: string; aria: string }) {
  return (
    <Link
      href={href}
      className="group flex w-20 flex-col items-center gap-1 rounded-lg p-1 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
      aria-label={aria}
    >
      <FolderIcon className="h-14 w-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]" />
      <span className="whitespace-nowrap text-center text-[11.5px] leading-tight text-neutral-700 group-hover:text-black max-md:whitespace-normal">
        {label}
      </span>
    </Link>
  );
}

export async function HeroDesktop({ locale, todayISO }: Props) {
  // Baca galeri dari folder public/sites/rendy/gallery (otomatis, tanpa daftar).
  const gallery = await readGalleryDir();
  // 3 post blog terbaru untuk dropdown MenuBar.
  const blogPosts = (await listPosts(locale)).slice(0, 3).map((p) => ({ slug: p.slug, title: p.title }));
  return (
    <section
      id="top"
      className="relative z-0 flex min-h-[100svh] w-full flex-col bg-white pt-8 md:sticky md:top-0 md:h-[100svh]"
    >
      <MenuBar locale={locale} role={profile.role} ariaRoleLabel={ui.menuRole[locale]} blogPosts={blogPosts} />
      {/* A2 — tekstur radial dot halus di latar hero */}
      <div className="bg-dots absolute inset-0 opacity-[0.45] -z-10" aria-hidden="true" />
      {/* ===================================================== desktop canvas */}
      <div className="relative hidden flex-1 bg-white md:block">
        <Draggable id="clock" initial={{ top: 70, left: 24 }}>
          <ClockCard label={widgets.clocks[0].label} note={widgets.clocks[0].note} aria={ui.clockAria[locale]} />
        </Draggable>
        <Draggable id="music" initial={{ top: 70, left: 195 }}>
          <MusicCard />
        </Draggable>

        <Draggable id="calendar" initial={{ top: 244, left: 24 }}>
          <CalendarCard
            locale={locale}
            todayISO={todayISO}
            hint={widgets.calendar.mobileHint}
            ariaLabel={ui.bookingTitle[locale]}
          />
        </Draggable>
        <Draggable id="weather" initial={{ top: 244, left: 195 }}>
          <WeatherCard
            city={widgets.weather.city}
            locale={locale}
            lat={widgets.weather.lat}
            lon={widgets.weather.lon}
            dayLabels={ui.weatherDay[locale]}
            errorLabel={ui.weatherError[locale]}
          />
        </Draggable>

        <Draggable id="photo" initial={{ top: 404, left: 24 }}>
          <PhotoCard locale={locale} alt={`${profile.name} — ${profile.role[locale]}`} photos={gallery} />
        </Draggable>

        <nav
          className="absolute right-6 top-[70px] flex flex-col items-center gap-2"
          aria-label={ui.navAria[locale]}
        >
          {folders.map((f, i) => (
            <Draggable key={f.slug} id={`folder-${f.slug}`} inFlow z={10 + i}>
              <FolderLink href={f.href} label={f.label[locale]} aria={f.label[locale]} />
            </Draggable>
          ))}
        </nav>

        {/* Hero heading & subtitle — terpusat sempurna via flex (sama seperti sumber) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="max-w-[760px]">
            <h1 className="mt-4 text-[48px] font-extrabold leading-[1.05] tracking-[-1.2px] text-black">
              {hero.line1[locale]}
              <br />
              {hero.line2Prefix[locale]}
              <br />
              {hero.line2Suffix[locale]}{" "}
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-[6px] hover:text-[#0069d9] pointer-events-auto"
              >
                {hero.line2LinkText[locale]}
              </a>
              .
            </h1>
            <p className="mx-auto mt-5 max-w-[540px] text-[18px] leading-7 text-neutral-500">{hero.subtitle[locale]}</p>
          </div>
        </div>

        <Draggable id="dock" initial={{ bottom: 112, right: 48 }} z={15}>
          <DockApps />
        </Draggable>
      </div>

      {/* ====================================================== mobile canvas */}
      <div className="flex flex-col gap-6 rounded-b-3xl bg-[#fafafa] px-4 pb-6 pt-4 md:hidden">
        <div className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <h1 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.8px] text-black">
            {hero.line1[locale]}
            <br />
            {hero.line2Prefix[locale]}
            <br />
            {hero.line2Suffix[locale]}{" "}
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-2 underline-offset-[6px]"
            >
              {hero.line2LinkText[locale]}
            </a>
            .
          </h1>
          <p className="mt-4 text-[15px] leading-6 text-neutral-500">{hero.subtitle[locale]}</p>
        </div>

        <div className="flex gap-4">
          <CalendarCard
            locale={locale}
            todayISO={todayISO}
            hint={widgets.calendar.mobileHint}
            ariaLabel={ui.bookingTitle[locale]}
          />
          <PhotoCard
            locale={locale}
            alt={`${profile.name} — ${profile.role[locale]}`}
            photos={gallery}
          />
        </div>

        <nav className="grid grid-cols-4 gap-3" aria-label={ui.navAria[locale]}>
          {folders.map((f) => (
            <FolderLink key={f.slug} href={f.href} label={f.label[locale]} aria={f.label[locale]} />
          ))}
        </nav>

        <DockApps />
      </div>
    </section>
  );
}
