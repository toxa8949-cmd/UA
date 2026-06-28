import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Контакти", path: "/contact" });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Контакти", url: "/contact" }]} />
      <div className="container max-w-3xl pb-16 prose-content">
        <h1 className="text-3xl font-bold text-slate-900">Контакти</h1>
        <p>Маєте запитання, пропозицію щодо співпраці чи знайшли неточність? Напишіть нам.</p>
        <p>Email: <a href="mailto:hello@example.com">hello@example.com</a></p>
      </div>
    </>
  );
}
