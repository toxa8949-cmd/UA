-- ============================================================
-- RLS для порталу "Українці за кордоном"
-- Виконати в Supabase SQL Editor ПІСЛЯ prisma migrate / db push
-- Стратегія: публічне читання опублікованого контенту,
-- запис лише через service_role (admin actions / seed).
-- ============================================================

-- Вмикаємо RLS на публічних таблицях
alter table "Country"  enable row level security;
alter table "Article"  enable row level security;
alter table "Service"  enable row level security;
alter table "Deal"     enable row level security;
alter table "Category" enable row level security;
alter table "NewsletterSubscriber" enable row level security;
alter table "AffiliateClick"       enable row level security;

-- ── Публічне читання опублікованого контенту ──
create policy "public read published countries"
  on "Country" for select using (status = 'published');

create policy "public read published articles"
  on "Article" for select using (status = 'published');

create policy "public read published services"
  on "Service" for select using (status = 'published');

create policy "public read published deals"
  on "Deal" for select using (status = 'published');

create policy "public read categories"
  on "Category" for select using (true);

-- ── Newsletter: дозволяємо анонімний INSERT ──
grant insert on "NewsletterSubscriber" to anon;
create policy "anon can subscribe"
  on "NewsletterSubscriber" for insert with check (true);

-- ── AffiliateClick: дозволяємо анонімний INSERT (трекінг) ──
grant insert on "AffiliateClick" to anon;
create policy "anon can log click"
  on "AffiliateClick" for insert with check (true);

-- Примітка: service_role обходить RLS, тому всі admin-операції
-- (create/update/delete) виконуються через createAdminSupabase()
-- або Prisma з DATABASE_URL під service role.
