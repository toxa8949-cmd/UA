import { notFound } from "next/navigation";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { adminGetPlace, adminPlacesRefs } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function EditPlace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [place, { countries, cities }] = await Promise.all([
    adminGetPlace(id),
    adminPlacesRefs(),
  ]);
  if (!place) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{place.name}</h1>
      <div className="mt-6">
        <PlaceForm place={place} countries={countries} cities={cities} />
      </div>
    </div>
  );
}
