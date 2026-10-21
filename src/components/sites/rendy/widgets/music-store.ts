"use client";

import { widgets } from "@/data/site";

/**
 * Store musik tunggal (singleton) — dipakai bersama oleh MusicCard (desktop)
 * dan FloatingMusicMobile (mobile).
 *
 * TUJUAN:
 *  1. Hanya SATU elemen <audio> untuk seluruh halaman → tidak ada suara ganda.
 *  2. Kedua UI tersinkron otomatis: play di desktop menghentikan/menjalankan
 *     pemutar mobile, dan sebaliknya.
 *  3. TIDAK ada autoplay. Audio hanya berjalan setelah aksi eksplisit pengguna
 *     (klik tombol play), sehingga tidak pernah "tiba-tiba play".
 *  4. Memutar loop otomatis (tidak berhenti di akhir track) dan posisi感性
 *     dipertahankan saat berganti tampilan (desktop ⇄ mobile).
 */

export interface MusicState {
  playing: boolean;
  current: number;
  duration: number;
  ready: boolean;
}

type Listener = (state: MusicState) => void;

class MusicStore {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private state: MusicState = { playing: false, current: 0, duration: 0, ready: false };

  getState = (): MusicState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch };
    for (const l of this.listeners) l(this.state);
  }

  /** Elemen audio tunggal; dibuat lazily di sisi klien. */
  getAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (this.audio) return this.audio;

    const a = new Audio();
    a.src = widgets.music.audioSrc;
    a.preload = "auto";
    a.loop = true; // tidak berhenti di akhir track
    a.volume = 0.55;

    const sync = () => this.emit({ playing: !a.paused, current: a.currentTime, duration: a.duration || 0, ready: a.readyState >= 1 });

    a.addEventListener("loadedmetadata", sync);
    a.addEventListener("durationchange", sync);
    a.addEventListener("timeupdate", () => this.emit({ current: a.currentTime }));
    a.addEventListener("play", () => this.emit({ playing: true }));
    a.addEventListener("pause", () => this.emit({ playing: false }));
    a.addEventListener("ended", () => {
      a.currentTime = 0;
      a.play().catch(() => {});
    });

    this.audio = a;
    return a;
  }

  async play() {
    const a = this.getAudio();
    if (!a) return;
    try {
      await a.play();
      this.emit({ playing: true });
    } catch {
      /* ditolak browser (mis. belum ada interaksi) → tetap diam */
      this.emit({ playing: false });
    }
  }

  pause() {
    const a = this.getAudio();
    if (!a) return;
    a.pause();
    this.emit({ playing: false });
  }

  /** Toggle — sumber kebenaran tunggal untuk kedua UI. */
  toggle() {
    const a = this.getAudio();
    if (!a) return;
    if (a.paused) void this.play();
    else this.pause();
  }

  seek(time: number) {
    const a = this.getAudio();
    if (!a) return;
    a.currentTime = time;
    this.emit({ current: time });
  }
}

let singleton: MusicStore | null = null;

/** Store dibuat hanya di browser agar SSR aman. */
export function getMusicStore(): MusicStore {
  if (!singleton) singleton = new MusicStore();
  return singleton;
}
