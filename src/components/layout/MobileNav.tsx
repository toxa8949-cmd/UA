"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
            {MAIN_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base font-medium",
                    active
                      ? "bg-sand-200 text-ink"
                      : "text-slate-700 hover:bg-sand-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-sand-200">
              Пошук
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
