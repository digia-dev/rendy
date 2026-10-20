import { ui, type Locale } from "@/data/site";
import { NavGlyph } from "./icons";

const items: {
  key: string;
  glyph: "home" | "folder" | "sparkle" | "heart" | "calendar" | "phone";
  href: string;
  label: { id: string; en: string };
  /** kelas background rounded-square icon (putih untuk home, gradien untuk lainnya). */
  bgCls: string;
}[] = [
  {
    key: "home",
    glyph: "home",
    href: "#top",
    label: { id: "Beranda", en: "Home" },
    bgCls: "border border-black/10 bg-white text-black hover:bg-[#f3f3f3]",
  },
  {
    key: "pillars",
    glyph: "folder",
    href: ui.sectionNav.pillars.href,
    label: ui.sectionNav.pillars.label,
    bgCls: "text-white bg-gradient-to-b from-[#5FB0FF] to-[#2E7CF6]",
  },
  {
    key: "achievements",
    glyph: "sparkle",
    href: ui.sectionNav.achievements.href,
    label: ui.sectionNav.achievements.label,
    bgCls: "text-white bg-gradient-to-b from-[#C489FB] to-[#8231E8]",
  },
  {
    key: "about",
    glyph: "heart",
    href: ui.sectionNav.about.href,
    label: ui.sectionNav.about.label,
    bgCls: "text-white bg-gradient-to-b from-[#FF7A93] to-[#F92D50]",
  },
  {
    key: "booking",
    glyph: "calendar",
    href: ui.sectionNav.booking.href,
    label: ui.sectionNav.booking.label,
    bgCls: "border border-black/10 bg-white text-black",
  },
  {
    key: "contact",
    glyph: "phone",
    href: ui.sectionNav.contact.href,
    label: ui.sectionNav.contact.label,
    bgCls: "text-white bg-gradient-to-b from-[#4FDE73] to-[#1FB84A]",
  },
];

/**
 * Dock navigasi.
 * mode="top"   (desktop, md+): sticky di `top-4`, muncul di area hero & memudar
 *              saat scroll — perilaku asli seperti pada desktop.
 * mode="bottom"(mobile): sticky di `bottom-4`, menempel di bawah viewport,
 *              melintasi konten, dan naik/terangkat ketika menggulir ke footer.
 */
export function SectionDock({
  locale,
  dayOfMonth,
  weekdayShort,
  mode = "top",
}: {
  locale: Locale;
  dayOfMonth: number;
  weekdayShort: string;
  mode?: "top" | "bottom";
}) {
  const wrapCls =
    mode === "top"
      ? "pointer-events-none sticky top-4 z-[60] flex justify-center px-4 py-3 md:flex md:-mt-32 md:h-32 md:items-start md:py-0 hidden"
      : "pointer-events-none sticky bottom-4 z-[60] flex justify-center px-4 pb-2 md:hidden";
  return (
    <div className={wrapCls}>
      <nav
        aria-label={ui.navAria[locale]}
        className="glass-card pointer-events-auto flex items-start gap-2.5 rounded-2xl px-3 pb-2 pt-2"
      >
        {items.map((item, i) => {
          const external = item.href.startsWith("http");
          const label = item.label[locale];
          // Efek hover macOS yang seamless: naik + membesar + cerah, easing smooth.
          const iconCls =
            "flex h-full w-full items-center justify-center overflow-hidden rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[filter,transform,scale,translate,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-110 hover:brightness-110 " +
            item.bgCls;
          return (
            <span key={item.key} className="flex items-start gap-2.5">
              {i === 1 ? (
                <span className="w-px self-start bg-black/15 md:mt-0.5 md:h-8" aria-hidden="true" />
              ) : null}
              <a
                href={item.href}
                title={label}
                aria-label={label}
                {...(external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {})}
                className="relative aspect-square h-10 w-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                {item.glyph === "calendar" ? (
                  <span className={iconCls} data-nav-cal>
                    <span
                      className="flex h-[38%] w-full shrink-0 items-center justify-center px-0.5 text-[6px] font-bold uppercase text-white"
                      style={{ backgroundColor: "#ff3b30", paddingTop: "1px" }}
                    >
                      {weekdayShort}
                    </span>
                    <span className="flex h-[62%] w-full items-center justify-center text-[12px] font-extrabold leading-none text-black" data-nav-day>
                      {dayOfMonth}
                    </span>
                  </span>
                ) : (
                  <span className={iconCls}>
                    <NavGlyph id={item.glyph} />
                  </span>
                )}
              </a>
            </span>
          );
        })}
      </nav>
    </div>
  );
}
