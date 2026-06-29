import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxJdgPLCalculator } from "@/components/calculators/TaxJdgPLCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор податків ФОП (JDG) у Польщі 2026"
          description="Розрахунок податків JDG у Польщі: Ryczałt, Liniowy, Skala з урахуванням ZUS і складки zdrowotnej."
          path="/calculators/tax-jdg-poland"
          intro={[
            "Калькулятор податків ФОП (JDG — jednoosobowa działalność gospodarcza) допомагає українцям у Польщі швидко порахувати, скільки залишається на руки після всіх обов'язкових платежів. Достатньо ввести місячний дохід, обрати вид діяльності та тип ZUS — і ви побачите чистий результат для трьох форм оподаткування.",
            "У Польщі підприємець на JDG може обрати одну з трьох форм: Ryczałt (податок від обороту за фіксованою ставкою, для IT зазвичай 12%), Podatek liniowy (лінійний 19% з можливістю віднімати витрати) або Skala podatkowa (прогресивна шкала 12% та 32% з неоподатковуваним мінімумом kwota wolna 30 000 zł). Який варіант вигідніший — залежить від доходу та витрат, і калькулятор підсвічує найкращий автоматично.",
            "Крім податку, підприємець сплачує соціальні внески ZUS (повний, пільговий preferencyjny або Ulga na start у перші місяці) та медичний внесок składka zdrowotna. Розрахунок ведеться за актуальними ставками 2026 року. Для точного планування й вибору форми оподаткування рекомендуємо консультацію бухгалтера.",
          ]}
          faqs={[
            {
              question: "Яка форма оподаткування JDG найвигідніша для IT в Польщі?",
              answer:
                "Для IT-спеціалістів із невеликими витратами зазвичай найвигідніший Ryczałt 12% — податок рахується від обороту за фіксованою ставкою. Якщо у вас великі підтверджені витрати, вигіднішим може бути Liniowy 19% або Skala, де витрати зменшують базу податку. Калькулятор автоматично показує найкращий варіант для вашого доходу.",
            },
            {
              question: "Скільки становить ZUS для підприємця в Польщі 2026?",
              answer:
                "Повний соціальний ZUS у 2026 році — 1 926,77 zł на місяць. У перші 6 місяців діє Ulga na start (соціальний ZUS = 0, сплачується лише медичний внесок), а наступні 24 місяці — пільговий preferencyjny ZUS близько 456 zł на місяць.",
            },
            {
              question: "Що таке składka zdrowotna і чи віднімається вона від податку?",
              answer:
                "Складка zdrowotna — це медичний внесок. Для Ryczałt вона фіксована за порогами річного доходу, для Liniowy — 4,9% від доходу, для Skala — 9%. З 2022 року медичний внесок не віднімається від податку.",
            },
            {
              question: "Коли потрібно реєструватися платником VAT у Польщі?",
              answer:
                "Реєстрація платником VAT обов'язкова при перевищенні річного обороту 200 000 zł. Деякі види діяльності (наприклад, консалтинг, юридичні послуги) реєструються платником VAT з першої злотої. VAT не зменшує ваш дохід — ви додаєте його до ціни й перераховуєте державі.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="tax-jdg-poland" />
      </div>
    </>
  );
}
