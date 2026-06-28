import { notFound } from "next/navigation";
import { ArticleForm } from "../../ArticleForm";
import { adminGetArticle, adminListCountries, adminListCategories } from "@/server/queries/admin";

export const dynamic = "force-dynamic";

export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, countries, categories] = await Promise.all([
    adminGetArticle(id),
    adminListCountries(),
    adminListCategories("article"),
  ]);
  if (!article) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Редагувати статтю</h1>
      <div className="mt-6">
        <ArticleForm article={article} countries={countries} categories={categories} />
      </div>
    </div>
  );
}
