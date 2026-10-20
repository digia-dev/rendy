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
 * Ikon folder macOS — direkonstruksi dari sumber (elenagonci.com/app-icons/folder.png),
 * yaitu ikon sistem macOS generik: folder biru-muda flat, tab kiri-atas + badan
 * persegi-panjang membulat. Natural 256×256; warna body rgb(116,208,250),
 * tab/tepi-cerah rgb(147,220,254), sisi rgb(101,201,248).
 */
export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      {/* bayangan halus */}
      <path
        d="M22 62a24 24 0 0 1 24-24h22c20 0 26 1 30 8l14 8c12 4 16 4 28 5h20a24 24 0 0 1 24 24v62a24 24 0 0 1-24 24H46a24 24 0 0 1-24-24V62Z"
        fill="rgba(31,113,153,0.15)"
        transform="translate(3 4)"
      />
      {/* tab kiri-atas */}
      <path d="M20 105a24 24 0 0 1 24-24h22c18 0 20 4 24 13 2 5 4 8 7 9l3 2H20Z" fill="#93dcfe" />
      <path d="M20 105h88v6a24 24 0 0 1-24 24H20v-30Z" fill="#8fd8fd" />
      {/* badan folder */}
      <path
        d="M20 122h216a24 24 0 0 1 24 24v60a24 24 0 0 1-24 24H20a24 24 0 0 1-24-24v-60a24 24 0 0 1 24-24Z"
        fill="#74d0fa"
      />
      {/* highlight atas badan */}
      <path d="M20 124a24 24 0 0 1 24-24h172c-24 0-34 12-40 24H20Z" fill="#93dcfe" opacity="0.9" />
      {/* lipatan & sisi */}
      <path d="M20 186h236v11a24 24 0 0 1-24 24H20a24 24 0 0 1-24-24v-11Z" fill="#65bfef" opacity="0.5" />
    </svg>
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