import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { CALCULATORS } from "@/lib/constants";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { Calculator } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Калькулятори податків і зарплати для українців за кордоном 2026",
  description: "Безкоштовні калькулятори: податки ФОП, зарплата netto/brutto, вартість життя та бюджет переїзду для Польщі, Німеччини, Чехії, Іспанії та Португалії. Актуально на 2026.",
  path: "/calculators",
  ogEyebrow: "Калькулятори",
});

type Calc = {
  slug: string;
  title: string;
  description: string;
  country: string | null;
  group: string;
};

const FAQS = [
  {
    question: "Які калькулятори тут є?",
    answer:
      "Калькулятори податків для самозайнятих (ФОП/JDG/OSVČ/autónomo/Freiberufler), калькулятори зарплати netto/brutto для найманих працівників, а також калькулятори вартості життя й бюджету переїзду. Доступні країни: Польща, Німеччина, Чехія, Іспанія та Португалія.",
  },
  {
    question: "Наскільки точні розрахунки?",
    answer:
      "Усі калькулятори використовують актуальні ставки й формули 2026 року з офіційних джерел і вивірені на контрольних прикладах. Результат орієнтовний — для остаточних рішень радимо звіритися з місцевим бухгалтером.",
  },
  {
    question: "Калькулятори безкоштовні?",
    answer:
      "Так, усі калькулятори повністю безкоштовні та не потребують реєстрації. Просто введіть свої дані й отримайте результат.",
  },
  {
    question: "Для кого ці калькулятори?",
    answer:
      "Для українців, які живуть і працюють за кордоном — найманих працівників, самозайнятих, підприємців, а також тих, хто планує переїзд і хоче оцінити доходи й витрати.",
  },
];

export default function CalculatorsPage() {
  const all = CALCULATORS as unknown as Calc[];
  const tax = all.filter((c) => c.group === "tax");
  const salary = all.filter((c) => c.group === "salary");
  const general = all.filter((c) => c.group === "general");

  const renderGroup = (title: string, desc: string, items: Calc[]) =>
    items.length > 0 ? (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {items.map((c) => (
            <Link key={c.slug} href={`/calculators/${c.slug}`}>
              <Card className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald">
                  <Calculator size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-ink">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Калькулятори", url: "/calculators" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <div className="container pb-16">
        <h1 className="text-3xl font-bold text-ink">
          Калькулятори податків і зарплати за кордоном
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Безкоштовні калькулятори для українців у Європі: порахуйте податки на ФОП, чисту
          зарплату netto/brutto, вартість життя та бюджет переїзду. Актуальні ставки 2026 року
          для Польщі, Німеччини, Чехії, Іспанії та Португалії.
        </p>

        {renderGroup(
          "Податки для самозайнятих (ФОП)",
          "Скільки залишається на руки після податків і соцвнесків як підприємець або фрілансер.",
          tax
        )}
        {renderGroup(
          "Зарплата netto / brutto",
          "Чиста зарплата на руки після податків і внесків для найманих працівників.",
          salary
        )}
        {renderGroup(
          "Планування та переїзд",
          "Оцініть вартість життя у вибраній країні та бюджет на переїзд.",
          general
        )}

        {/* SEO-текст */}
        <section className="mt-16 max-w-3xl border-t border-sand-300 pt-12">
          <div className="prose-content">
            <p className="mb-4 leading-relaxed text-slate-600">
              Переїзд за кордон ставить багато фінансових питань: скільки податків доведеться
              платити, яка зарплата буде на руки, чи вистачить доходу на життя. Наші калькулятори
              допомагають знайти відповіді швидко й точно — без потреби розбиратися в складному
              місцевому законодавстві.
            </p>
            <p className="mb-4 leading-relaxed text-slate-600">
              Для самозайнятих ми зробили калькулятори податків з урахуванням усіх форм
              оподаткування кожної країни: Ryczałt, Liniowy чи Skala в Польщі, paušální daň у
              Чехії, regime simplificado в Португалії, cuota de autónomos в Іспанії та
              Freiberufler/Gewerbe у Німеччині. Для найманих працівників — точний розрахунок
              netto з brutto з усіма внесками та податками.
            </p>
            <p className="leading-relaxed text-slate-600">
              Усі розрахунки базуються на актуальних даних 2026 року й вивірені на офіційних
              прикладах. Результат орієнтовний — для прийняття рішень рекомендуємо консультацію з
              місцевим бухгалтером або податковим радником.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="mb-5 text-2xl font-bold text-ink">Часті запитання</h2>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-sand-300 bg-white p-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium text-ink">
                    {f.question}
                    <span className="text-slate-400 transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
