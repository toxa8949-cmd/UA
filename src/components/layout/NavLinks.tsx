"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Пункти головного меню з підсвіткою активного розділу.
 * Активний: колір ink + смарагдовий індикатор під пунктом.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {MAIN_NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "text-ink"
                : "text-slate-600 hover:bg-sand-200 hover:text-ink"
            )}
          >
            {item.label}
            {active && (
              <span className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-emerald" />
            )}
          </Link>
        );
      })}
    </>
  );
}
