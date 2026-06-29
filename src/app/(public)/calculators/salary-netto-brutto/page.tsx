import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalaryNettoBruttoPLCalculator } from "@/components/calculators/SalaryNettoBruttoPLCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор зарплати netto/brutto у Польщі 2026"
          description="Розрахунок чистої зарплати netto з brutto у Польщі для umowa o pracę та umowa zlecenie."
          path="/calculators/salary-netto-brutto"
          intro={[
            "Калькулятор зарплати netto/brutto допомагає українцям у Польщі дізнатися, скільки залишається на руки після всіх утримань. Введіть зарплату brutto — і побачите чисту суму netto з розбивкою по ZUS, складці zdrowotnej та податку PIT.",
            "Калькулятор підтримує два найпоширеніші договори: umowa o pracę (трудовий договір) та umowa zlecenie (договір доручення). Важлива особливість: студенти до 26 років на umowa zlecenie повністю звільнені від ZUS, складки zdrowotnej та PIT — для них netto дорівнює brutto (до ліміту 85 528 zł/рік).",
            "З brutto утримуються соціальні внески працівника ZUS (13,71%), медичний внесок składka zdrowotna (9%) та податок PIT (12% до 120 000 zł/рік, 32% вище) з урахуванням неоподатковуваної суми kwota wolna.",
          ]}
          faqs={[
            {
              question: "Скільки податків утримується із зарплати в Польщі?",
              answer:
                "Із brutto утримуються: ZUS працівника 13,71% (пенсійні, рентові, на хворобу), складка zdrowotna 9% та PIT 12% (32% на дохід понад 120 000 zł/рік). Загальне утримання зазвичай становить 24–30% залежно від рівня зарплати.",
            },
            {
              question: "Чи платять студенти ZUS на umowa zlecenie?",
              answer:
                "Ні. Студенти до 26 років на umowa zlecenie повністю звільнені від ZUS, складки zdrowotnej та PIT (до ліміту 85 528 zł/рік завдяки ulga dla młodych). Фактично netto дорівнює brutto.",
            },
            {
              question: "Що таке kwota wolna od podatku?",
              answer:
                "Це неоподатковувана сума 30 000 zł/рік. Завдяки їй та механіці PIT-2 щомісячний аванс податку зменшується на 300 zł. Це підвищує вашу чисту зарплату.",
            },
            {
              question: "Яка мінімальна зарплата в Польщі 2026?",
              answer:
                "Мінімальна зарплата 2026 — 4 806 zł brutto на місяць, що дає приблизно 3 606 zł netto на руки за стандартних умов.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="salary-netto-brutto" />
      </div>
    </>
  );
}
