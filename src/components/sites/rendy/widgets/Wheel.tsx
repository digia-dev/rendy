"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface WheelProps {
  /** Nilai yang ditampilkan, mis. "AM"/"PM", "09", "30". */
  items: string[];
  /** Nilai yang sedang aktif. */
  value: string;
  /** Dipanggil saat pengguna selesai meng-scroll ke satu item. */
  onChange: (v: string) => void;
  /** Range tombol keyboard (enter/space). */
  ariaLabel?: string;
}

const ROW = 40;

/**
 * Wheel picker ala iOS: daftar item bisa di-scroll vertikal,
 * item yang berada di tengah terpilih. Snapping ke tengah via scroll-snap.
 */
export function Wheel({ items, value, onChange, ariaLabel }: WheelProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [frames] = useState(() => Array.from({ length: 34 }));
  const currentIndex = Math.max(0, items.indexOf(value));

  // Gambar padding atas/bawah agar item tengah bisa bertemu tengah container.
  const padTop = Math.floor(34 / 2);
  const padBottom = Math.floor(34 / 2);
  const loop = [...frames.slice(0, padTop).map(() => null), ...items, ...frames.slice(0, padBottom).map(() => null)];

  // Saat first render / value berubah eksternal, scroll ke item aktif.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const target = padTop * ROW + currentIndex * ROW - (list.clientHeight - ROW) / 2;
    list.scrollTop = target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const centerOfVisible = list.scrollTop + list.clientHeight / 2;
    const idx = Math.round((centerOfVisible - ROW / 2) / ROW) - padTop;
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (items[clamped] && items[clamped] !== value) onChange(items[clamped]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(0, Math.min(items.length - 1, currentIndex + delta));
      onChange(items[next]);
      const list = listRef.current;
      if (list) list.scrollTop = padTop * ROW + next * ROW - (list.clientHeight - ROW) / 2;
    }
  };

  return (
    <div className="sheet-wheel max-w-[110px] overflow-hidden" role="listbox" aria-label={ariaLabel}>
      <ul
        ref={listRef}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-activedescendant={undefined}
        className="sheet-wheel-mask h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth select-none"
        style={{ scrollSnapType: "y mandatory", touchAction: "pan-y" }}
      >
        {loop.map((item, i) =>
          item === null ? (
            <li key={`pad-${i}`} className="h-[40px] shrink-0" aria-hidden="true" />
          ) : (
            <li
              key={item}
              className={`sheet-wheel-row ${item === value ? "is-selected" : "is-inactive"}`}
              style={{ scrollSnapAlign: "center" }}
            >
              {item}
            </li>
          ),
        )}
      </ul>
      <div className="sheet-wheel-highlight" aria-hidden="true" />
    </div>
  );
}