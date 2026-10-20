"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { widgets } from "@/data/site";

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Kartu musik — pemutar audio lokal penuh: play/pause file MP3, progress bar
 * (seekable), dan rentang waktu (posisi / durasi) yang diambil dari metadata
 * berkas. Cover album asli di kiri (OQ-4).
 */
export function MusicCard() {
  const { track, artist, cover, audioSrc } = widgets.music;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const sync = () => {
      setDuration(a.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrent(a.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    // Seize duration immediately in case loadedmetadata sudah lebih dulu, lalu ikat
    // event juga untuk kasus metadata dimuat kemudian.
    if (a.readyState >= 1 && isFinite(a.duration) && a.duration) sync();
    a.addEventListener("loadedmetadata", sync);
    a.addEventListener("durationchange", sync);
    a.addEventListener("canplay", sync);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("loadedmetadata", sync);
      a.removeEventListener("durationchange", sync);
      a.removeEventListener("canplay", sync);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, []);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    const v = Number(e.target.value);
    if (a) {
      a.currentTime = v;
      setCurrent(v);
    }
  }, []);

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="glass-card flex h-[150px] w-[320px] flex-col p-4 max-md:hidden">
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- cover album asli */}
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
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {playing ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            </button>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="0.1"
              value={current}
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
        <span>{fmt(current)}</span>
        <span>-{fmt(ready ? duration : 0)}</span>
      </div>
    </div>
  );
}

/** Kartu foto (sumber: selfie 150×150) — foto profil dari CV. */
export function PhotoCard({ alt }: { alt: string }) {
  return (
    <div className="h-[150px] w-[150px] overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-md:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- rasio foto CV dipertahankan apa adanya */}
      <img src={widgets.photo.src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}