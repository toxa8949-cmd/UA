import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoESCalculator } from "@/components/calculators/SalaryNettoBruttoESCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/bruto в Іспанії 2026 (salario neto)",
  description: "Розрахунок salario neto з bruto в Іспанії: Seguridad Social, IRPF, 12/14 виплат. З урахуванням дітей і типу договору. Актуально на 2026.",
  path: "/calculators/salary-netto-spain",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/bruto в Іспанії", url: "/calculators/salary-netto-spain" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/bruto в Іспанії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть річну bruto — і побачите salario neto (на руки) після Seguridad Social та
          IRPF. З урахуванням 12/14 виплат, типу договору й дітей. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoESCalculator />
        </div>
      </div>
    </>
  );
}
