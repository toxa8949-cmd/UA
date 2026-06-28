import { Field, TextArea, StatusSelect } from "@/components/admin/Field";
import { saveService } from "@/server/actions/services";
import type { Service, Country, Category } from "@/types/db";

export function ServiceForm({
  service, countries, categories, selectedCountryIds = [],
}: {
  service?: Service | null;
  countries: Country[];
  categories: Category[];
  selectedCountryIds?: string[];
}) {
  return (
    <form action={saveService} className="max-w-2xl space-y-4">
      {service && <input type="hidden" name="id" value={service.id} />}
      <Field label="Назва" name="name" defaultValue={service?.name} required />
      <Field label="Slug" name="slug" defaultValue={service?.slug} placeholder="auto" />
      <TextArea label="Опис" name="description" defaultValue={service?.description} rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Website URL" name="website_url" defaultValue={service?.website_url} />
        <Field label="Affiliate URL" name="affiliate_url" defaultValue={service?.affiliate_url} />
        <Field label="Logo URL" name="logo" defaultValue={service?.logo} />
        <Field label="Рейтинг (0-5)" name="rating" type="number" defaultValue={service?.rating} />
      </div>
      <Field label="Ціни (короткий опис)" name="pricing_summary" defaultValue={service?.pricing_summary} />

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Категорія</span>
        <select name="category_id" defaultValue={service?.category_id ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="">— без категорії —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      <TextArea label="Переваги (по одній на рядок)" name="pros" defaultValue={service?.pros?.join("\n")} rows={4} />
      <TextArea label="Недоліки (по одній на рядок)" name="cons" defaultValue={service?.cons?.join("\n")} rows={3} />

      <div>
        <span className="text-sm font-medium text-slate-700">Країни</span>
        <div className="mt-2 flex flex-wrap gap-3">
          {countries.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="country_ids" value={c.id}
                defaultChecked={selectedCountryIds.includes(c.id)} />
              {c.emoji} {c.name}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_featured" defaultChecked={service?.is_featured} />
        Рекомендований (featured)
      </label>

      <StatusSelect defaultValue={service?.status} />
      <button className="rounded-lg bg-emerald px-5 py-2.5 font-medium text-white hover:bg-emerald-700">Зберегти</button>
    </form>
  );
}
