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
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-slate-200 bg-white shadow-lg">
          <nav className="container flex flex-col py-2">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
