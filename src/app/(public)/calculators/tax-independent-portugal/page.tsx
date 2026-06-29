import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxIndependentPTCalculator } from "@/components/calculators/TaxIndependentPTCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків самозайнятого (recibos verdes) у Португалії 2026",
  description: "Порахуйте, скільки залишається на руки на recibos verdes у Португалії: regime simplificado, IRS та Segurança Social. З пільгою для першого року. Актуально на 2026.",
  path: "/calculators/tax-independent-portugal",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки самозайнятого у Португалії", url: "/calculators/tax-independent-portugal" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків самозайнятого у Португалії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки на recibos verdes
          (regime simplificado). Розрахунок враховує IRS і Segurança Social, з пільгою для
          першого року діяльності. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxIndependentPTCalculator />
        </div>

        <CalculatorSeoBlock
          name="Калькулятор податків самозайнятого (recibos verdes) у Португалії 2026"
          description="Розрахунок податків recibos verdes у Португалії: regime simplificado, IRS та Segurança Social."
          path="/calculators/tax-independent-portugal"
          intro={[
            "Калькулятор податків для самозайнятого (trabalhador independente, що працює через recibos verdes) допомагає українцям у Португалії порахувати чистий дохід після IRS та Segurança Social. Введіть місячний дохід, оберіть коефіцієнт за видом діяльності — і побачите результат.",
            "У regime simplificado оподатковується не весь дохід, а його частина: дохід × коефіцієнт. Для IT та професійних послуг коефіцієнт зазвичай 0,75, для інших послуг — 0,35, для торгівлі — 0,15. На цю базу нараховується прогресивний IRS за траншами від 12,5% до 48%.",
            "Segurança Social рахується окремо — від 70% доходу за ставкою 21,4% (фактично близько 15% від обороту). Для новачків діє пільга: коефіцієнт −50% у перший рік і звільнення від соцвнесків перші 12 місяців. Розрахунок за актуальними даними 2026 року.",
          ]}
          faqs={[
            {
              question: "Що таке regime simplificado в Португалії?",
              answer:
                "Це спрощений режим оподаткування, де оподатковується не весь дохід, а його частина за коефіцієнтом: для IT/послуг 0,75, інших послуг 0,35, торгівлі 0,15. Доступний при річному доході до 200 000 €.",
            },
            {
              question: "Які пільги для новачків (recibos verdes) у Португалії?",
              answer:
                "У перший рік діяльності коефіцієнт IRS зменшується на 50%, у другий — на 25%. Крім того, перші 12 місяців діє звільнення від внесків Segurança Social. Це суттєво збільшує дохід на руки на старті.",
            },
            {
              question: "Скільки становить Segurança Social для самозайнятого?",
              answer:
                "Ставка — 21,4%, але база — лише 70% доходу від послуг, тож фактично близько 15% від обороту. Мінімальний внесок — 20 €/міс. База переглядається щоквартально.",
            },
            {
              question: "Коли потрібно реєструватися платником IVA?",
              answer:
                "Звільнення від IVA діє при річному обороті до 15 000 €. При більшому доході потрібна реєстрація платником IVA зі ставкою 23%.",
            },
          ]}
        />
      </div>
    </>
  );
}
