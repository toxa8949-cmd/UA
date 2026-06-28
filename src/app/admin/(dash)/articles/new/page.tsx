import { ArticleForm } from "../ArticleForm";
import { adminListCountries, adminListCategories } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function NewArticle() {
  const [countries, categories] = await Promise.all([
    adminListCountries(),
    adminListCategories("article"),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Нова стаття</h1>
      <div className="mt-6">
        <ArticleForm countries={countries} categories={categories} />
      </div>
    </div>
  );
}
