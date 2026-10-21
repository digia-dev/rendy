"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";
import { widgets } from "@/data/site";
import { getMusicStore } from "./music-store";

/**
 * Floating music button mobile — tersinkron dengan MusicCard desktop melalui
 * singleton store (satu elemen audio, dua UI). Tidak ada autoplay.
 */
export function FloatingMusicMobile() {
  const store = getMusicStore();
  const state = useSyncExternalStore(store.subscribe, () => store.getState(), () => store.getState());

  const { cover, track, artist } = widgets.music;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const drag = useRef({ sx: 0, sy: 0, ox: 0, oy: 0, moved: false });

  const toggle = () => store.toggle();

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const r = btnRef.current?.getBoundingClientRect();
    const base = pos ?? { x: r ? r.left : window.innerWidth - 200, y: r ? r.top : window.innerHeight - 200 };
    drag.current = { sx: e.clientX, sy: e.clientY, ox: base.x, oy: base.y, moved: false };

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - drag.current.sx;
      const dy = ev.clientY - drag.current.sy;
      if (!drag.current.moved && Math.hypot(dx, dy) < 5) return;
      drag.current.moved = true;
      const w = btnRef.current?.offsetWidth ?? 180;
      const h = btnRef.current?.offsetHeight ?? 56;
      const nx = Math.min(window.innerWidth - w - 8, Math.max(8, drag.current.ox + dx));
      let ny = Math.min(window.innerHeight - h - 8, Math.max(8, drag.current.oy + dy));
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const deckW = Math.min(340, vw - 20);
      const deckTop = vh - 118;
      const zoneLeft = vw / 2 - deckW / 2;
      const zoneRight = vw / 2 + deckW / 2;
      const overlapX = nx < zoneRight && nx + w > zoneLeft;
      const overlapY = ny < vh - 8 && ny + h > deckTop;
      if (overlapX && overlapY) ny = deckTop - h - 8;
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
    : { right: 12, top: 64, left: undefined, bottom: undefined };

  const playing = state.playing;

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      className="fixed z-[65] flex touch-none select-none items-center gap-2 rounded-full border border-black/10 bg-white/85 py-1 pl-1 pr-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] md:hidden"
      style={style}
    >
      <span className="relative h-9 w-9 overflow-hidden rounded-full">
        <img src={cover} alt="" className="h-full w-full object-cover" draggable={false} />
        {!playing ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 text-white">
            <Play className="h-3.5 w-3.5 fill-white" />
          </span>
        ) : null}
      </span>
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
  );
}
