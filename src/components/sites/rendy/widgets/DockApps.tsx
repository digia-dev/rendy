"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { dockApps } from "@/data/site";
import { AppIcon, type AppIconId } from "../icons";

const labels: Record<AppIconId, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  website: "Rapid Network",
  cv: "CV / Pendidikan",
  maps: "Lokasi",
  claude: "Tanya Claude",
  chatgpt: "Tanya ChatGPT",
  lang: "Ganti bahasa",
};

/** Dock aplikasi kanan-bawah (262×118 pada 1440px). Ikon terakhir = ganti bahasa (OQ-1). */
export function DockApps() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const next = locale === "id" ? "en" : "id";

  return (
    <div className="glass-card grid w-[262px] grid-cols-5 gap-x-2 gap-y-3 p-3 max-md:w-full max-md:grid-cols-5">
      {dockApps.map((app) => {
        if (app.id === "lang") {
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => router.replace(pathname, { locale: next })}
              aria-label={`${labels.lang} — ${next.toUpperCase()}`}
              title={`${labels.lang} — ${next.toUpperCase()}`}
              className="flex items-center justify-center rounded-[11px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              <AppIcon id={app.id} />
            </button>
          );
        }

        const shared = {
          "aria-label": labels[app.id],
          title: labels[app.id],
          className:
            "flex items-center justify-center rounded-[11px] transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]",
        };

        if (!app.external) {
          return (
            <Link key={app.id} href={app.href} {...shared}>
              <AppIcon id={app.id} />
            </Link>
          );
        }

        return (
          <a key={app.id} href={app.href} target="_blank" rel="noopener noreferrer" {...shared}>
            <AppIcon id={app.id} />
          </a>
        );
      })}
    </div>
  );
}
