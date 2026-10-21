import {
  Award,
  Building2,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ======================================================================
 * Ikon dibuat ulang dengan gaya macOS: folder biru dengan kertas putih,
 * ikon dock berbentuk rounded-square (squircle) berisi glif aplikasi yang
 * bersih/flat. Tidak memakai aset PNG milik sumber (lihat §9 build-notes).
 * ====================================================================== */

/**
 * Ikon folder — memakai ikon Finder macOS asli dari macosicons.com
 * (diunduh ke `public/sites/rendy/app-icons/finder.png`).
 * Dirender sebagai `<img>` berwarna transparan 256×256.
 */
export function FolderIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ikon Finder nyata
    <img
      src="/sites/rendy/app-icons/finder.png"
      alt=""
      draggable={false}
      className={cn("select-none object-contain", className)}
    />
  );
}

/* ------------------------------------------------------------------ dock apps */

export type AppIconId =
  | "whatsapp"
  | "email"
  | "instagram"
  | "linkedin"
  | "website"
  | "cv"
  | "maps"
  | "claude"
  | "chatgpt"
  | "lang";

/** Peta id app → berkas PNG ikon (real icon berwarna, seperti sumber). */
const iconSrc: Record<AppIconId, string> = {
  whatsapp: "/sites/rendy/app-icons/whatsapp.png",
  email: "/sites/rendy/app-icons/gmail.png",
  instagram: "/sites/rendy/app-icons/instagram.png",
  linkedin: "/sites/rendy/app-icons/linkedin.png",
  website: "/sites/rendy/app-icons/website.png",
  cv: "/sites/rendy/app-icons/cv.png",
  maps: "/sites/rendy/app-icons/maps.png",
  claude: "/sites/rendy/app-icons/claude.png",
  chatgpt: "/sites/rendy/app-icons/chatgpt.png",
  lang: "/sites/rendy/app-icons/lang.png",
};

/**
 * Ikon app dock — PNG ikon berwarna (mirip sumber yang memakai `/app-icons/*.png`).
 * Dirender sebagai `<img>` transparan langsung di atas kartu kaca, tanpa latar
 * tambahan (lihat `DockApps`). Ukuran default 44×44.
 */
export function AppIcon({ id, className }: { id: AppIconId; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- PNG ikon app memang gambar
    <img
      src={iconSrc[id]}
      alt=""
      draggable={false}
      className={cn("h-11 w-11 select-none object-contain", className)}
    />
  );
}

/* ------------------------------------------------------------------ nav dock icons */
/**
 * Ikon navigasi — ditiru dari sumber: tiap icon adalah rounded-square berwarna
 * (putih untuk home/calendar, gradien untuk lainnya) berisi ikon *filled* 20px
 * (`h-1/2 w-1/2`, `fill="currentColor"`). Background & animasi `hover:brightness-105`
 * diatur di `SectionDock`; komponen ini hanya me-`render` glyph-nya.
 * Home = inisial nama pakai font display.
 */
export function NavGlyph({ id }: { id: "home" | "folder" | "sparkle" | "heart" | "calendar" | "phone" }) {
  switch (id) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden="true">
          <text
            x="12.5"
            y="19.5"
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="currentColor"
            style={{ fontFamily: "inherit" }}
          >
            R
          </text>
        </svg>
      );
    case "folder":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden="true">
          <path d="M3 7.4A2.4 2.4 0 0 1 5.4 5h4.1c.66 0 1.29.26 1.76.72l1.04 1.03c.47.46 1.1.72 1.76.72h4.54A2.4 2.4 0 0 1 21 9.87v6.73A2.4 2.4 0 0 1 18.6 19H5.4A2.4 2.4 0 0 1 3 16.6V7.4Z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden="true">
          <path d="M9.5 4.5c.6 3.9 3.1 6.4 7 7-3.9.6-6.4 3.1-7 7-.6-3.9-3.1-6.4-7-7 3.9-.6 6.4-3.1 7-7Zm8.25-1c.3 2.1 1.4 3.2 3.5 3.5-2.1.3-3.2 1.4-3.5 3.5-.3-2.1-1.4-3.2-3.5-3.5 2.1-.3 3.2-1.4 3.5-3.5Zm-.65 11c.2 1.44.96 2.2 2.4 2.4-1.44.2-2.2.96-2.4 2.4-.2-1.44-.96-2.2-2.4-2.4 1.44-.2 2.2-.96 2.4-2.4Z" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden="true">
          <path d="M12 20.2C7.1 16.7 3.4 13.5 3.4 9.7 3.4 7 5.5 4.9 8.05 4.9c1.6 0 3.05.85 3.95 2.2.9-1.35 2.35-2.2 3.95-2.2 2.55 0 4.65 2.1 4.65 4.8 0 3.8-3.7 7-8.6 10.5Z" />
        </svg>
      );
    case "calendar":
      // tema calendar dirender di SectionDock (kotak putih hari+tanggal).
      return null;
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor" aria-hidden="true">
          <path d="M6.6 3.5h8a3.1 3.1 0 0 1 3.1 3.1v10.8a3.1 3.1 0 0 1-3.1 3.1h-8a3.1 3.1 0 0 1-3.1-3.1V6.6a3.1 3.1 0 0 1 3.1-3.1Zm4 8.7a2.45 2.45 0 1 0 0-4.9 2.45 2.45 0 0 0 0 4.9ZM6.35 17.3c0-2.45 1.95-3.85 4.25-3.85s4.25 1.4 4.25 3.85v.2H6.35v-.2Z" fillRule="evenodd" />
        </svg>
      );
  }
}

/* ------------------------------------------------------- achievement icons */

export function AchievementGlyph({ id, className }: { id: string; className?: string }) {
  const common = { className: cn("h-6 w-6 text-white", className), strokeWidth: 1.8 };
  switch (id) {
    case "users":
      return <Users {...common} />;
    case "building":
      return <Building2 {...common} />;
    case "trending":
      return <TrendingUp {...common} />;
    case "award":
      return <Award {...common} />;
    case "trophy":
      return <Trophy {...common} />;
    default:
      return <Award {...common} />;
  }
}

/** Lencana bundar di footer (pengganti lencana penghargaan milik sumber). */
export function RoundBadge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="flex h-11 w-11 items-center justify-center whitespace-pre-line rounded-full text-center text-[8px] font-bold leading-[1.05] text-white shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}