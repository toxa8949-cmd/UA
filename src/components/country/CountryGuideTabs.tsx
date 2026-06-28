"use client";

import { useState } from "react";

export type GuideSection = { key: string; label: string; text: string };

export function CountryGuideTabs({ sections }: { sections: GuideSection[] }) {
  const [active, setActive] = useState(0);
  if (sections.length === 0) return null;

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

      {/* Контент активного табу */}
      <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-6 md:p-8">
        <h3 className="font-display text-xl font-bold text-ink">{sections[active].label}</h3>
        <p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">
          {sections[active].text}
        </p>
      </div>
    </div>
  );
}
