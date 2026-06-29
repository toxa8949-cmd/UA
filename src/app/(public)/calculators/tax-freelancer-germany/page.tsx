import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxFreelancerDECalculator } from "@/components/calculators/TaxFreelancerDECalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків Freiberufler / Gewerbe у Німеччині 2026",
  description: "Порахуйте, скільки залишається на руки як самозайнятий у Німеччині: Einkommensteuer, Soli, Gewerbesteuer. Freiberufler чи Gewerbe. Актуально на 2026.",
  path: "/calculators/tax-freelancer-germany",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки самозайнятого в Німеччині", url: "/calculators/tax-freelancer-germany" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків самозайнятого в Німеччині
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки як Freiberufler або
          Gewerbe. Розрахунок за формулою Einkommensteuer §32a EStG, з Soli та Gewerbesteuer.
          Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxFreelancerDECalculator />
        </div>
      </div>
    </>
  );
}
