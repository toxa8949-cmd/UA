import { notFound } from "next/navigation";
import { adminGetCountry } from "@/server/queries/admin";
import { saveCountry } from "@/server/actions/countries";
import { Field, TextArea } from "@/components/admin/Field";

export const dynamic = "force-dynamic";

export default async function EditCountry({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await adminGetCountry(id);
  if (!c) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Редагувати: {c.name}</h1>
      <form action={saveCountry} className="mt-6 max-w-2xl space-y-4">
        <input type="hidden" name="id" value={c.id} />
        <TextArea label="Короткий опис" name="short_description" defaultValue={c.short_description} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Столиця" name="capital" defaultValue={c.capital} />
          <Field label="Валюта" name="currency" defaultValue={c.currency} />
          <Field label="Мова" name="language" defaultValue={c.language} />
          <Field label="Сер. зарплата" name="average_salary" type="number" defaultValue={c.average_salary} />
          <Field label="Мін. зарплата" name="minimum_salary" type="number" defaultValue={c.minimum_salary} />
          <Field label="Сер. оренда" name="average_rent" type="number" defaultValue={c.average_rent} />
          <Field label="Індекс вартості життя" name="cost_of_living_index" type="number" defaultValue={c.cost_of_living_index} />
        </div>
        <TextArea label="Податки" name="tax_summary" defaultValue={c.tax_summary} rows={2} />
        <TextArea label="Бізнес" name="business_summary" defaultValue={c.business_summary} rows={2} />
        <TextArea label="Медицина" name="healthcare_summary" defaultValue={c.healthcare_summary} rows={2} />
        <TextArea label="Освіта" name="education_summary" defaultValue={c.education_summary} rows={2} />
        <TextArea label="Транспорт" name="transport_summary" defaultValue={c.transport_summary} rows={2} />
        <Field label="SEO Title" name="seo_title" defaultValue={c.seo_title} />
        <TextArea label="SEO Description" name="seo_description" defaultValue={c.seo_description} rows={2} />
        <button className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">Зберегти</button>
      </form>
    </div>
  );
}
