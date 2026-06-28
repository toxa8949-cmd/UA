import Link from "next/link";
import { Search } from "lucide-react";
import { MAIN_NAV, SITE } from "@/lib/constants";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-300 bg-sand-100/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-lg font-bold text-white">
            З
          </span>
          <span className="hidden font-display text-[17px] font-bold tracking-tight text-ink sm:inline">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-sand-200 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="Пошук"
            className="ml-1 rounded-lg p-2 text-slate-600 transition-colors hover:bg-sand-200 hover:text-ink"
          >
            <Search size={18} />
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
