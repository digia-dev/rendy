"use client";

import { useEffect, useState } from "react";
import type { L10n } from "@/data/site";
import { cn } from "@/lib/utils";

function timeInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { h: get("hour") % 12, m: get("minute"), s: get("second") };
}

function Face({ h, m, s, label, aria }: { h: number; m: number; s: number; label: string; aria: string }) {
  const sec = s * 6;
  const min = m * 6 + s * 0.1;
  const hour = h * 30 + m * 0.5;
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label={`${label} — ${aria}`}>
      {ticks.map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const r = 46;
        const x = 60 + r * Math.cos(rad);
        const y = 60 + r * Math.sin(rad);
        return <circle key={deg} cx={x} cy={y} r={1.4} fill="#9ca3af" />;
      })}
      <line x1="60" y1="60" x2={60 + 24 * Math.cos((hour - 90) * (Math.PI / 180))} y2={60 + 24 * Math.sin((hour - 90) * (Math.PI / 180))} stroke="#111" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2={60 + 34 * Math.cos((min - 90) * (Math.PI / 180))} y2={60 + 34 * Math.sin((min - 90) * (Math.PI / 180))} stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="66" x2={60 + 36 * Math.cos((sec - 90) * (Math.PI / 180))} y2={66 + 36 * Math.sin((sec - 90) * (Math.PI / 180))} stroke="#ff5f1f" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="60" r="2.6" fill="#111" />
      <text x="60" y="76" textAnchor="middle" fontSize="7.5" letterSpacing="1.4" fill="#9ca3af" fontWeight="700">
        {label}
      </text>
    </svg>
  );
}

/** Jam analog kaca — grid sumber: kartu 150×150 (lihat docs/research/elenagonci/page-brief.md). */
export function ClockCard({ label, note, aria }: { label: string; note: L10n; aria: string }) {
  const [t, setT] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => setT(timeInZone(new Date(), "Asia/Jakarta"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const face = t ?? { h: 10, m: 10, s: 0 };

  return (
    <div className="glass-card h-[150px] w-[150px] p-3 max-md:hidden" title={`${label} · ${note.id} (WIB)`}>
      <Face {...face} label={label} aria={aria} />
      <p className="sr-only">
        {note.id} {label}
      </p>
    </div>
  );
}

export { cn };
