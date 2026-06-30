import { notFound } from "next/navigation";
import { CityForm } from "@/components/admin/CityForm";
import { adminGetCity } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function EditCity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const city = await adminGetCity(id);
  if (!city) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{city.name}</h1>
      <div className="mt-6">
        <CityForm city={city} />
      </div>
    </div>
  );
}
