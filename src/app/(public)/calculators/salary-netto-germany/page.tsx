import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoDECalculator } from "@/components/calculators/SalaryNettoBruttoDECalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/brutto у Німеччині 2026 (Brutto-Netto-Rechner)",
  description: "Розрахунок Netto з Brutto у Німеччині: Lohnsteuer, Soli, соцвнески, Steuerklasse I/III/IV. З урахуванням дітей і церковного податку. Актуально на 2026.",
  path: "/calculators/salary-netto-germany",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/brutto у Німеччині", url: "/calculators/salary-netto-germany" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/brutto у Німеччині
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть Brutto — і побачите Netto (на руки) після соцвнесків, Lohnsteuer і Soli.
          З урахуванням Steuerklasse, дітей і церковного податку. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoDECalculator />
        </div>
      </div>
    </>
  );
}
