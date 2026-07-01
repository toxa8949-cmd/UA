"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitPlace, type SubmitPlaceState } from "@/server/actions/submit-place";
import { PLACE_CATEGORIES, LANGUAGE_LABELS } from "@/lib/places";

type Country = { id: string; name: string; emoji: string | null };
type City = { id: string; name: string; country_id: string | null };

const initialState: SubmitPlaceState = { ok: false };

const inputCls =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-emerald";

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
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-emerald"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function SubmitPlaceForm({
  countries,
  cities,
}: {
  countries: Country[];
  cities: City[];
}) {
  const [state, formAction, pending] = useActionState(submitPlace, initialState);
  const [countryId, setCountryId] = useState("");

  const cityOptions = countryId
    ? cities.filter((c) => c.country_id === countryId)
    : [];

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald/25 bg-emerald-50 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-emerald" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink">
          Заявку надіслано
        </h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Дякуємо! Ми перевіримо інформацію і опублікуємо заклад у каталозі
          протягом 1–2 робочих днів.
        </p>
        <Link
          href="/places"
          className="mt-6 inline-flex rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot проти ботів — приховане поле */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <Field label="Назва закладу" required>
        <input name="name" required minLength={2} maxLength={120} className={inputCls} placeholder="Напр., Стоматологія «Усмішка»" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Категорія" required>
          <select name="category" required defaultValue="" className={inputCls}>
            <option value="" disabled>Оберіть категорію</option>
            {PLACE_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Країна" required>
          <select
            name="country_id"
            required
            defaultValue=""
            className={inputCls}
            onChange={(e) => setCountryId(e.target.value)}
          >
            <option value="" disabled>Оберіть країну</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ""}{c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Місто">
        <select name="city_id" defaultValue="" disabled={!countryId} className={inputCls}>
          <option value="">
            {countryId ? "Оберіть місто (необовʼязково)" : "Спершу оберіть країну"}
          </option>
          {cityOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Опис" required>
        <textarea
          name="description"
          required
          minLength={20}
          maxLength={600}
          rows={4}
          className={inputCls}
          placeholder="Чим займається заклад, для кого, що пропонує українцям (20–600 символів)"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Адреса">
          <input name="address" maxLength={200} className={inputCls} placeholder="Вулиця, номер, місто" />
        </Field>
        <Field label="Графік роботи">
          <input name="working_hours" maxLength={120} className={inputCls} placeholder="Пн–Пт 9:00–18:00" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Телефон">
          <input name="phone" maxLength={30} className={inputCls} placeholder="+48 ..." />
        </Field>
        <Field label="Email">
          <input name="email" type="email" maxLength={120} className={inputCls} placeholder="info@example.com" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Вебсайт">
          <input name="website" maxLength={200} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Instagram">
          <input name="instagram" maxLength={60} className={inputCls} placeholder="username" />
        </Field>
        <Field label="Telegram">
          <input name="telegram" maxLength={60} className={inputCls} placeholder="username" />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">
          Мови обслуговування <span className="text-emerald">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
            <label
              key={code}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-sand-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition-colors has-[:checked]:border-emerald has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald"
            >
              <input
                type="checkbox"
                name="languages"
                value={code}
                defaultChecked={code === "uk"}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2.5 text-sm text-slate-600">
        <input type="checkbox" name="is_ukrainian_owned" className="h-4 w-4 accent-emerald" />
        Власник закладу — українець / українка
      </label>

      {state.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        Надіслати на модерацію
      </button>
      <p className="text-xs text-slate-400">
        Розміщення безкоштовне. Заявка зʼявиться в каталозі після перевірки.
      </p>
    </form>
  );
}
