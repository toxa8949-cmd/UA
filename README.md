# Українці за кордоном — портал

Production-ready портал для українців за кордоном: країни, документи, податки, житло, калькулятори, каталог сервісів та реферальні посилання.

**Стек:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase Postgres · Prisma · Vercel.

## Структура

```
src/
  app/          — сторінки (public + admin), api, sitemap, robots
  components/   — UI, layout, country, article, service, calculators, seo
  lib/          — prisma, supabase, auth, seo, утиліти, валідатори
  data/         — seed-дані (країни, категорії, сервіси, статті)
  types/        — спільні типи
  server/       — queries та server actions
prisma/         — schema.prisma + seed.ts
```

## Налаштування

### 1. Залежності
```bash
npm install
```

### 2. Supabase
1. Створіть проєкт на [supabase.com](https://supabase.com).
2. Скопіюйте `URL`, `anon key`, `service_role key`, рядки підключення.
3. Заповніть `.env` за зразком `.env.example`.

### 3. База даних (Prisma)
```bash
npx prisma migrate dev      # створити таблиці
npx prisma db seed          # наповнити 5 країн, 17 категорій, 10 сервісів, 25 статей
```
Альтернатива без міграцій: `npx prisma db push`.

### 4. RLS у Supabase
Виконайте `supabase/rls.sql` у Supabase SQL Editor (вмикає Row Level Security: публічне читання, запис лише для service role).

### 5. Запуск
```bash
npm run dev
```

## Деплой на Vercel
1. Імпортуйте репозиторій у Vercel.
2. Додайте всі змінні з `.env.example` у Project → Settings → Environment Variables.
3. Build command автоматично запускає `prisma generate && next build`.
4. Після деплою — налаштуйте домен, додайте сайт у Google Search Console та надішліть `sitemap.xml`.

## Команди
```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma migrate dev
npx prisma db seed
```

## SEO
Реалізовано: dynamic metadata, canonical, Open Graph, Twitter cards, JSON-LD (WebSite, Organization, Article, FAQPage, BreadcrumbList), dynamic `sitemap.xml`, `robots.txt`, чисті URL, breadcrumbs, внутрішня перелінковка.

## Реферальні посилання
Усі affiliate-кліки проходять через `/go/[slug]` — клік записується в `AffiliateClick`, далі redirect на `affiliateUrl`. Це дозволяє рахувати аналітику та змінювати посилання без правок у статтях.

---

> Інформація на сайті має ознайомчий характер і не є юридичною, податковою або фінансовою консультацією.
