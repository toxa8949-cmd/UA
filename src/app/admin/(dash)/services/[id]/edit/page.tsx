import { notFound } from "next/navigation";
import { ServiceForm } from "../../ServiceForm";
import { adminGetService, adminListCountries, adminListCategories } from "@/server/queries/admin";
import { createAdminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditService({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, countries, categories] = await Promise.all([
    adminGetService(id),
    adminListCountries(),
    adminListCategories("service"),
  ]);
  if (!service) notFound();

  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("service_countries")
    .select("country_id")
    .eq("service_id", id);
  const selected = ((data ?? []) as { country_id: string }[]).map((r) => r.country_id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Редагувати: {service.name}</h1>
      <div className="mt-6">
        <ServiceForm service={service} countries={countries} categories={categories} selectedCountryIds={selected} />
      </div>
    </div>
  );
}
