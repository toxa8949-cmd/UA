import Link from "next/link";
import { adminListCities } from "@/server/queries/admin";
import { Pencil, ImageOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCities() {
  const cities = await adminListCities();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Міста</h1>
      <p className="mt-1 text-sm text-slate-500">
        Завантажуйте банери міст — вони показуються на сторінці міста та в каталозі.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <Link
            key={c.id}
            href={`/admin/cities/${c.id}/edit`}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-emerald"
          >
            <div className="relative aspect-[2/1] bg-slate-100">
              {c.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.cover_image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <ImageOff size={28} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium text-slate-900">
                  {c.country?.emoji} {c.name}
                </p>
                <p className="text-xs text-slate-400">
                  {c.cover_image ? "Банер є" : "Без банера"}
                </p>
              </div>
              <Pencil size={15} className="text-slate-400 group-hover:text-emerald" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
