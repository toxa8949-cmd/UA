import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleCatalog } from "@/components/article/ArticleCatalog";
import { getArticles, getArticleCategories } from "@/server/queries/articles";
import { getCountries } from "@/server/queries/countries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Статті та гайди для українців за кордоном",
  description: "Документи, банки, житло, робота, податки та бізнес у Польщі, Німеччині, Чехії, Іспанії та Португалії. Фільтр за країною та темою.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const [articles, countries, categories] = await Promise.all([
    getArticles(),
    getCountries(),
    getArticleCategories(),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: "Головна", url: "/" }, { name: "Статті", url: "/articles" }]} />
      <div className="container pb-16">
        <h1 className="font-display text-3xl font-bold text-ink">Статті та гайди</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Практичні матеріали про життя, документи та фінанси за кордоном.
        </p>
        {articles.length === 0 ? (
          <p className="mt-8 text-slate-500">Статті зʼявляться найближчим часом.</p>
        ) : (
          <div className="mt-8">
            <ArticleCatalog articles={articles} countries={countries} categories={categories} />
          </div>
        )}
      </div>
    </>
  );
}
