"use client";

import { useState } from "react";
import { savePlace } from "@/server/actions/places";
import {
  PLACE_GROUPS,
  PLACE_CATEGORIES,
  LANGUAGE_LABELS,
} from "@/lib/places";
import type { Place } from "@/types/db";
import type { PlaceRefCountry, PlaceRefCity } from "@/server/queries/admin";

const LANG_ORDER = ["uk", "pl", "cs", "de", "es", "pt", "en"];

export function PlaceForm({
  place,
  countries,
  cities,
}: {
  place: Place | null;
  countries: PlaceRefCountry[];
  cities: PlaceRefCity[];
}) {
  const [countryId, setCountryId] = useState(place?.country_id ?? "");
  const [coverPreview, setCoverPreview] = useState<string | null>(place?.cover_image ?? null);
  const [logoPreview, setLogoPreview] = useState<string | null>(place?.logo ?? null);

  const cityOptions = cities.filter((c) => c.country_id === countryId);

  return (
    <form action={savePlace} className="max-w-3xl space-y-6">
      {place?.id && <input type="hidden" name="id" value={place.id} />}

      {/* Назва + slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Назва" required>
          <input name="name" defaultValue={place?.name ?? ""} required className={inputCls} />
        </Field>
        <Field label="Slug (необовʼязково)">
          <input name="slug" defaultValue={place?.slug ?? ""} placeholder="згенерується з назви" className={inputCls} />
        </Field>
      </div>

      {/* Категорія + план */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Категорія" required>
          <select name="category" defaultValue={place?.category ?? ""} required className={inputCls}>
            <option value="">— оберіть —</option>
            {PLACE_GROUPS.map((g) => (
              <optgroup key={g.slug} label={g.label}>
                {PLACE_CATEGORIES.filter((c) => c.group === g.slug).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="План">
          <select name="plan" defaultValue={place?.plan ?? "free"} className={inputCls}>
            <option value="free">Free</option>
            <option value="featured">Featured</option>
            <option value="premium">Premium</option>
          </select>
        </Field>
      </div>

      {/* Країна + місто */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Країна">
          <select
            name="country_id"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className={inputCls}
          >
            <option value="">— не вказано —</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Місто">
          <select name="city_id" defaultValue={place?.city_id ?? ""} className={inputCls}>
            <option value="">— не вказано —</option>
            {cityOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Фото: обкладинка + лого */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Обкладинка (16:9)">
          <ImagePicker
            name="cover_file"
            preview={coverPreview}
            onPick={setCoverPreview}
            aspect="aspect-[16/9]"
          />
          <input type="hidden" name="cover_image" value={place?.cover_image ?? ""} />
        </Field>
        <Field label="Логотип (квадрат)">
          <ImagePicker
            name="logo_file"
            preview={logoPreview}
            onPick={setLogoPreview}
            aspect="aspect-square w-32"
          />
          <input type="hidden" name="logo" value={place?.logo ?? ""} />
        </Field>
      </div>

      {/* Описи */}
      <Field label="Короткий опис (на картці)">
        <textarea name="description" defaultValue={place?.description ?? ""} rows={2} className={inputCls} />
      </Field>
      <Field label="Повний опис (на сторінці, абзаци через порожній рядок)">
        <textarea name="full_description" defaultValue={place?.full_description ?? ""} rows={5} className={inputCls} />
      </Field>

      {/* Контакти */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Адреса">
          <input name="address" defaultValue={place?.address ?? ""} className={inputCls} />
        </Field>
        <Field label="Телефон">
          <input name="phone" defaultValue={place?.phone ?? ""} className={inputCls} />
        </Field>
        <Field label="Вебсайт">
          <input name="website" defaultValue={place?.website ?? ""} placeholder="https://" className={inputCls} />
        </Field>
        <Field label="Email">
          <input name="email" defaultValue={place?.email ?? ""} className={inputCls} />
        </Field>
        <Field label="Instagram (без @)">
          <input name="instagram" defaultValue={place?.instagram ?? ""} className={inputCls} />
        </Field>
        <Field label="Telegram">
          <input name="telegram" defaultValue={place?.telegram ?? ""} className={inputCls} />
        </Field>
      </div>

      <Field label="Графік роботи">
        <input name="working_hours" defaultValue={place?.working_hours ?? ""} placeholder="Пн-Пт 9:00-18:00" className={inputCls} />
      </Field>

      {/* Мови */}
      <Field label="Мови обслуговування">
        <div className="flex flex-wrap gap-3">
          {LANG_ORDER.map((l) => (
            <label key={l} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <input
                type="checkbox"
                name="languages"
                value={l}
                defaultChecked={place?.languages?.includes(l)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {LANGUAGE_LABELS[l] ?? l}
            </label>
          ))}
        </div>
      </Field>

      {/* Прапорці */}
      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="is_ukrainian_owned" defaultChecked={place?.is_ukrainian_owned} className="h-4 w-4 rounded border-slate-300" />
          Український власник
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="is_featured" defaultChecked={place?.is_featured} className="h-4 w-4 rounded border-slate-300" />
          Рекомендований (featured)
        </label>
      </div>

      {/* SEO */}
      <details className="rounded-lg border border-slate-200 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">SEO (необовʼязково)</summary>
        <div className="mt-4 space-y-4">
          <Field label="SEO title">
            <input name="seo_title" defaultValue={place?.seo_title ?? ""} className={inputCls} />
          </Field>
          <Field label="SEO description">
            <textarea name="seo_description" defaultValue={place?.seo_description ?? ""} rows={2} className={inputCls} />
          </Field>
        </div>
      </details>

      {/* Статус + збереження */}
      <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
        <Field label="Статус">
          <select name="status" defaultValue={place?.status ?? "published"} className={inputCls}>
            <option value="published">Опубліковано</option>
            <option value="pending">Заявка</option>
            <option value="rejected">Відхилено</option>
            <option value="archived">Архів</option>
          </select>
        </Field>
        <button className="ml-auto rounded-lg bg-emerald px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
          Зберегти
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ImagePicker({
  name,
  preview,
  onPick,
  aspect,
}: {
  name: string;
  preview: string | null;
  onPick: (url: string | null) => void;
  aspect: string;
}) {
  // Показуємо <Image> лише для валідних http(s)/blob URL — інакше плейсхолдер
  const showImg = !!preview && /^(https?:|blob:)/.test(preview);
  return (
    <div>
      <div className={`relative ${aspect} overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50`}>
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview!} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            Немає фото
          </div>
        )}
      </div>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onPick(file ? URL.createObjectURL(file) : preview);
        }}
        className="mt-2 block w-full text-xs text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700 hover:file:bg-slate-200"
      />
    </div>
  );
}
