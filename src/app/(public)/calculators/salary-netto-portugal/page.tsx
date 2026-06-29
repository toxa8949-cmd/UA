import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoPTCalculator } from "@/components/calculators/SalaryNettoBruttoPTCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор зарплати netto/bruto у Португалії 2026 (salário líquido)",
  description: "Розрахунок salário líquido з ilíquido у Португалії: Segurança Social, IRS retenção, 12/14 виплат. За таблицями 2026. Актуально.",
  path: "/calculators/salary-netto-portugal",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Головна", url: "/" },
        { name: "Калькулятори", url: "/calculators" },
        { name: "Зарплата netto/bruto у Португалії", url: "/calculators/salary-netto-portugal" },
      ]} />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор зарплати netto/bruto у Португалії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть salário ilíquido (bruto) — і побачите salário líquido (на руки) після
          Segurança Social та IRS. За офіційними таблицями retenção 2026, з вибором 12/14
          виплат. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <SalaryNettoBruttoPTCalculator />
        </div>

        <CalculatorSeoBlock
          name="Калькулятор зарплати netto/bruto у Португалії 2026"
          description="Розрахунок salário líquido з ilíquido у Португалії: Segurança Social, IRS retenção, 12/14 виплат."
          path="/calculators/salary-netto-portugal"
          intro={[
            "Калькулятор зарплати netto/bruto допомагає українцям у Португалії порахувати salário líquido (чисту зарплату) з ilíquido (брутто). Введіть зарплату, оберіть кількість виплат — і побачите результат після Segurança Social та IRS.",
            "У Португалії зарплату виплачують у 14 частин: 12 місяців плюс subsídio de férias (відпускні) та subsídio de Natal (різдвяні). Соцвнесок працівника простий — фіксовані 11% від ilíquido, без стелі. Роботодавець доплачує ще 23,75%.",
            "IRS утримується не за річними траншами, а за офіційними таблицями retenção na fonte (Tabela I для não casado sem dependentes), затвердженими на 2026 рік. Розмір залежить від зарплати й сімейного стану.",
          ]}
          faqs={[
            {
              question: "Скільки соцвнесків платить працівник у Португалії?",
              answer:
                "Працівник платить фіксовані 11% від ilíquido (Segurança Social / TSU), без стелі. Роботодавець доплачує ще 23,75%. Це простіше, ніж у багатьох інших країнах.",
            },
            {
              question: "Що таке 14 виплат (subsídios) у Португалії?",
              answer:
                "Це 12 місячних зарплат плюс subsídio de férias (відпускні) та subsídio de Natal (різдвяні). Якщо обрати 12 виплат, субсидії розподіляються помісячно (prorrateados) — річний дохід той самий.",
            },
            {
              question: "Як рахується IRS retenção na fonte?",
              answer:
                "IRS утримується за офіційними таблицями retenção (Tabela I, II, III залежно від сімейного стану), а не прямо за траншами. Розмір залежить від місячної зарплати: до 920 € retenção дорівнює нулю.",
            },
            {
              question: "Яка мінімальна зарплата в Португалії 2026?",
              answer:
                "Salário mínimo 2026 — 920 €/міс ×14 виплат (12 880 €/рік). За такої зарплати IRS не утримується, лише Segurança Social, тож на руки виходить близько 818,80 €.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="salary-netto-portugal" />
      </div>
    </>
  );
}
