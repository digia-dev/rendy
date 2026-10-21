import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/data/site";
import { BlogLangSwitcher } from "./BlogLangSwitcher";

interface Props {
  locale: Locale;
  /** Judul di titlebar jendela. */
  title: string;
  /** Slot toolbar kanan (opsional; default = pemilih bahasa ID/EN). */
  toolbar?: ReactNode;
  /** Pane kiri (daftar catatan). */
  sidebar: ReactNode;
  /** Konten pane kanan (reader). */
  children: ReactNode;
  /** tampilan mobile: tampilkan daftar atau reader? */
  showSidebarOnMobile: boolean;
}

/**
 * Kerangka jendela ala Notes.app macOS: titlebar `#f4f4f5` + 3 traffic lights,
 * toolbar tipis, lalu dua pane (daftar kiri / konten kanan).
 * Konsisten dengan chrome work page & galeri (terang, shadow lembut, tanpa border keras).
 */
export function NotesWindow({
  locale,
  title,
  toolbar,
  sidebar,
  children,
  showSidebarOnMobile,
}: Props) {
  return (
    <div className="sheet-enter flex h-[calc(100dvh-9rem)] min-h-[440px] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.07] md:h-[calc(100dvh-8rem)]">
      {/* Titlebar — traffic lights macOS (merah = kembali ke beranda) */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-black/[0.08] bg-[#f4f4f5] px-3">
        <Link
          href="/"
          aria-label="Home"
          className="group flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/[0.08] ring-inset transition-transform group-hover:scale-110" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/[0.08] ring-inset" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/[0.08] ring-inset" />
        </Link>
        <span className="flex-1 truncate text-center text-[12.5px] font-medium text-neutral-500">
          {title}
        </span>
        <span className="flex min-w-[76px] items-center justify-end gap-2">
          {/* Ganti chip RSS: pilihan bahasa ID/EN ala segmented control */}
          {toolbar ?? <BlogLangSwitcher locale={locale} />}
        </span>
      </div>

      {/* Toolbar tipis ala Notes */}
      <div className="flex h-9 shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] bg-white px-3">
        <Link
          href="/"
          className="text-[12.5px] text-neutral-500 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] md:hidden"
        >
          {title}
        </Link>
        <span className="hidden text-[12.5px] text-neutral-500 md:inline">{locale === "id" ? "Catatan pribadi" : "Personal notes"}</span>
      </div>

      {/* Dua pane */}
      <div className="flex min-h-0 flex-1">
        <aside
          className={`${
            showSidebarOnMobile ? "flex w-full" : "hidden"
          } min-h-0 shrink-0 flex-col border-r border-black/[0.07] bg-[#fafafa] md:flex md:w-[300px] lg:w-[330px]`}
        >
          {sidebar}
        </aside>
        <div
          className={`${
            showSidebarOnMobile ? "hidden" : "flex w-full"
          } min-h-0 min-w-0 flex-1 flex-col bg-white md:flex`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
