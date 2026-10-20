import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";
import type { L10n } from "@/data/site";

interface Props {
  city: L10n;
  locale: "id" | "en";
  lat: number;
  lon: number;
  dayLabels: readonly string[];
  errorLabel: string;
}

interface Forecast {
  current?: { temperature_2m: number; weather_code: number };
  daily?: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] };
}

function Icon({ code, className }: { code: number; className?: string }) {
  const props = { className, strokeWidth: 1.8 };
  if (code === 0) return <Sun {...props} />;
  if (code <= 2) return <CloudSun {...props} />;
  if (code === 3) return <Cloud {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain {...props} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
  if (code >= 95) return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

/**
 * Widget cuaca live (OQ-10: Jakarta Selatan) — Open-Meteo, tanpa API key, cache 1 jam.
 * Server component; gagal → label kosong tanpa merusak layout.
 */
export async function WeatherCard({ city, locale, lat, lon, dayLabels, errorLabel }: Props) {
  let data: Forecast | null = null;
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FJakarta&forecast_days=6`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) data = (await res.json()) as Forecast;
  } catch {
    data = null;
  }

  const days = data?.daily?.time ?? [];
  const codes = data?.daily?.weather_code ?? [];
  const max = data?.daily?.temperature_2m_max ?? [];
  const min = data?.daily?.temperature_2m_min ?? [];

  return (
    <div className="glass-card h-[108px] w-[320px] px-4 py-3 max-md:hidden" aria-live="polite">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-neutral-700">{city[locale]}</p>
        {data?.current ? (
          <p className="text-[12px] font-bold text-neutral-800">{Math.round(data.current.temperature_2m)}°</p>
        ) : (
          <p className="text-[12px] text-neutral-400">{errorLabel}</p>
        )}
      </div>

      <div className="mt-1 flex items-start justify-between">
        {days.slice(1, 7).map((_, i) => {
          const idx = i + 1;
          const date = new Date(`${days[idx]}T12:00:00`);
          return (
            <div key={days[idx]} className="flex w-11 flex-col items-center gap-0.5">
              <span className="text-[9px] text-neutral-500">{dayLabels[date.getDay()]}</span>
              <Icon code={codes[idx]} className="h-4 w-4 text-amber-400" />
              <span className="text-[9px] font-semibold text-neutral-700">{Math.round(max[idx])}°</span>
              <span className="text-[8px] text-neutral-400">{Math.round(min[idx])}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
