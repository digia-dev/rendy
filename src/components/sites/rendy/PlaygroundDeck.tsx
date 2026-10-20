import { Link } from "@/i18n/navigation";
import { ui, type Locale } from "@/data/site";

const cards = [
  { color: "#4c9fe8", label: "C" },
  { color: "#edb53c", label: "S" },
  { color: "#8a5cf0", label: "I" },
];

/** Judul display raksasa dengan tumpukan kartu di tengah (sumber: “The [deck] Playground”). */
export function PlaygroundDeck({ locale }: { locale: Locale }) {
  return (
    <section id="playground" className="relative z-10 border-t border-black/10 bg-white px-6 py-24">
      <div className="mx-auto max-w-[1060px] text-center">
        <Link
          href="/playground"
          className="group inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0069d9]"
          aria-label={ui.playground.aria[locale]}
        >
          <span className="text-[clamp(44px,8vw,96px)] font-extrabold leading-none tracking-[-0.04em] text-black">
            {ui.playground.the[locale]}
          </span>

          <span className="relative inline-block h-[100px] w-[176px] align-middle" aria-hidden="true">
            {cards.map((c, i) => (
              <span
                key={c.label}
                className="absolute inset-0 flex items-end justify-start rounded-[14px] p-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  backgroundColor: c.color,
                  transform: `translate(${i * 6}px, ${-i * 6}px) rotate(${(i - 1) * 3}deg)`,
                  zIndex: cards.length - i,
                }}
              >
                <span className="rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-bold text-black">{c.label}</span>
              </span>
            ))}
          </span>

          <span className="text-[clamp(44px,8vw,96px)] font-extrabold leading-none tracking-[-0.04em] text-black">
            {ui.playground.title[locale]}
          </span>
        </Link>

        <p className="mt-6 text-[15px] text-neutral-500">{ui.playground.subtitle[locale]}</p>

        <Link
          href="/playground"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#57a4f0] to-[#3e8fe4] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_14px_rgba(62,143,228,0.35)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          {ui.playground.viewCta[locale]} →
        </Link>
      </div>
    </section>
  );
}
