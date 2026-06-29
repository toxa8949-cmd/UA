import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxOsvcCZCalculator } from "@/components/calculators/TaxOsvcCZCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор податків ФОП (OSVČ) у Чехії 2026"
          description="Розрахунок податків OSVČ у Чехії: paušální daň, паушальні та реальні витрати з урахуванням sociálního і zdravotního pojištění."
          path="/calculators/tax-osvc-czech"
          intro={[
            "Калькулятор податків OSVČ (osoba samostatně výdělečně činná — самозайнята особа) допомагає українцям у Чехії порахувати, скільки залишається на руки після податку та обов'язкових внесків. Введіть місячний дохід, оберіть вид діяльності — і побачите результат для трьох режимів.",
            "У Чехії підприємець може обрати paušální daň (єдиний фіксований платіж за місяць, що включає податок, соціальне й медичне страхування разом), режим паушальних витрат (výdajový paušál — списання 40/60/80% доходу як витрат без чеків) або реальні витрати. Для IT найчастіше використовують 60% паушальних витрат або paušální daň.",
          ]}
          faqs={[
            {
              question: "Що таке paušální daň і кому вона вигідна?",
              answer:
                "Paušální daň — це єдиний фіксований платіж за місяць, що включає податок, соціальне й медичне страхування разом. Вона вигідна підприємцям без великих витрат і не платникам DPH, бо звільняє від подання декларацій. У 2026 році I пасмо коштує близько 9 573 Kč/міс у середньому.",
            },
            {
              question: "Що таке паушальні витрати (výdajový paušál)?",
              answer:
                "Це списання відсотка доходу як витрат без чеків для зменшення податку: 80% для ремесла, 60% для IT та більшості послуг, 40% для вільних професій. Якщо ваші реальні витрати менші за цей відсоток — різниця залишається вам.",
            },
            {
              question: "Скільки становлять внески OSVČ у Чехії 2026?",
              answer:
                "Мінімальне соціальне страхування — близько 60 060 Kč/рік, медичне — 39 672 Kč/рік. Вони рахуються від частки прибутку: соціальне від 55%, медичне від 50%. При вищому доході внески зростають.",
            },
            {
              question: "Коли потрібна реєстрація платником DPH у Чехії?",
              answer:
                "Реєстрація DPH обов'язкова при перевищенні обороту 2 000 000 Kč за календарний рік. Paušální daň доступний лише не платникам DPH.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="tax-osvc-czech" />
      </div>
    </>
  );
}
