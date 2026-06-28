import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Політика конфіденційності", path: "/privacy-policy" });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Політика конфіденційності", url: "/privacy-policy" }]} />
      <div className="container max-w-3xl pb-16 prose-content">
        <h1 className="text-3xl font-bold text-ink">Політика конфіденційності</h1>
        <p>Ми поважаємо вашу приватність. Ця сторінка пояснює, які дані ми збираємо та як їх використовуємо.</p>
        <h2>Які дані ми збираємо</h2>
        <p>Email-адресу, якщо ви підписуєтесь на розсилку. Знеособлену аналітику відвідувань (через інструменти веб-аналітики).</p>
        <h2>Як ми використовуємо дані</h2>
        <p>Для надсилання корисних оновлень та покращення сайту. Ми не продаємо ваші персональні дані третім сторонам.</p>
        <h2>Файли cookie</h2>
        <p>Сайт може використовувати cookie для аналітики та коректної роботи. Ви можете керувати ними в налаштуваннях браузера.</p>
      </div>
    </>
  );
}
