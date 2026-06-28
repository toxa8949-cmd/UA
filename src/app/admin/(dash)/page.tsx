import { adminStats, adminTopServices } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, top] = await Promise.all([adminStats(), adminTopServices(8)]);

  const cards = [
    { label: "Статті", value: stats.articles },
    { label: "Країни", value: stats.countries },
    { label: "Сервіси", value: stats.services },
    { label: "Бонуси", value: stats.deals },
    { label: "Кліків усього", value: stats.clicksTotal },
    { label: "Кліків за 7 днів", value: stats.clicks7 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Топ сервісів за кліками</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {top.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">Поки немає кліків.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="p-3">Сервіс</th>
                <th className="p-3 text-right">Кліків</th>
              </tr>
            </thead>
            <tbody>
              {top.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="p-3 text-slate-800">{s.name}</td>
                  <td className="p-3 text-right font-medium text-slate-900">{s.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
