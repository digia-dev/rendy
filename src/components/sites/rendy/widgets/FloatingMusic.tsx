"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { widgets } from "@/data/site";

/**
 * Floating music button ala macOS (mode mobile saja).
 * Bisa digeser (drag & drop) ke posisi mana pun di layar; menyatu dengan
 * `position: fixed` dan `left/top`. Ketukan (tanpa geser) = play/pause.
 * Mencoba autoplay otomatis; jika browser memblokir, tombol siap diputar manual.
 */
export function FloatingMusicMobile() {
  const { cover, track, artist, audioSrc } = widgets.music;
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null); // null = default right-bottom
  const drag = useRef({ sx: 0, sy: 0, ox: 0, oy: 0, moved: false });

  // Coba play otomatis saat mount (mobile).
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const tryPlay = () => {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {
          /* autoplay diblokir */
        });
    };
    const onCanPlay = () => tryPlay();
    if (a.readyState >= 1) tryPlay();
    else a.addEventListener("canplay", onCanPlay);
    const onEnd = () => {
      a.currentTime = 0;
      a.play().catch(() => {});
    };
    a.addEventListener("ended", onEnd);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  // Tekan: mulai kemungkinan drag.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // posisi awal drag diambil dari posisi tombol saat ini (fixed left/top)
    const r = btnRef.current?.getBoundingClientRect();
    const base = pos ?? { x: r ? r.left : window.innerWidth - 200, y: r ? r.top : window.innerHeight - 200 };
    drag.current = { sx: e.clientX, sy: e.clientY, ox: base.x, oy: base.y, moved: false };

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - drag.current.sx;
      const dy = ev.clientY - drag.current.sy;
      if (!drag.current.moved && Math.hypot(dx, dy) < 5) return;
      drag.current.moved = true;
      // clamp dalam viewport
      const w = btnRef.current?.offsetWidth ?? 180;
      const h = btnRef.current?.offsetHeight ?? 56;
      const nx = Math.min(window.innerWidth - w - 8, Math.max(8, drag.current.ox + dx));
      const ny = Math.min(window.innerHeight - h - 8, Math.max(8, drag.current.oy + dy));
      setPos({ x: nx, y: ny });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  // Saat klik muncul benar-benar (tanpa drag), toggle play/pause.
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
      return;
    }
    toggle();
  };

  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { right: 12, bottom: 24, left: undefined, top: undefined };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <button
        ref={btnRef}
        type="button"
        onClick={onClick}
        onPointerDown={onPointerDown}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        className="fixed z-[65] flex touch-none select-none items-center gap-2 rounded-full border border-black/10 bg-white/85 py-1 pl-1 pr-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        style={style}
      >
        {/* cover */}
        <span className="relative h-9 w-9 overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- cover album */}
          <img src={cover} alt="" className="h-full w-full object-cover" draggable={false} />
          {!playing ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 text-white">
              <Play className="h-3.5 w-3.5 fill-white" />
            </span>
          ) : null}
        </span>

        {/* equalizer animasi saat diputar */}
        <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#0069d9]"
              style={{
                height: playing ? "100%" : "40%",
                animation: playing ? `eq-bounce 0.9s ease-in-out ${i * 0.18}s infinite alternate` : "none",
              }}
            />
          ))}
        </span>

        <span className="flex flex-col items-start">
          <span className="max-w-[110px] truncate text-[11px] font-bold leading-tight text-black">{track}</span>
          <span className="max-w-[110px] truncate text-[9px] leading-tight text-neutral-500">{artist}</span>
        </span>
      </button>
    </>
  );
}