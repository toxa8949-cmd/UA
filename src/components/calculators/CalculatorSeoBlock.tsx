import { faqJsonLd, calculatorJsonLd } from "@/lib/seo";

export type CalcFaq = { question: string; answer: string };

type Props = {
  /** Назва калькулятора для JSON-LD WebApplication */
  name: string;
  /** Опис для JSON-LD */
  description: string;
  /** Шлях сторінки (для JSON-LD url) */
  path: string;
  /** SEO-текст (абзаци) під калькулятором */
  intro: string[];
  /** FAQ — і видимий акордеон, і JSON-LD FAQPage */
  faqs: CalcFaq[];
};

/**
 * SEO-блок під калькулятором: пояснювальний текст + FAQ-акордеон + structured data.
 * Дає Google контент для індексації й rich results (FAQ у видачі).
 */
export function CalculatorSeoBlock({ name, description, path, intro, faqs }: Props) {
  return (
    <section className="mt-16 border-t border-sand-300 pt-12">
      {/* structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(calculatorJsonLd({ name, description, url: path })),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}

      {/* SEO-текст */}
      {intro.length > 0 && (
        <div className="prose-content max-w-3xl">
          {intro.map((p, i) => (
            <p key={i} className="mb-4 leading-relaxed text-slate-600">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* FAQ-акордеон */}
      {faqs.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="mb-5 text-2xl font-bold text-ink">Часті запитання</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
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
      )}
    </section>
  );
}
