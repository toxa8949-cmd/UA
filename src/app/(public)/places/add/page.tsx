import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SubmitPlaceForm } from "@/components/place/SubmitPlaceForm";
import { getLandingIndex } from "@/server/queries/places";
import { buildMetadata } from "@/lib/seo";
import { BadgeCheck, Users, Megaphone } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Додати бізнес у каталог — безкоштовно",
  description:
    "Додайте свій бізнес чи послуги до каталогу «Українцям поруч» безкоштовно. Українці у вашому місті знайдуть вас за категорією та локацією.",
  path: "/places/add",
});

const BENEFITS = [
  {
    icon: Users,
    title: "Вас знайдуть свої",
    text: "Українці шукають послуги рідною мовою — ваш заклад зʼявиться у каталозі за містом і категорією.",
  },
  {
    icon: BadgeCheck,
    title: "Безкоштовно",
    text: "Базове розміщення не коштує нічого. Заповніть форму — після перевірки заклад буде опубліковано.",
  },
  {
    icon: Megaphone,
    title: "Окрема сторінка",
    text: "Кожен заклад отримує власну сторінку з контактами, графіком та FAQ — вона індексується Google.",
  },
];

export default async function AddPlacePage() {
  const index = await getLandingIndex();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Головна", url: "/" },
          { name: "Українцям поруч", url: "/places" },
          { name: "Додати бізнес", url: "/places/add" },
        ]}
      />
      <div className="container pb-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-ink">
            Додайте свій бізнес у каталог
          </h1>
          <p className="mt-3 text-slate-600">
            Ви — український спеціаліст або власник закладу за кордоном?
            Розкажіть про себе українській спільноті у вашому місті. Розміщення
            в каталозі «Українцям поруч» безкоштовне.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-sand-300 bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald">
                <b.icon size={18} />
              </span>
              <h2 className="mt-3 font-display font-semibold text-ink">{b.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-2xl rounded-2xl border border-sand-300 bg-white p-6 sm:p-8">
          <SubmitPlaceForm countries={index.countries} cities={index.cities} />
        </div>
      </div>
    </>
  );
}
