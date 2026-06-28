import { Field, TextArea, StatusSelect } from "@/components/admin/Field";
import { saveArticle } from "@/server/actions/articles";
import type { Article, Country, Category } from "@/types/db";

export function ArticleForm({
  article, countries, categories,
}: {
  article?: Article | null;
  countries: Country[];
  categories: Category[];
}) {
  return (
    <form action={saveArticle} className="max-w-2xl space-y-4">
      {article && <input type="hidden" name="id" value={article.id} />}
      <Field label="Заголовок" name="title" defaultValue={article?.title} required />
      <Field label="Slug (URL)" name="slug" defaultValue={article?.slug} placeholder="auto" />
      <TextArea label="Короткий опис (excerpt)" name="excerpt" defaultValue={article?.excerpt} rows={2} />
      <TextArea label="Контент (Markdown)" name="content" defaultValue={article?.content} rows={14} />
      <Field label="Cover image URL" name="cover_image" defaultValue={article?.cover_image} />

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Країна</span>
          <select name="country_id" defaultValue={article?.country_id ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">— без країни —</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Категорія</span>
          <select name="category_id" defaultValue={article?.category_id ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">— без категорії —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>

      <Field label="SEO Title" name="seo_title" defaultValue={article?.seo_title} />
      <TextArea label="SEO Description" name="seo_description" defaultValue={article?.seo_description} rows={2} />
      <StatusSelect defaultValue={article?.status} />

      <button className="rounded-lg bg-emerald px-5 py-2.5 font-medium text-white hover:bg-emerald-700">
        Зберегти
      </button>
    </form>
  );
}
