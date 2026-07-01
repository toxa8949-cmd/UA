"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Кнопка «вгору»: з'являється після 600px прокрутки. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Прокрутити вгору"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-white text-ink shadow-lg transition-colors hover:border-emerald hover:text-emerald"
    >
      <ArrowUp size={18} />
    </button>
  );
}
