import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Партнерські посилання", path: "/affiliate-disclosure" });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Партнерські посилання", url: "/affiliate-disclosure" }]} />
      <div className="container max-w-3xl pb-16 prose-content">
        <h1 className="text-3xl font-bold text-slate-900">Партнерські посилання</h1>
        <p>На сайті можуть бути партнерські посилання. Якщо ви переходите за таким посиланням і реєструєтесь або купуєте послугу, ми можемо отримати комісію. Це не впливає на вашу ціну.</p>
        <p>Ми рекомендуємо лише ті сервіси, які вважаємо корисними для українців за кордоном. Проте остаточне рішення завжди за вами — уважно перевіряйте умови на сайтах сервісів.</p>
      </div>
    </>
  );
}
