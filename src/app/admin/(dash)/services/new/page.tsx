import { ServiceForm } from "../ServiceForm";
import { adminListCountries, adminListCategories } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function NewService() {
  const [countries, categories] = await Promise.all([
    adminListCountries(),
    adminListCategories("service"),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Новий сервіс</h1>
      <div className="mt-6"><ServiceForm countries={countries} categories={categories} /></div>
    </div>
  );
}
