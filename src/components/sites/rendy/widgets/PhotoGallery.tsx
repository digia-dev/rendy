"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type Locale } from "@/data/site";

interface Photo {
  type?: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

interface Props {
  photos: Photo[];
  locale: Locale;
  currentIndex: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  prevLabel: string;
  nextLabel: string;
  closeLabel: string;
}

/**
 * Galeri foto ala "Photos" macOS: viewer besar + rangkaian thumbnail.
 * Modal (backdrop + panel), navigasi kiri/kanan, keyboard (Escape/arrows),
 * jebakan fokus, dan kunci gulir latar.
 */
export function PhotoGallery({
  photos,
  locale,
  currentIndex,
  onNavigate,
  onClose,
  triggerRef,
  prevLabel,
  nextLabel,
  closeLabel,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const photosLen = photos.length;
  const current = photos[currentIndex] ?? photos[0];

  const prev = () => onNavigate((currentIndex - 1 + photosLen) % photosLen);
  const next = () => onNavigate((currentIndex + 1) % photosLen);

  useEffect(() => {
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey, true);
      trigger?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, triggerRef, currentIndex]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />

      {/* Jendela galeri ala macOS Photos (tema terang) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={closeLabel}
        tabIndex={-1}
        className="sheet-enter relative flex max-h-[92dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white text-black shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-black/10 outline-none"
      >
        {/* Titlebar (theme terang macOS) */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-black/10 bg-[#f4f4f5] px-3">
          <span className="text-[12px] font-medium text-neutral-500">
            {photosLen > 0 ? `${currentIndex + 1}/${photosLen}` : "1/1"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewer besar */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#f5f5f7] p-8">
          {current.type === "video" ? (
        <video
          key={current.src}
          src={current.src}
          poster={current.poster}
          controls
          autoPlay
          playsInline
          className="max-h-[52vh] max-w-full rounded-lg object-contain shadow-xl"
        />
      ) : (
        <img
          key={current.src}
          src={current.src}
          alt={current.alt ?? ""}
          className="max-h-[52vh] max-w-full rounded-lg object-contain shadow-xl"
          draggable={false}
        />
      )}
          {photosLen > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={prevLabel}
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={nextLabel}
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {/* Rangkaian thumbnail */}
        {photosLen > 1 ? (
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-black/10 bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-action-pan-y">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => onNavigate(i)}
                aria-label={p.alt ?? `Photo ${i + 1}`}
                aria-pressed={i === currentIndex}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-black/10 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
                  i === currentIndex ? "opacity-100 ring-2 ring-[#0069d9]" : "opacity-50 hover:opacity-90"
                }`}
              >
                {p.type === "video" ? (
                <video src={p.src} muted preload="metadata" playsInline className="h-full w-full object-cover" />
              ) : (
                <img src={p.src} alt="" className="h-full w-full object-cover" draggable={false} />
              )}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}