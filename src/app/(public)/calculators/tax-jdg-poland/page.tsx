import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxJdgPLCalculator } from "@/components/calculators/TaxJdgPLCalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків ФОП (JDG) у Польщі 2026",
  description: "Порахуйте, скільки залишається на руки на JDG у Польщі: Ryczałt, Liniowy 19% та Skala. З урахуванням ZUS і складки zdrowotnej. Актуально на 2026.",
  path: "/calculators/tax-jdg-poland",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки ФОП у Польщі", url: "/calculators/tax-jdg-poland" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків ФОП (JDG) у Польщі
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки на трьох формах
          оподаткування: Ryczałt, Liniowy та Skala. Розрахунок враховує ZUS і складку
          zdrowotną, актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxJdgPLCalculator />
        </div>
      </div>
    </>
  );
}
