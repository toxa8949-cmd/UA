import Link from "next/link";
import { FOOTER_LINKS, MAIN_NAV, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">У</span>
              {SITE.name}
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-600">{SITE.description}</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Розділи</h3>
            <ul className="space-y-2">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Інформація</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {SITE.name}. Інформація має ознайомчий характер і не є юридичною чи фінансовою консультацією.</p>
        </div>
      </div>
    </footer>
  );
}
