import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Умови користування", path: "/terms" });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Умови користування", url: "/terms" }]} />
      <div className="container max-w-3xl pb-16 prose-content">
        <h1 className="text-3xl font-bold text-ink">Умови користування</h1>
        <p>Використовуючи цей сайт, ви погоджуєтесь із наведеними нижче умовами.</p>
        <h2>Характер інформації</h2>
        <p>Уся інформація на сайті має ознайомчий характер і не є юридичною, податковою або фінансовою консультацією. Перед прийняттям рішень звертайтеся до відповідних спеціалістів.</p>
        <h2>Відповідальність</h2>
        <p>Ми прагнемо надавати точну інформацію, але не гарантуємо її повноту чи актуальність. Ви використовуєте сайт на власний розсуд.</p>
        <h2>Партнерські посилання</h2>
        <p>Сайт може містити партнерські посилання. Деталі — на сторінці «Партнерські посилання».</p>
      </div>
    </>
  );
}
