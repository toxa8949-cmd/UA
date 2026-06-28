"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MAIN_NAV } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-ink hover:bg-sand-200"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-sand-300 bg-sand-100 shadow-sm">
          <nav className="container flex flex-col py-2">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-sand-200"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-sand-200">
              Пошук
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
