import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoCZCalculator } from "@/components/calculators/SalaryNettoBruttoCZCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/brutto у Чехії 2026 (čistá mzda)",
  description: "Точний розрахунок čistá mzda з hrubá mzda у Чехії для HPP: sociální, zdravotní, daň. З урахуванням slevy na poplatníka та дитячих пільг. Актуально на 2026.",
  path: "/calculators/salary-netto-czech",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/brutto у Чехії", url: "/calculators/salary-netto-czech" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/brutto у Чехії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть hrubá mzda (brutto) — і побачите čistá mzda (на руки) після sociálního,
          zdravotního pojištění та daně. З урахуванням slevy na poplatníka й пільг на дітей.
          Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoCZCalculator />
        </div>
      </div>
    </>
  );
}
