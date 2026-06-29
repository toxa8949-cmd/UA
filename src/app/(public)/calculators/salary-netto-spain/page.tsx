import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoESCalculator } from "@/components/calculators/SalaryNettoBruttoESCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор зарплати netto/bruto в Іспанії 2026"
          description="Розрахунок salario neto з bruto в Іспанії: Seguridad Social, IRPF, 12/14 виплат."
          path="/calculators/salary-netto-spain"
          intro={[
            "Калькулятор зарплати netto/bruto допомагає українцям в Іспанії порахувати salario neto (чисту зарплату) з річної bruto. Введіть річну зарплату, оберіть кількість виплат і ситуацію — і побачите результат після Seguridad Social та IRPF.",
            "В Іспанії зарплату зазвичай вказують річну, а виплачують у 12 або 14 частин: 14 виплат — це 12 місяців плюс дві extra paga (влітку та на Різдво). Соцвнески працівника невеликі (близько 6,5%), бо основну частину (близько 30%) платить роботодавець.",
            "IRPF утримується як retención прогресивно (від 19% до 47%) з урахуванням mínimo personal 5 550 € та пільг на дітей. Для низьких доходів діє reducción por rendimientos del trabajo.",
          ]}
          faqs={[
            {
              question: "Що таке 12 і 14 виплат (pagas) в Іспанії?",
              answer:
                "В Іспанії річну зарплату ділять на 14 виплат (12 місяців + 2 extra paga влітку й на Різдво) або на 12 (pagas prorrateadas). Річна сума однакова, різниться лише розмір місячної виплати.",
            },
            {
              question: "Скільки соцвнесків платить працівник в Іспанії?",
              answer:
                "Працівник платить близько 6,5% (contingencias comunes, desempleo, formación, MEI) для безстрокового договору. Решту — близько 30% — доплачує роботодавець. Це набагато менше, ніж у autónomo.",
            },
            {
              question: "Як впливають діти на податок в Іспанії?",
              answer:
                "Діти збільшують mínimo personal y familiar, що зменшує IRPF: 2 400 € за першу дитину, 2 700 за другу, 4 000 за третю, 4 500 за четверту+. Це знижує податок і підвищує чисту зарплату.",
            },
            {
              question: "Яка мінімальна зарплата в Іспанії 2026?",
              answer:
                "SMI 2026 — 1 221 €/міс ×14 виплат (17 094 €/рік). За 2026 рік мінімальна зарплата зазвичай звільнена від IRPF, але Seguridad Social утримується.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="salary-netto-spain" />
      </div>
    </>
  );
}
