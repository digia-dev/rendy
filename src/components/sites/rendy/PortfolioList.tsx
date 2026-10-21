import { Link } from "@/i18n/navigation";
import { experiences, portfolioMeta, type Locale } from "@/data/site";
import { FolderIcon } from "./icons";

/**
 * Daftar portfolio — grid kartu abu terang (bg `#f4f4f5` sedikit abu), masing-masing
 * berisi ikon folder macOS + nama + role + deskripsi; link ke `/work/*`.
 */
export function PortfolioList({ locale }: { locale: Locale }) {
  return (
    <section className="relative z-10 border-t border-black/10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="text-[30px] font-extrabold leading-9 tracking-[-0.75px] text-black">
            {portfolioMeta.title[locale]}
          </h2>
          <p className="text-[14px] text-neutral-500">{portfolioMeta.meta[locale]}</p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/work/${e.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-[#f4f4f5] p-5 transition-colors hover:bg-[#ececee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                    <FolderIcon className="h-8 w-8" />
                  </span>
                  {e.status === "current" ? (
                    <span className="rounded-full bg-[#e8f3ff] px-2 py-0.5 text-[10px] font-medium text-neutral-500 tracking-tight">
                      {locale === "id" ? "kini" : "now"}
                    </span>
                  ) : null}
                </span>

                <span className="mt-4 text-[15px] font-bold text-black group-hover:underline">
                  {e.company}
                </span>
                <span className="mt-0.5 text-[13px] font-medium text-neutral-500">{e.role[locale]}</span>
                <span className="mt-2 text-[13px] leading-5 text-neutral-500">{e.desc[locale]}</span>
                <span className="mt-3 text-[12px] text-neutral-400">{e.period}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
