"use client";

import { useEffect, useState } from "react";
import { profile, type Locale, type L10n } from "@/data/site";

/** Menu bar ala macOS (bukan fixed — mengikuti sumber). Tanggal/jam live WIB. */
export function MenuBar({ locale, role, ariaRoleLabel }: { locale: Locale; role: L10n; ariaRoleLabel: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const start = setTimeout(tick, 100);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, []);

  const date = now
    ? new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
        timeZone: "Asia/Jakarta",
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(now)
    : "";
  const time = now
    ? new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "numeric", minute: "2-digit", hour12: true })
        .format(now)
        .replace(/\s+/g, " ")
    : "";

  return (
    <div className="flex h-7 items-center justify-between overflow-hidden border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-4 whitespace-nowrap">
        <span className="font-semibold text-black/70">{profile.initials}</span>
        <span className="hidden text-black sm:inline">{profile.name}</span>
        <span className="hidden text-black/35 sm:inline">{role[locale]}</span>
        <span className="sr-only"> ({ariaRoleLabel})</span>
      </div>
      <div className="shrink-0 tabular-nums" style={{ minWidth: 124 }}>
        <span className="whitespace-nowrap text-right">
          {date}
          <span>&nbsp;&nbsp;{time}</span>
        </span>
      </div>
    </div>
  );
}
