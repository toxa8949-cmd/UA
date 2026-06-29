import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoCZCalculator } from "@/components/calculators/SalaryNettoBruttoCZCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
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

        <CalculatorSeoBlock
          name="Калькулятор зарплати netto/brutto у Чехії 2026"
          description="Розрахунок čistá mzda з hrubá mzda у Чехії: sociální, zdravotní pojištění, daň з урахуванням slev."
          path="/calculators/salary-netto-czech"
          intro={[
            "Калькулятор зарплати netto/brutto допомагає українцям у Чехії порахувати čistá mzda (чисту зарплату) з hrubá mzda (брутто). Введіть зарплату — і побачите результат після внесків та податку, з урахуванням пільг на дітей.",
            "Із hrubá mzda утримуються соціальне страхування працівника (sociální 7,1%), медичне (zdravotní 4,5%) та податок з доходу (daň 15%, 23% для високих доходів). Решту внесків — sociální 24,8% і zdravotní 9% — платить роботодавець окремо.",
            "Податок зменшується на sleva na poplatníka (2 570 Kč/міс) та пільги на дітей (sleva na dítě). Якщо дитяча пільга перевищує податок, різниця повертається як daňový bonus — доплата до зарплати. Розрахунок за актуальними ставками 2026 року.",
          ]}
          faqs={[
            {
              question: "Скільки внесків утримується із зарплати в Чехії?",
              answer:
                "Працівник платить sociální pojištění 7,1% та zdravotní pojištění 4,5% — разом 11,6% від hrubá mzda. Плюс податок з доходу 15%. Решту соцвнесків (33,8%) доплачує роботодавець понад вашу зарплату.",
            },
            {
              question: "Що таке sleva na poplatníka?",
              answer:
                "Це базова знижка на платника податку — 30 840 Kč/рік (2 570 Kč/міс). Вона зменшує сам податок напряму, а не базу. Це аналог польської kwota wolna.",
            },
            {
              question: "Як працює пільга на дітей у Чехії?",
              answer:
                "Sleva na dítě зменшує податок: 1 267 Kč/міс за першу дитину, 1 860 за другу, 2 320 за третю+. Якщо пільга перевищує податок, різниця повертається як daňový bonus — реальна доплата до зарплати.",
            },
            {
              question: "Яка мінімальна зарплата в Чехії 2026?",
              answer:
                "Мінімальна зарплата 2026 — 22 400 Kč brutto на місяць, що дає приблизно 19 011 Kč čistá на руки без дітей.",
            },
          ]}
        />
      </div>
    </>
  );
}
