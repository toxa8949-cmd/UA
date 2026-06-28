import Link from "next/link";
import { adminListServices } from "@/server/queries/admin";
import { deleteService } from "@/server/actions/services";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  const services = await adminListServices();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Сервіси</h1>
        <Link href="/admin/services/new" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Plus size={16} /> Новий сервіс
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="p-3">Назва</th><th className="p-3">Featured</th><th className="p-3">Статус</th><th className="p-3 text-right">Дії</th></tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-3 text-slate-800">{s.name}</td>
                <td className="p-3 text-slate-500">{s.is_featured ? "✓" : "—"}</td>
                <td className="p-3 text-slate-500">{s.status}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/services/${s.id}/edit`} className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><Pencil size={16} /></Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
