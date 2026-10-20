"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { askAiPrompt, profile, ui, type Locale } from "@/data/site";

/** Baris yang tampil di layar terminal. */
interface Line {
  kind: "input" | "output" | "link";
  text: string;
  url?: string;
}

/**
 * Terminal interaktif bergaya macOS — replikasi halaman `/playground` sumber
 * (elenagonci.com/playground). Shell "rendy-5" dengan perintah help / ls /
 * cat contact.txt / whoami / clear / exit; pertanyaan bebas dialihkan ke AI
 * (Claude/ChatGPT, sama seperti link "Ask" di dock). Bisa digeser lewat titlebar.
 */
export function PlaygroundTerminal({ locale }: { locale: Locale }) {
  const l = locale as Locale;
  const t = ui.terminal;

  const [lines, setLines] = useState<Line[]>(() => [
    { kind: "output", text: t.login[l] },
    { kind: "output", text: "" },
    { kind: "output", text: t.welcome[l] },
    { kind: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const shellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef<{ sx: number; sy: number; ox: number; oy: number; on: boolean }>({
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
    on: false,
  });

  // Fokuskan input terminal saat mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const out = useCallback((texts: (string | { text: string; url: string })[]) => {
    setLines((prev) => [
      ...prev,
      ...texts.map((s) => (typeof s === "string" ? { kind: "output" as const, text: s } : { kind: "link" as const, ...s })),
    ]);
  }, []);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((prev) => [...prev, { kind: "input", text: cmd }]);
    if (!cmd) {
      setLines((prev) => [...prev]);
      return;
    }
    const [head, arg] = cmd.split(/\s+/);
    switch (head) {
      case "help": {
        out([
          "",
          t.helpIntro[l],
          `  help              ${t.help.list[l]}`,
          `  ls                ${t.help.ls[l]}`,
          `  cat contact.txt   ${t.help.catContact[l]}`,
          `  whoami            ${t.help.whoami[l]}`,
          `  clear             ${t.help.clear[l]}`,
          `  exit              ${t.help.exit[l]}`,
          t.anything[l],
          "",
        ]);
        break;
      }
      case "ls": {
        out([
          "",
          `${t.ls.caseStudies[l]}  ${t.ls.playground[l]}  ${t.ls.press[l]}  ${t.ls.contact}  ${t.ls.resume[l]}`,
          t.lsNote[l],
          "",
        ]);
        break;
      }
      case "cat": {
        if (arg === "contact.txt") {
          out([
            "",
            t.contact.intro[l],
            `  ${t.contact.email[l]}     ${profile.email}`,
            `  ${t.contact.whatsapp[l]}  ${profile.whatsappDisplay}`,
            `  ${t.contact.linkedin[l]}  ${profile.linkedinHandle}`,
            `  ${t.contact.instagram[l]} ${profile.instagramHandle}`,
            "",
          ]);
        } else {
          out(["", `cat: ${arg || "?"}: no such file`, ""]);
        }
        break;
      }
      case "whoami": {
        out(["", t.whoami[l], ""]);
        break;
      }
      case "clear": {
        setLines([]);
        break;
      }
      case "exit": {
        setShow(false);
        break;
      }
      default: {
        // Pertanyaan bebas → AI (Claude & ChatGPT).
        const q = encodeURIComponent(
          `${askAiPrompt} Pengunjung bertanya: ${cmd}`,
        );
        out([
          "",
          { text: t.anything[l] + " " + t.aiHint[l], url: `https://claude.ai/new?q=${q}` },
          "",
          { text: `${profile.initials}`, url: `https://claude.ai/new?q=${q}` },
        ]);
      }
    }
    // gulir ke bawah
    requestAnimationFrame(() => {
      shellRef.current?.scrollTo({ top: shellRef.current.scrollHeight });
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
    inputRef.current?.focus();
  };

  const onTitleDown = (e: React.PointerEvent) => {
    dragging.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, on: true };
    const move = (ev: PointerEvent) => {
      if (!dragging.current.on) return;
      setPos({ x: dragging.current.ox + ev.clientX - dragging.current.sx, y: dragging.current.oy + ev.clientY - dragging.current.sy });
    };
    const up = () => {
      dragging.current.on = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex touch-none select-none overflow-hidden">
      <div
        className="pointer-events-auto fixed left-1/2 top-1/2 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1c1c24]/95 text-[13px] leading-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        style={{
          width: 470,
          maxWidth: "calc(100vw - 32px)",
          height: 380,
          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      >
        {/* Titlebar */}
        <div
          className="relative flex shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-[#2a2b33] px-4 py-2.5 active:cursor-grabbing"
          onPointerDown={onTitleDown}
        >
          <button
            type="button"
            aria-label={t.close[l]}
            title={t.close[l]}
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-white/60"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-white/50">
            {t.titlebar[l]}
          </span>
        </div>

        {/* Body */}
        <div
          ref={shellRef}
          className="flex-1 space-y-1 overflow-y-auto px-4 py-3 text-white/80"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((ln, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {ln.kind === "input" ? (
                <span className="text-white">
                  <span className="text-[#4FDE73]">{t.host}</span>
                  <span className="text-white/45">&nbsp;{t.prompt}&nbsp;</span>
                  {ln.text}
                </span>
              ) : ln.kind === "link" ? (
                <a
                  href={ln.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#6fb6ff] underline underline-offset-2 hover:text-white"
                >
                  {ln.text}
                </a>
              ) : (
                <span>{ln.text}</span>
              )}
            </div>
          ))}
          <form onSubmit={onSubmit} className="flex items-baseline gap-0">
            <span className="shrink-0 text-[#4FDE73]">{t.host}</span>
            <span className="shrink-0 text-white/45">&nbsp;{t.prompt}&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal"
              className="min-w-0 flex-1 border-none bg-transparent text-white caret-white outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
}