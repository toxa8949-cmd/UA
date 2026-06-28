"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Зміст статті" className="text-sm">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Зміст</p>
      <ul className="space-y-1.5 border-l border-sand-300">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? 24 : 12 }}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-0.5 transition-colors ${
                active === item.id
                  ? "border-emerald font-medium text-emerald"
                  : "border-transparent text-slate-500 hover:text-ink"
              }`}
              style={{ marginLeft: -1 }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
