import { PlaceForm } from "@/components/admin/PlaceForm";
import { adminPlacesRefs } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function NewPlace() {
  const { countries, cities } = await adminPlacesRefs();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Новий заклад</h1>
      <div className="mt-6">
        <PlaceForm place={null} countries={countries} cities={cities} />
      </div>
    </div>
  );
}
