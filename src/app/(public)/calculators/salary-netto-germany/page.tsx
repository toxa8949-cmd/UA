import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoDECalculator } from "@/components/calculators/SalaryNettoBruttoDECalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор зарплати netto/brutto у Німеччині 2026"
          description="Розрахунок Netto з Brutto у Німеччині: Lohnsteuer, Soli, соцвнески з урахуванням Steuerklasse."
          path="/calculators/salary-netto-germany"
          intro={[
            "Калькулятор зарплати netto/brutto (Brutto-Netto-Rechner) допомагає українцям у Німеччині порахувати чисту зарплату Netto з Brutto. Введіть зарплату, оберіть Steuerklasse — і побачите результат після соцвнесків, Lohnsteuer та Soli.",
            "У Німеччині розмір податку залежить не лише від суми, а й від Steuerklasse (податкового класу за сімейним станом): I — неодружені, III/IV — подружжя. Прибутковий податок Lohnsteuer рахується за прогресивною формулою §32a EStG.",
            "Із Brutto утримуються соцвнески працівника (пенсійне RV, безробіття AV, медичне KV, догляд PV — разом близько 21% до стелі), Lohnsteuer та Solidaritätszuschlag. Опційно — церковний податок Kirchensteuer. Розрахунок орієнтовний за даними 2026 року — для точності зверніться до Lohnbuchhalter.",
          ]}
          faqs={[
            {
              question: "Що таке Steuerklasse і як він впливає на зарплату?",
              answer:
                "Steuerklasse — податковий клас за сімейним станом. Klasse I — для неодружених (базовий), III — для подружжя, де ви заробляєте більше (нижчий податок через Ehegattensplitting), IV — для подружжя з рівними доходами. Клас суттєво впливає на розмір Lohnsteuer.",
            },
            {
              question: "Скільки соцвнесків утримується із зарплати в Німеччині?",
              answer:
                "Працівник платить близько 21%: пенсійне (RV 9,3%), безробіття (AV 1,3%), медичне (KV 8,75%), догляд (PV 2,4% для бездітних). Внески мають стелі (BBG), тому на високих зарплатах ефективна ставка падає.",
            },
            {
              question: "Хто платить Solidaritätszuschlag?",
              answer:
                "Soli — 5,5% від Lohnsteuer, але з Freigrenze: більшість працівників із низьким і середнім доходом його не платять. Він з'являється лише на високих зарплатах.",
            },
            {
              question: "Яка мінімальна зарплата в Німеччині 2026?",
              answer:
                "Mindestlohn 2026 — 13,90 €/год, що при повній зайнятості дає приблизно 2 343 € brutto на місяць.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="salary-netto-germany" />
      </div>
    </>
  );
}
