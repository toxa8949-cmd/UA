"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type GuideItem = { title: string; body: string };
export type GuideSection = {
  key: string;
  label: string;
  summary: string;       // короткий fallback-текст (*_summary)
  items: GuideItem[];    // розгорнуті підпункти (guides[key])
};

function Accordion({ items }: { items: GuideItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-sand-300 overflow-hidden rounded-2xl border border-sand-300 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-sand-50"
            >
              <span className="font-display font-semibold text-ink">{item.title}</span>
              <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="grid transition-all duration-200 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <p className="whitespace-pre-line px-5 pb-5 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CountryGuideTabs({ sections }: { sections: GuideSection[] }) {
  const [active, setActive] = useState(0);
  if (sections.length === 0) return null;
  const current = sections[active];

  return (
    <div>
      {/* Таби */}
      <div className="flex flex-wrap gap-2 border-b border-sand-300 pb-px">
        {sections.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            className={`relative -mb-px rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              active === i
                ? "border-b-2 border-emerald text-ink"
                : "border-b-2 border-transparent text-slate-500 hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div className="mt-6">
        {current.items.length > 0 ? (
          <Accordion items={current.items} />
        ) : (
          <div className="rounded-2xl border border-sand-300 bg-white p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-ink">{current.label}</h3>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
              {current.summary || "Інформація готується."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
