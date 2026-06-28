import Link from "next/link";
import { adminListCountries } from "@/server/queries/admin";
import { Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCountries() {
  const countries = await adminListCountries();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Країни</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="p-3">Країна</th><th className="p-3">Валюта</th><th className="p-3 text-right">Дії</th></tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-3 text-slate-800">{c.emoji} {c.name}</td>
                <td className="p-3 text-slate-500">{c.currency}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/countries/${c.id}/edit`} className="inline-flex rounded p-1.5 text-slate-500 hover:bg-slate-100">
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
