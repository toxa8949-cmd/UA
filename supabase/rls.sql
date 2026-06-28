-- ============================================================
-- RLS для порталу «Українці за кордоном»
-- Виконати ПІСЛЯ schema.sql у Supabase SQL Editor.
-- Публічне читання published-контенту; запис лише service_role.
-- ============================================================

alter table countries              enable row level security;
alter table categories             enable row level security;
alter table articles               enable row level security;
alter table services               enable row level security;
alter table service_countries      enable row level security;
alter table deals                  enable row level security;
alter table newsletter_subscribers enable row level security;
alter table affiliate_clicks       enable row level security;

-- ── Публічне читання ──
drop policy if exists "read published countries" on countries;
create policy "read published countries" on countries for select using (status = 'published');

drop policy if exists "read published articles" on articles;
create policy "read published articles" on articles for select using (status = 'published');

drop policy if exists "read published services" on services;
create policy "read published services" on services for select using (status = 'published');

drop policy if exists "read published deals" on deals;
create policy "read published deals" on deals for select using (status = 'published');

drop policy if exists "read categories" on categories;
create policy "read categories" on categories for select using (true);

drop policy if exists "read service_countries" on service_countries;
create policy "read service_countries" on service_countries for select using (true);

-- ── Анонімні INSERT: newsletter + трекінг кліків ──
grant insert on newsletter_subscribers to anon;
drop policy if exists "anon subscribe" on newsletter_subscribers;
create policy "anon subscribe" on newsletter_subscribers for insert with check (true);

grant insert on affiliate_clicks to anon;
drop policy if exists "anon log click" on affiliate_clicks;
create policy "anon log click" on affiliate_clicks for insert with check (true);

-- service_role обходить RLS — усі admin create/update/delete йдуть через нього.
