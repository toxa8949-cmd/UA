import Link from "next/link";
import { FOOTER_LINKS, MAIN_NAV, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand-300 bg-ink text-sand-100">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald font-display text-lg font-bold text-white">З</span>
              <span className="font-display text-[17px] font-bold text-white">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/70">{SITE.description}</p>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sand-100/50">Розділи</h3>
            <ul className="space-y-2.5">
              {MAIN_NAV.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-sm text-sand-100/80 hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-sand-100/50">Інформація</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}><Link href={item.href} className="text-sm text-sand-100/80 hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-sand-100/50">
          © {new Date().getFullYear()} {SITE.name}. Інформація має ознайомчий характер і не є юридичною чи фінансовою консультацією.
        </div>
      </div>
    </footer>
  );
}
