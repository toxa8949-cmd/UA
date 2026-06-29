"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

/**
 * Термін із підказкою-поясненням.
 * Працює на наведення (desktop) і на тап (mobile).
 * Використання: <TermHint label="ZUS" hint="Соціальні внески..." />
 */
export function TermHint({ label, hint }: { label: string; hint: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // закриття при тапі поза елементом (mobile)
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center gap-1">
      <span>{label}</span>
      <button
        type="button"
        aria-label={`Що таке ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex text-slate-400 transition-colors hover:text-emerald focus:text-emerald focus:outline-none"
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-20 mb-1.5 w-60 rounded-lg border border-sand-300 bg-white p-2.5 text-xs font-normal leading-relaxed text-slate-600 shadow-lg"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
