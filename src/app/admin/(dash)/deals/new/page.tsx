import { Field, TextArea, StatusSelect } from "@/components/admin/Field";
import { saveDeal } from "@/server/actions/deals";
import { adminListServices, adminListCountries } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function NewDeal() {
  const [services, countries] = await Promise.all([
    adminListServices(),
    adminListCountries(),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Новий бонус</h1>
      <form action={saveDeal} className="mt-6 max-w-2xl space-y-4">
        <Field label="Назва" name="title" required />
        <Field label="Slug" name="slug" placeholder="auto" />
        <TextArea label="Опис" name="description" rows={3} />
        <Field label="Сума бонусу (текст)" name="bonus_amount" placeholder="напр. 50€" />
        <Field label="Affiliate URL" name="affiliate_url" />
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Сервіс</span>
            <select name="service_id" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— —</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Країна</span>
            <select name="country_id" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">— —</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <TextArea label="Умови" name="terms" rows={2} />
        <StatusSelect defaultValue="published" />
        <button className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">Зберегти</button>
      </form>
    </div>
  );
}
