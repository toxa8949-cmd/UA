import Link from "next/link";
import { adminListDeals } from "@/server/queries/admin";
import { deleteDeal } from "@/server/actions/deals";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDeals() {
  const deals = await adminListDeals();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Бонуси</h1>
        <Link href="/admin/deals/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Plus size={16} /> Новий бонус
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {deals.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">Поки немає бонусів.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="p-3">Назва</th><th className="p-3">Бонус</th><th className="p-3">Статус</th><th className="p-3 text-right">Дії</th></tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="p-3 text-slate-800">{d.title}</td>
                  <td className="p-3 text-slate-500">{d.bonus_amount ?? "—"}</td>
                  <td className="p-3 text-slate-500">{d.status}</td>
                  <td className="p-3">
                    <form action={deleteDeal} className="flex justify-end">
                      <input type="hidden" name="id" value={d.id} />
                      <button className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
