import { faqJsonLd, calculatorJsonLd } from "@/lib/seo";

export type CalcFaq = { question: string; answer: string };

type Props = {
  name: string;
  description: string;
  path: string;
  intro: string[];
  faqs: CalcFaq[];
};

/**
 * SEO-блок під калькулятором: FAQ-акордеон (вище — те, що люди шукають)
 * + пояснювальний текст (нижче — розгорнутий контекст) + structured data.
 */
export function CalculatorSeoBlock({ name, description, path, intro, faqs }: Props) {
  return (
    <section className="mt-14 border-t border-sand-300 pt-12">
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

      {/* FAQ — одразу після калькулятора (швидкі відповіді) */}
      {faqs.length > 0 && (
        <div className="max-w-3xl">
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

      {/* Пояснювальний текст — нижче (розгорнутий контекст) */}
      {intro.length > 0 && (
        <div className="prose-content mt-12 max-w-3xl">
          {intro.map((p, i) => (
            <p key={i} className="mb-4 leading-relaxed text-slate-600">
              {p}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
