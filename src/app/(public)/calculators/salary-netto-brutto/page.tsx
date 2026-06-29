import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoPLCalculator } from "@/components/calculators/SalaryNettoBruttoPLCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/brutto у Польщі 2026",
  description: "Точний розрахунок чистої зарплати (netto) з brutto у Польщі для umowa o pracę: ZUS, składka zdrowotna, PIT. З урахуванням kwota wolna, ulga dla młodych. Актуально на 2026.",
  path: "/calculators/salary-netto-brutto",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/brutto у Польщі", url: "/calculators/salary-netto-brutto" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/brutto у Польщі
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть зарплату brutto — і побачите, скільки залишається на руки (netto) на umowa o
          pracę після ZUS, składki zdrowotnej та PIT. З урахуванням kwota wolna й пільг.
          Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoPLCalculator />
        </div>
      </div>
    </>
  );
}
