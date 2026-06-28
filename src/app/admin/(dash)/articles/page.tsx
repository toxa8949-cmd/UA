import Link from "next/link";
import { adminListArticles } from "@/server/queries/admin";
import { deleteArticle } from "@/server/actions/articles";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  const articles = await adminListArticles();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Статті</h1>
        <Link href="/admin/articles/new" className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus size={16} /> Нова стаття
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Заголовок</th>
              <th className="p-3">Країна</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td className="p-3 text-slate-800">{a.title}</td>
                <td className="p-3 text-slate-500">{a.country_name ?? "—"}</td>
                <td className="p-3 text-slate-500">{a.status}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/articles/${a.id}/edit`} className="rounded p-1.5 text-slate-500 hover:bg-slate-100">
                      <Pencil size={16} />
                    </Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="rounded p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
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
