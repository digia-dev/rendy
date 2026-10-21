import { certificates, ui, type Locale } from "@/data/site";

/**
 * Marquee sertifikat — menggantikan section “In the press” (tidak ada data press).
 * Animasi identik dengan sumber: 96s linear infinite (page-brief §perilaku).
 */
export function CertificatesMarquee({ locale }: { locale: Locale }) {
  return (
    <section className="relative z-10 overflow-hidden bg-white pb-16 pt-8">
      <div className="mx-auto max-w-[1060px] px-6">
        <h2 className="text-center text-[30px] font-extrabold leading-9 tracking-[-0.75px] text-black">
          {ui.headings.certificates[locale]}
        </h2>
      </div>

      <div className="marquee mt-6 overflow-hidden">
        <div className="marquee-track flex w-max py-2">
          {[0, 1].map((group) => (
            <ul key={group} className="flex w-max gap-4 pr-4" aria-hidden={group === 1 || undefined}>
              {certificates.map((c) => (
                <li
                  key={`${c.name.en}-${group}`}
                  className="flex w-[236px] shrink-0 flex-col rounded-xl border border-black/10 bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[11px] font-semibold text-neutral-500 tracking-tight">
                      {c.period[locale]}
                    </span>
                  </span>
                  <p className="mt-3 text-[15px] font-bold leading-[19px] text-black">{c.name[locale]}</p>
                  <p className="mt-2 text-[13px] leading-4 text-neutral-500">{c.company[locale]}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
