"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wrapper drag elemen ala sumber (elenagonci.com) — mekanisme pointer-event asli,
 * tanpa pustaka: `cursor-grab touch-none select-none active:cursor-grabbing`,
 * `draggable={false}` (blokir HTML5 drag), dan angkat `translate + scale(1.03)`
 * saat digeser. Posisi bertahan di tempat jatuh (tanpa snap-back) lalu
 * disimpan ke localStorage agar susunan bertahan setelah muat ulang.
 */

interface Offset {
  x: number;
  y: number;
}

/** Posisi awal mutlak di dalam kanvas hero (px). Salah satu sumbu cukup. */
export interface InitialPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface Props {
  /** Kunci stabil untuk persistensi localStorage. */
  id: string;
  /** Posisi absolut awal di kanvas hero. Diabaikan bila `inFlow`. */
  initial?: InitialPosition;
  /**
   * true → item tetap mengikuti alur normal (flex/flow) dan hanya menerapkan
   * offset geser (untuk kolom folder). false/absen → absolut seperti sumber.
   */
  inFlow?: boolean;
  /** z-index dasar; item yang pernah digeser naik agar tetap di atas. */
  z?: number;
  className?: string;
  children: React.ReactNode;
}

/** Jarak gerak minimal (px) sebelum dianggap drag — supaya tap tetap jadi klik. */
const DRAG_THRESHOLD = 4;

function storageKey(id: string) {
  return `rendy:widget:${id}`;
}

export function Draggable({ id, initial, inFlow = false, z = 20, className = "", children }: Props) {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [raised, setRaised] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const grab = useRef({ startX: 0, startY: 0, baseX: 0, baseY: 0, moved: false, pointerId: 0 });
  const suppressClick = useRef(false);

  // Muat offset tersimpan setelah mount. localStorage tidak ada di server, jadi
  // hydrate di effect adalah satu-satunya cara yang aman-SSR; hanya setState bila
  // nilai benar-benar berbeda agar tidak memicu render berantai.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(id));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Offset>;
      if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return;
      if (parsed.x === 0 && parsed.y === 0) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrasi localStorage hanya bisa dilakukan di efek; disentralisasi & tidak memicu render berantai karena hanya berjalan sekali dengan nilai berbeda.
      setOffset({ x: parsed.x, y: parsed.y });
      setRaised(true);
    } catch {
      /* abaikan storage rusak */
    }
  }, [id]);

  const persist = useCallback(
    (o: Offset) => {
      try {
        window.localStorage.setItem(storageKey(id), JSON.stringify(o));
      } catch {
        /* penuh/di-block — abaikan */
      }
    },
    [id],
  );

  // Gunakan listener window (bukan pointer capture) supaya klik pada tombol/link
  // di dalam widget tetap alami; drag nyata dicegah memicunya lewat suppressClick.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    grab.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: offset.x,
      baseY: offset.y,
      moved: false,
      pointerId: e.pointerId,
    };
    suppressClick.current = false;
    setDragging(true);

    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== grab.current.pointerId) return;
      const dx = ev.clientX - grab.current.startX;
      const dy = ev.clientY - grab.current.startY;
      if (!grab.current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!grab.current.moved) {
        grab.current.moved = true;
        suppressClick.current = true;
        setRaised(true);
      }
      setOffset({ x: grab.current.baseX + dx, y: grab.current.baseY + dy });
    };

    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== grab.current.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setDragging(false);
      setOffset((cur) => {
        if (grab.current.moved) persist(cur);
        return cur;
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  // Cegah fungsional link/tombol terpicu setelah drag (bukan tap).
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  const style: React.CSSProperties = {
    ...(inFlow ? {} : initial),
    zIndex: dragging ? 40 : raised ? 30 : z,
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${dragging ? 1.03 : 1})`,
    transition: dragging ? "none" : "transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)",
    willChange: "transform",
  };

  const positionClass = inFlow ? "relative" : "absolute";

  return (
    <div
      ref={elRef}
      className={`${positionClass} cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
      style={style}
      draggable={false}
      onPointerDown={onPointerDown}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}
