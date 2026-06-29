import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxFreelancerDECalculator } from "@/components/calculators/TaxFreelancerDECalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
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

        <CalculatorSeoBlock
          name="Калькулятор податків Freiberufler / Gewerbe у Німеччині 2026"
          description="Розрахунок податків самозайнятого в Німеччині: Einkommensteuer, Soli, Gewerbesteuer для Freiberufler і Gewerbe."
          path="/calculators/tax-freelancer-germany"
          intro={[
            "Калькулятор податків для самозайнятого в Німеччині допомагає українцям порахувати чистий дохід після Einkommensteuer та інших зборів. Введіть дохід, витрати й соцстрахування, оберіть тип діяльності — і побачите результат.",
            "У Німеччині самозайнятий може бути Freiberufler (вільна професія: IT-консалтинг, дизайн, інженерія) або Gewerbe (підприємництво, торгівля). Ключова різниця: Freiberufler не платить Gewerbesteuer (промисловий податок), тому за інших рівних умов це вигідніше.",
            "Прибутковий податок Einkommensteuer рахується за прогресивною формулою §32a EStG з неоподатковуваним мінімумом Grundfreibetrag 12 348 €. Додатково може застосовуватися Solidaritätszuschlag (5,5% від податку, але більшість його не платять). Соцстрахування в Німеччині індивідуальне. Розрахунок за актуальними даними 2026 року — для точності зверніться до Steuerberater.",
          ]}
          faqs={[
            {
              question: "Чим відрізняється Freiberufler від Gewerbe?",
              answer:
                "Freiberufler — це вільні професії (IT-консультанти, лікарі, юристи, дизайнери), які не платять Gewerbesteuer. Gewerbe — торгівля та більшість бізнесу, які платять Gewerbesteuer. Простий продаж софту може кваліфікуватися як Gewerbe, а кваліфікована IT-консультація — як Freiberufler.",
            },
            {
              question: "Як рахується Einkommensteuer у Німеччині 2026?",
              answer:
                "За прогресивною формулою §32a EStG: до 12 348 € податку немає (Grundfreibetrag), далі ставка зростає від 14% до 42% (від 69 879 €) і 45% (від 277 826 €). Це формула-поліном, а не прості транші.",
            },
            {
              question: "Хто платить Solidaritätszuschlag?",
              answer:
                "Soli — 5,5% від податку, але діє Freigrenze: при Einkommensteuer до 20 350 €/рік Soli дорівнює нулю. Тому більшість самозайнятих із низьким і середнім доходом його не платять.",
            },
            {
              question: "Що таке Kleinunternehmerregelung?",
              answer:
                "Це спрощення для малого бізнесу (§19 UStG): при обороті до 25 000 € торік і 100 000 € цьогоріч можна не нараховувати USt (ПДВ 19%). Інакше USt додається до рахунків і перераховується державі.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="tax-freelancer-germany" />
      </div>
    </>
  );
}
