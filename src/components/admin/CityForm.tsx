"use client";

import { useState } from "react";
import { saveCity } from "@/server/actions/cities";
import type { City } from "@/types/db";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald";

export function CityForm({ city }: { city: City }) {
  const [preview, setPreview] = useState<string | null>(city.cover_image ?? null);
  const showImg = !!preview && /^(https?:|blob:)/.test(preview);

  return (
    <form action={saveCity} className="max-w-2xl space-y-6">
      <input type="hidden" name="id" value={city.id} />

      {/* Банер */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Банер міста (співвідношення ~2:1)
        </span>
        <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {showImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview!} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
              Немає банера
            </div>
          )}
        </div>
        <input type="hidden" name="cover_image" value={city.cover_image ?? ""} />
        <input
          type="file"
          name="cover_file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : preview);
          }}
          className="mt-2 block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700 hover:file:bg-slate-200"
        />
      </div>

      {/* Базові поля */}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Короткий опис</span>
        <textarea name="short_description" defaultValue={city.short_description ?? ""} rows={2} className={inputCls} />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Населення</span>
        <input name="population" defaultValue={city.population ?? ""} className={inputCls} />
      </label>

      <details className="rounded-lg border border-slate-200 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">SEO</summary>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">SEO title</span>
            <input name="seo_title" defaultValue={city.seo_title ?? ""} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">SEO description</span>
            <textarea name="seo_description" defaultValue={city.seo_description ?? ""} rows={2} className={inputCls} />
          </label>
        </div>
      </details>

      <button className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
        Зберегти
      </button>
    </form>
  );
}
