import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxOsvcCZCalculator } from "@/components/calculators/TaxOsvcCZCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків OSVČ (ФОП) у Чехії 2026",
  description: "Порахуйте, скільки залишається на руки на OSVČ у Чехії: paušální daň, паушальні та реальні витрати. З урахуванням sociálního і zdravotního pojištění. Актуально на 2026.",
  path: "/calculators/tax-osvc-czech",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки OSVČ у Чехії", url: "/calculators/tax-osvc-czech" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків OSVČ (ФОП) у Чехії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки на трьох режимах:
          paušální daň, паушальні витрати та реальні витрати. Розрахунок враховує sociální та
          zdravotní pojištění, актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxOsvcCZCalculator />
        </div>
      </div>
    </>
  );
}
