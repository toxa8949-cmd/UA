# Українці за кордоном — портал

Production-ready портал для українців за кордоном: країни, документи, податки, житло, калькулятори, каталог сервісів та реферальні посилання.

**Стек:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Vercel.

> Без Prisma. Робота з БД — напряму через `@supabase/supabase-js`. Схема та дані розгортаються SQL-файлами в Supabase SQL Editor.

## Структура

```
src/
  app/          — сторінки (public + admin), api, sitemap, robots
  components/   — UI, layout, country, article, service, calculators, seo
  lib/          — supabase (клієнти), auth, seo, утиліти, валідатори
  data/         — seed-дані (джерело для SQL: країни, категорії, сервіси, статті)
  types/        — типи БД (db.ts)
supabase/
  schema.sql    — таблиці + індекси + усі seed-дані (виконати першим)
  rls.sql       — Row Level Security (виконати другим)
```

## Розгортання

### 1. Supabase
1. Створіть проєкт на [supabase.com](https://supabase.com).
2. **SQL Editor → виконайте `supabase/schema.sql`** (створює всі таблиці та наповнює: 5 країн, 17 категорій, 10 сервісів, 25 статей).
3. **SQL Editor → виконайте `supabase/rls.sql`** (вмикає RLS).
4. Settings → API: скопіюйте `Project URL`, `anon key`, `service_role key`.

### 2. Vercel — Environment Variables
Додайте у Project → Settings → Environment Variables (Production + Preview + Development):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_NAME
ADMIN_EMAILS
```

> `DATABASE_URL` / `DIRECT_URL` **більше не потрібні** — Prisma прибрано.

### 3. Деплой
Vercel автоматично робить `npm install && next build`. Жодних міграцій під час білду немає.

## Команди
```bash
npm install
npm run dev
npm run build
npm run lint
```

## SEO
Dynamic metadata, canonical, Open Graph, Twitter cards, JSON-LD (WebSite, Organization, Article, FAQPage, BreadcrumbList), dynamic `sitemap.xml`, `robots.txt`, чисті URL, breadcrumbs, внутрішня перелінковка.

## Реферальні посилання
Affiliate-кліки проходять через `/go/[slug]` → запис у `affiliate_clicks` → redirect на `affiliate_url`.

---

> Інформація на сайті має ознайомчий характер і не є юридичною, податковою або фінансовою консультацією.
