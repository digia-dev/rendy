"use client";

/**
 * Synchronized music state across MusicCard (desktop) and FloatingMusic (mobile).
 * Uses window-level events so the two independent audio elements stay in sync.
 */

type MusicEvent = "play" | "pause" | "seek" | "end";

class MusicSyncEmitter extends EventTarget {
  emit(type: MusicEvent, payload?: number) {
    this.dispatchEvent(new CustomEvent("music-sync", { detail: { type, payload } }));
  }
}

export const musicSync = new MusicSyncEmitter();

export function onMusicSync(cb: (type: MusicEvent, payload?: number) => void) {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    cb(detail.type, detail.payload);
  };
  musicSync.addEventListener("music-sync", handler);
  return () => musicSync.removeEventListener("music-sync", handler);
}
