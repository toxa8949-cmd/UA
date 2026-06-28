import Link from "next/link";
import { Search } from "lucide-react";
import { MAIN_NAV, SITE } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">У</span>
          <span className="hidden sm:inline">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="Пошук"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            <Search size={18} />
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
