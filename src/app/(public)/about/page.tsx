import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Про проєкт", path: "/about" });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Про проєкт", url: "/about" }]} />
      <div className="container max-w-3xl pb-16 prose-content">
        <h1 className="text-3xl font-bold text-ink">Про проєкт</h1>
        <p>Ми допомагаємо українцям за кордоном орієнтуватися у виборі країни, оформленні документів, фінансах та переїзді. На сайті ви знайдете гайди, калькулятори та каталог корисних сервісів.</p>
        <p>Мета проєкту — зібрати практичну та зрозумілу інформацію в одному місці, щоб зекономити ваш час на пошук.</p>
      </div>
    </>
  );
}
