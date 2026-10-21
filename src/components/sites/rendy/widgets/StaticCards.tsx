"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Play, Pause } from "lucide-react";
import { widgets, type Locale } from "@/data/site";
import { getMusicStore } from "./music-store";
import { PhotoGallery } from "./PhotoGallery";

function formatTime(s: number): string {
  if (!s || Number.isNaN(s) || s < 0) return "0:00";
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

import type { GalleryItem } from "@/lib/gallery";

/**
 * MusicCard desktop (full widget).
 * Reads state from and controls the shared singleton store.
 * Hidden on mobile via max-md:hidden; FloatingMusic handles mobile.
 */

export function MusicCard() {
  const store = getMusicStore();
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => store.getState(),
  );

  const { track, artist, cover } = widgets.music;

  const toggle = () => {
    store.toggle();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    store.seek(val);
  };

  const pct = state.duration > 0 ? (state.current / state.duration) * 100 : 0;

  return (
    <div className="glass-card flex h-[150px] w-[320px] flex-col p-4 max-md:hidden">
      <div className="flex items-start gap-3">
        <img
          src={cover}
          alt={`${artist} — ${track}`}
          className="h-[68px] w-[68px] shrink-0 rounded-lg object-cover shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
        />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight text-black">{track}</p>
          <p className="truncate text-[12px] text-neutral-500">{artist}</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={state.playing ? "Pause" : "Play"}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {state.playing ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            </button>
            <input
              type="range"
              min={0}
              max={state.duration || 0}
              step="0.1"
              value={state.current}
              onChange={seek}
              aria-label="Seek"
              className="music-range h-[3px] w-full min-w-0 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right,#3f3f46 ${pct}%,#d4d4d8 ${pct}%)`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between text-[11px] tabular-nums text-neutral-500">
        <span>{formatTime(state.current)}</span>
        <span>-{formatTime(state.duration)}</span>
      </div>
    </div>
  );
}

/**
 * Kartu foto — klik membuka galeri "Photos" (foto & video).
 * `photos` dibaca otomatis dari `public/sites/rendy/gallery/` di server
 * (via `readGalleryDir()`), sehingga cukup taruh file — tanpa daftar di site.ts.
 */
export function PhotoCard({
  locale,
  alt,
  photos,
}: {
  locale: Locale;
  alt: string;
  photos: ReadonlyArray<GalleryItem>;
}) {
  // Alt default bila item tak punya; foto pertama memakai `alt` profil.
  const items = photos.map((item, i) => ({
    type: item.type,
    src: item.src,
    poster: item.poster,
    alt: i === 0 ? alt : item.type === "video" ? `Video ${i + 1}` : `Foto ${i + 1}`,
  }));
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Widget memilih satu item (foto/video) secara acak setiap render (client)
  // agar tampilan hero selalu bervariasi.
  const shuffle = items.length > 0 ? index % items.length : 0;

  if (items.length === 0) return null;

  const current = items[shuffle];

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          setIndex(Math.floor(Math.random() * items.length));
          setOpen(true);
        }}
        aria-label={alt}
        aria-haspopup="dialog"
        className="h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
      >
        {current.type === "video" ? (
          /* eslint-disable-next-line jsx-a11y/media-has-caption */
          <video
            src={current.src}
            poster={current.poster}
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={current.src}
            alt={current.alt}
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
      </button>
      {open ? createPortal(
        <PhotoGallery
          locale={locale}
          photos={items}
          currentIndex={shuffle}
          onNavigate={setIndex}
          onClose={() => setOpen(false)}
          triggerRef={btnRef}
          prevLabel="Previous photo"
          nextLabel="Next photo"
          closeLabel="Close gallery"
        />,
        document.body,
      ) : null}
    </>
  );
}