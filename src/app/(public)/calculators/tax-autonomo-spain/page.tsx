import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TaxAutonomoESCalculator } from "@/components/calculators/TaxAutonomoESCalculator";
import { CalculatorSeoBlock } from "@/components/calculators/CalculatorSeoBlock";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятор податків autónomo в Іспанії 2026",
  description: "Порахуйте, скільки залишається на руки як autónomo в Іспанії: cuota за траншами, IRPF та tarifa plana для новачків. Актуально на 2026.",
  path: "/calculators/tax-autonomo-spain",
  ogEyebrow: "Калькулятор",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Калькулятори", url: "/calculators" },
          { name: "Податки autónomo в Іспанії", url: "/calculators/tax-autonomo-spain" },
        ]}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятор податків autónomo в Іспанії
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Введіть місячний дохід — і побачите, скільки залишається на руки як autónomo
          (estimación directa simplificada). Розрахунок враховує cuota за траншами доходу та
          IRPF, з пільгою tarifa plana для новачків. Актуально на 2026 рік.
        </p>
        <div className="mt-8">
          <TaxAutonomoESCalculator />
        </div>

        <CalculatorSeoBlock
          name="Калькулятор податків autónomo в Іспанії 2026"
          description="Розрахунок податків autónomo в Іспанії: cuota за траншами доходу, IRPF та tarifa plana для новачків."
          path="/calculators/tax-autonomo-spain"
          intro={[
            "Калькулятор податків autónomo (trabajador autónomo — самозайнята особа) допомагає українцям в Іспанії порахувати чистий дохід після cuota de autónomos та IRPF. Введіть місячний дохід і витрати — і побачите результат із розбивкою.",
            "Головна особливість Іспанії — cuota de autónomos (соцвнесок) рахується за траншами реального доходу (rendimiento neto), а не від обороту. Чим більше ви заробляєте, тим вища місячна cuota. Для новачків діє tarifa plana — пільгова cuota близько 80 €/міс у перші місяці.",
            "IRPF — прогресивний податок за траншами від 19% до 47%, з урахуванням mínimo personal 5 550 €. У режимі estimación directa simplificada можна списати 5% витрат без чеків (gastos de difícil justificación, максимум 2 000 €). Розрахунок за актуальними даними 2026 року.",
          ]}
          faqs={[
            {
              question: "Як рахується cuota de autónomos в Іспанії 2026?",
              answer:
                "Cuota рахується за траншами реального доходу (rendimiento neto = дохід − витрати − 7%). Чим вищий дохід, тим вища місячна cuota — від близько 200 € до понад 600 €. Для калькулятора береться мінімальна cuota за траншем.",
            },
            {
              question: "Що таке tarifa plana для новачків?",
              answer:
                "Tarifa plana — пільгова cuota близько 80 €/міс для нових autónomo у перші 12 місяців (може продовжуватися ще на 12). Це суттєво знижує витрати на старті діяльності.",
            },
            {
              question: "Чи є в Іспанії поріг звільнення від IVA?",
              answer:
                "Ні, на відміну від Португалії, в Іспанії немає загального порогу звільнення від IVA. Autónomo зазвичай реєструється й декларує IVA (21%) з початку діяльності, крім звільнених сфер (медицина, освіта тощо).",
            },
            {
              question: "Що таке retenciones для autónomo?",
              answer:
                "Retenciones — це авансові утримання IRPF (15%, або 7% у перші роки професійної діяльності), які клієнт утримує з вашого інвойсу. Це не додатковий податок, а аванс у рахунок річного IRPF.",
            },
          ]}
        />

        <RelatedCalculators currentSlug="tax-autonomo-spain" />
      </div>
    </>
  );
}
