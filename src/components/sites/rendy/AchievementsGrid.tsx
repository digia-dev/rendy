import { achievements, ui, type Locale } from "@/data/site";
import { AchievementGlyph } from "./icons";

/** Terangkan warna hex sebesar `amount` (0..1) untuk gradien atas ikon (gaya sumber). */
function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 255) + Math.round(255 * amount));
  const g = Math.min(255, ((n >> 8) & 255) + Math.round(255 * amount));
  const b = Math.min(255, (n & 255) + Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

/** Grid pencapaian — sumber: 5 kartu, ikon aplikasi 72px di kartu abu (page-brief §3). */
export function AchievementsGrid({ locale }: { locale: Locale }) {
  return (
    <section id="achievements" className="relative z-10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <h2 className="text-[30px] font-extrabold leading-9 tracking-[-0.75px] text-black">
          {ui.headings.achievements[locale]}
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {achievements.map((a) => (
            <li key={a.title.en} className="flex flex-col">
              <div className="flex h-[144px] items-center justify-center rounded-2xl bg-[#f4f4f5]">
                <span
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-[22%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_6px_14px_rgba(0,0,0,0.22)]"
                  style={{ background: `linear-gradient(to bottom, ${lighten(a.color, 0.28)}, ${a.color})` }}
                >
                  <AchievementGlyph id={a.icon} />
                </span>
              </div>
              <p className="mt-4 text-[15px] font-bold leading-snug text-black">{a.title[locale]}</p>
              <p className="mt-1 text-[14px] leading-[19px] text-neutral-500">{a.desc[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
