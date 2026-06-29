import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";
import { Calculator, ArrowRight } from "lucide-react";

const COUNTRY_SLUG_MAP: Record<string, string> = {
  poland: "poland",
  germany: "germany",
  "czech-republic": "czech",
  spain: "spain",
  portugal: "portugal",
};

type Calc = {
  slug: string;
  title: string;
  description: string;
  country: string | null;
  group: string;
};

export function CountryCalculators({
  countrySlug,
  variant = "full",
}: {
  countrySlug: string;
  variant?: "full" | "bare" | "sidebar";
}) {
  const key = COUNTRY_SLUG_MAP[countrySlug];
  if (!key) return null;

  const all = CALCULATORS as unknown as Calc[];
  const calcs = all.filter((c) => c.country === key);
  if (calcs.length === 0) return null;

  // компактний варіант для бічної панелі статті
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-sand-300 bg-white p-5">
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
          <Calculator size={16} className="text-emerald" />
          Корисні калькулятори
        </p>
        <div className="mt-3 space-y-2">
          {calcs.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="group flex items-center justify-between gap-2 rounded-lg border border-sand-300 px-3 py-2 text-sm text-slate-600 transition-colors hover:border-emerald hover:text-emerald"
            >
              <span className="min-w-0 truncate">{c.title}</span>
              <ArrowRight size={13} className="shrink-0 text-slate-300 group-hover:text-emerald" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const cards = calcs.map((c) => (
    <Link
      key={c.slug}
      href={`/calculators/${c.slug}`}
      className="group flex items-start gap-3 rounded-xl border border-sand-300 bg-white p-4 transition-colors hover:border-emerald"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
        <Calculator size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink group-hover:text-emerald">
          {c.title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">{c.description}</span>
      </span>
      <ArrowRight
        size={14}
        className="ml-auto mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-emerald"
      />
    </Link>
  ));

  if (variant === "bare") {
    return <>{cards}</>;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-ink">Калькулятори для цієї країни</h2>
      <p className="mt-1 text-sm text-slate-600">
        Порахуйте податки та чисту зарплату за актуальними ставками 2026 року.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{cards}</div>
    </section>
  );
}
