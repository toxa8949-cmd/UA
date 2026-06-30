import Link from "next/link";
import { adminListPlaces } from "@/server/queries/admin";
import { setPlaceStatus, deletePlace } from "@/server/actions/places";
import { placeCategoryLabel } from "@/lib/places";
import { Plus, Pencil, Trash2, Check, X, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Заявка", cls: "bg-amber-100 text-amber-700" },
  published: { label: "Опубліковано", cls: "bg-emerald-50 text-emerald" },
  rejected: { label: "Відхилено", cls: "bg-red-50 text-red-600" },
  archived: { label: "Архів", cls: "bg-slate-100 text-slate-500" },
};

export default async function AdminPlaces() {
  const places = await adminListPlaces();
  const pending = places.filter((p) => p.status === "pending");
  const rest = places.filter((p) => p.status !== "pending");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Заклади</h1>
        <Link
          href="/admin/places/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={16} /> Новий заклад
        </Link>
      </div>

      {/* Заявки на модерацію */}
      {pending.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
            Нові заявки
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-amber-200 bg-amber-50/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {placeCategoryLabel(p.category)}
                      {p.city?.name && ` · ${p.city.name}`}
                      {p.country?.name && `, ${p.country.name}`}
                    </p>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-slate-600">
                        {p.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {p.phone && <span>☎ {p.phone}</span>}
                      {p.website && <span>🌐 {p.website}</span>}
                      {p.email && <span>✉ {p.email}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/places/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Eye size={14} /> Переглянути
                    </Link>
                    <form action={setPlaceStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="published" />
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                        <Check size={14} /> Опублікувати
                      </button>
                    </form>
                    <form action={setPlaceStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                        <X size={14} /> Відхилити
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Решта закладів */}
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Назва</th>
              <th className="p-3">Категорія</th>
              <th className="p-3">Місто</th>
              <th className="p-3">План</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((p) => {
              const st = STATUS_LABEL[p.status] ?? STATUS_LABEL.archived;
              return (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="p-3 text-slate-800">{p.name}</td>
                  <td className="p-3 text-slate-500">{placeCategoryLabel(p.category)}</td>
                  <td className="p-3 text-slate-500">{p.city?.name ?? "—"}</td>
                  <td className="p-3 text-slate-500">
                    {p.plan !== "free" ? (
                      <span className="rounded bg-gold-50 px-1.5 py-0.5 text-xs font-medium text-gold-600">
                        {p.plan}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/places/${p.id}/edit`}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil size={16} />
                      </Link>
                      <form action={deletePlace}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded p-1.5 text-red-500 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
