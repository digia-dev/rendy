"use client";

import { useState } from "react";
import { aboutTxt, type Locale } from "@/data/site";

/** Jendela macOS “about-me.txt” — kolom DULU/SEKARANG + MASA DEPAN yang bisa dibuka. */
export function AboutTxt({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="about" className="relative z-10 bg-white px-6 py-16">
      <div className="mx-auto max-w-[1060px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
        <div className="flex h-9 items-center gap-2 border-b border-black/10 bg-[#f4f4f5] px-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-[13px] text-neutral-600">{aboutTxt.file}</span>
          <span className="w-12" />
        </div>

        <div className="grid gap-8 px-8 py-9 md:grid-cols-2 md:px-14 md:py-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              {aboutTxt.then.label[locale]}
            </p>
            <p className="mt-3 text-[15px] leading-6 text-neutral-600">{aboutTxt.then.body[locale]}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              {aboutTxt.now.label[locale]}
            </p>
            <p className="mt-3 text-[15px] leading-6 text-neutral-600">{aboutTxt.now.body[locale]}</p>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {aboutTxt.future.label[locale]}
              <span aria-hidden="true" className="text-[14px] leading-none">
                {open ? "−" : "+"}
              </span>
            </button>

            {open ? (
              <p className="mt-3 text-[15px] leading-6 text-neutral-600">{aboutTxt.future.body[locale]}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
