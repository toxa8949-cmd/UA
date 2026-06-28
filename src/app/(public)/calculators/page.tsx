import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { CALCULATORS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { Calculator } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятори для українців за кордоном",
  description: "Калькулятор вартості життя, бюджету переїзду та зарплати netto/brutto для Польщі, Німеччини, Чехії, Іспанії та Португалії.",
  path: "/calculators",
});

export default function CalculatorsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Калькулятори", url: "/calculators" }]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-slate-900">Калькулятори</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Порахуйте витрати на життя, бюджет переїзду та чисту зарплату.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={`/calculators/${c.slug}`}>
              <Card className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Calculator size={20} />
                </div>
                <h2 className="mt-4 font-semibold text-slate-900">{c.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
