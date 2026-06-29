import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";
import { Calculator, ArrowRight } from "lucide-react";

const COUNTRY_LABEL: Record<string, string> = {
  poland: "Польща",
  czech: "Чехія",
  germany: "Німеччина",
  spain: "Іспанія",
  portugal: "Португалія",
};

/**
 * Блок «Схожі калькулятори» — внутрішня перелінковка для SEO.
 * Показує: інший калькулятор тієї ж країни + той самий тип в інших країнах.
 */
export function RelatedCalculators({ currentSlug }: { currentSlug: string }) {
  const current = CALCULATORS.find((c) => c.slug === currentSlug) as
    | { slug: string; title: string; country: string | null; group: string }
    | undefined;
  if (!current || !current.country) return null;

  const all = CALCULATORS as unknown as {
    slug: string;
    title: string;
    description: string;
    country: string | null;
    group: string;
  }[];

  // 1) інший калькулятор тієї ж країни (податок ↔ зарплата)
  const sameCountry = all.filter(
    (c) => c.country === current.country && c.slug !== currentSlug
  );
  // 2) той самий тип (group) в інших країнах
  const sameType = all.filter(
    (c) => c.group === current.group && c.country !== current.country && c.country
  );

  const related = [...sameCountry, ...sameType].slice(0, 6);
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-5 text-2xl font-bold text-ink">Схожі калькулятори</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((c) => (
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
              <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                {c.country ? COUNTRY_LABEL[c.country] : ""}
                <ArrowRight size={11} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
