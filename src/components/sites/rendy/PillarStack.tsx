import { Link } from "@/i18n/navigation";
import { pillars, ui, type Locale } from "@/data/site";

/**
 * Stack 4 pilar — sumber: baris sticky `md:top-24` menumpuk (z-10..13),
 * radius atas 28px, tab folder bertingkat, jendela berheader kuning.
 */
export function PillarStack({ locale }: { locale: Locale }) {
  return (
    <section id="pillar-stack" className="relative z-10 bg-[#fafafa]">
      {pillars.map((p, i) => (
        <article
          key={p.tab.en}
          className="folder-card relative mx-4 mb-6 md:sticky md:top-24 md:mx-auto md:mb-0 md:max-w-[1240px] md:min-h-[804px]"
          style={{ zIndex: 10 + i }}
        >
          {/* tab folder besar (kiri), ala folder macOS */}
          <div className="folder-tab">
            <div className="folder-tab-shape">
              <span className="folder-tab-label">{p.tab[locale]}</span>
            </div>
          </div>

          {/* body besar off-white */}
          <div className="bg-[#f6f7f9] px-6 pb-16 pt-8 md:min-h-[730px] md:px-10 md:pt-12">
            <div className="mx-auto grid max-w-[1060px] items-start gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  {ui.superpowerLabel[locale]} {ui.noSign}
                  {p.index}
                </p>
                <h2 className="mt-3 text-[30px] font-bold leading-[37.5px] text-black">{p.title[locale]}</h2>
                <p className="mt-4 max-w-[430px] text-[15px] leading-6 text-neutral-500">{p.body[locale]}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {p.ctas.map((cta) => (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      className="rounded-full bg-[#e4e5e8] px-4 py-2.5 text-[13px] font-semibold text-[#4a4a50] transition-colors hover:bg-[#d9dade] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                    >
                      {cta.label[locale]} →
                    </Link>
                  ))}
                </div>
              </div>

              {/* jendela metrik */}
              <div className="overflow-hidden rounded-[10px] bg-white/70 ring-1 ring-black/5">
                <div className="h-[30px] bg-[#f4da71]/80" />
                <ul className="flex flex-col gap-4 px-5 py-5">
                  {p.stats.map((s) => (
                    <li key={s.title.en}>
                      <p className="text-[14px] font-bold text-black">{s.title[locale]}</p>
                      <p className="mt-0.5 text-[14px] leading-5 text-neutral-500">{s.desc[locale]}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
