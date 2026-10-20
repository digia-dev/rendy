"use client";

import { useState } from "react";
import { faqs, ui, type Locale } from "@/data/site";

/**
 * C1 — FAQ accordion (dari heyclicky). Satu item terbuka; klik untuk expand/collapse.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative z-10 border-t border-black/10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[820px]">
        <h2 className="text-[30px] font-extrabold leading-9 tracking-[-0.75px] text-black">
          {ui.faq.title[locale]}
        </h2>
        <p className="mt-2 text-[15px] text-neutral-500">{ui.faq.subtitle[locale]}</p>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q.en} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                >
                  <span className="text-[15px] font-semibold text-black">{f.q[locale]}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/15 text-[14px] text-neutral-500 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[14px] leading-6 text-neutral-600">{f.a[locale]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}