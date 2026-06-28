-- ============================================================
-- Повне розгортання БД порталу «Українці за кордоном»
-- Виконати ОДНИМ запуском у Supabase SQL Editor.
-- Створює таблиці, RLS, та наповнює даними (idempotent).
-- ============================================================

create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_type where typname='content_status') then
    create type content_status as enum ('draft','published','archived');
  end if;
  if not exists (select 1 from pg_type where typname='category_type') then
    create type category_type as enum ('article','service','deal');
  end if;
end $$;

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  emoji text,
  short_description text,
  full_description text,
  capital text,
  currency text,
  language text,
  average_salary int,
  minimum_salary int,
  average_rent int,
  cost_of_living_index real,
  tax_summary text,
  business_summary text,
  healthcare_summary text,
  education_summary text,
  transport_summary text,
  status content_status not null default 'published',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  type category_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  country_id uuid references countries(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  author_id uuid,
  status content_status not null default 'draft',
  reading_time int,
  seo_title text,
  seo_description text,
  canonical_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  logo text,
  website_url text,
  affiliate_url text,
  category_id uuid references categories(id) on delete set null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  rating real,
  pricing_summary text,
  is_featured boolean not null default false,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_countries (
  service_id uuid references services(id) on delete cascade,
  country_id uuid references countries(id) on delete cascade,
  primary key (service_id, country_id)
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  service_id uuid references services(id) on delete set null,
  country_id uuid references countries(id) on delete set null,
  affiliate_url text,
  bonus_amount text,
  terms text,
  valid_until timestamptz,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  deal_id uuid references deals(id) on delete set null,
  article_id uuid references articles(id) on delete set null,
  country_code text,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  country_interest text,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists idx_articles_status on articles(status);
create index if not exists idx_articles_country on articles(country_id);
create index if not exists idx_articles_published on articles(published_at);
create index if not exists idx_services_featured on services(is_featured);
create index if not exists idx_clicks_created on affiliate_clicks(created_at);

-- ─── SEED: COUNTRIES ───
insert into countries (name, slug, emoji, short_description, capital, currency, language, average_salary, minimum_salary, average_rent, cost_of_living_index, tax_summary, business_summary, healthcare_summary, education_summary, transport_summary, status, seo_title, seo_description)
values ($txt$Польща$txt$, $txt$poland$txt$, $txt$🇵🇱$txt$, $txt$Найближча до України країна ЄС з великою українською громадою, простим відкриттям ФОП (JDG) та доступним ринком праці.$txt$, $txt$Варшава$txt$, $txt$PLN$txt$, $txt$польська$txt$, 8200, 4666, 3200, 48, $txt$PIT за шкалою 12%/32%, є лінійка та податок на прибуток. Для JDG доступний ryczałt та podatek liniowy 19%.$txt$, $txt$JDG (ФОП) відкривається онлайн через CEIDG за допомогою Profil Zaufany. ZUS — соцвнески, перші місяці зі знижками.$txt$, $txt$Державне страхування NFZ через ZUS. Біженці за тимчасовим захистом мають доступ до медицини.$txt$, $txt$Безкоштовні державні школи та садки, місця обмежені у великих містах.$txt$, $txt$Розвинений громадський транспорт, зручне сполучення з Україною.$txt$, 'published', $txt$Життя в Польщі для українців: документи, податки, житло$txt$, $txt$Повний гайд для українців у Польщі: PESEL, JDG, ZUS, банки, оренда, вартість життя та корисні сервіси.$txt$)
on conflict (slug) do update set name=excluded.name, short_description=excluded.short_description, updated_at=now();
insert into countries (name, slug, emoji, short_description, capital, currency, language, average_salary, minimum_salary, average_rent, cost_of_living_index, tax_summary, business_summary, healthcare_summary, education_summary, transport_summary, status, seo_title, seo_description)
values ($txt$Німеччина$txt$, $txt$germany$txt$, $txt$🇩🇪$txt$, $txt$Найбільша економіка ЄС з високими зарплатами, сильною соцсистемою та підтримкою для українців за §24.$txt$, $txt$Берлін$txt$, $txt$EUR$txt$, $txt$німецька$txt$, 4300, 2151, 1100, 67, $txt$Прогресивний прибутковий податок 14–45%, плюс церковний податок та Soli. Класи податку впливають на netto.$txt$, $txt$Реєстрація Gewerbe або Freiberufler через Finanzamt. Потрібен податковий номер (Steuernummer).$txt$, $txt$Обовʼязкове медичне страхування (gesetzliche/private Krankenversicherung).$txt$, $txt$Безкоштовна освіта, інтеграційні курси німецької для дорослих.$txt$, $txt$Deutschlandticket за 58€/міс на весь громадський транспорт країни.$txt$, 'published', $txt$Життя в Німеччині для українців: Anmeldung, страхування, робота$txt$, $txt$Гайд для українців у Німеччині: Anmeldung, Jobcenter, медичне страхування, банки, оренда та вартість життя.$txt$)
on conflict (slug) do update set name=excluded.name, short_description=excluded.short_description, updated_at=now();
insert into countries (name, slug, emoji, short_description, capital, currency, language, average_salary, minimum_salary, average_rent, cost_of_living_index, tax_summary, business_summary, healthcare_summary, education_summary, transport_summary, status, seo_title, seo_description)
values ($txt$Чехія$txt$, $txt$czech-republic$txt$, $txt$🇨🇿$txt$, $txt$Близька за мовою країна з низьким безробіттям, активним ринком праці та простим тимчасовим захистом для українців.$txt$, $txt$Прага$txt$, $txt$CZK$txt$, $txt$чеська$txt$, 46000, 18900, 18000, 50, $txt$Прибутковий податок 15%/23%, соцвнески та медстрахування утримуються з зарплати.$txt$, $txt$Živnostenský list (живність) — аналог ФОП, реєструється у živnostenský úřad.$txt$, $txt$Державне медичне страхування, біженці отримують доступ за тимчасовим захистом.$txt$, $txt$Безкоштовні школи, адаптаційні групи для українських дітей.$txt$, $txt$Дешевий та зручний громадський транспорт у Празі та регіонах.$txt$, 'published', $txt$Життя в Чехії для українців: тимчасовий захист, робота, житло$txt$, $txt$Гайд для українців у Чехії: тимчасовий захист, робота, банки, оренда, медстрахування та вартість життя у Празі.$txt$)
on conflict (slug) do update set name=excluded.name, short_description=excluded.short_description, updated_at=now();
insert into countries (name, slug, emoji, short_description, capital, currency, language, average_salary, minimum_salary, average_rent, cost_of_living_index, tax_summary, business_summary, healthcare_summary, education_summary, transport_summary, status, seo_title, seo_description)
values ($txt$Іспанія$txt$, $txt$spain$txt$, $txt$🇪🇸$txt$, $txt$Тепла країна з якісним кліматом, доступною медициною та зростаючою українською громадою на узбережжі.$txt$, $txt$Мадрид$txt$, $txt$EUR$txt$, $txt$іспанська$txt$, 2200, 1134, 900, 53, $txt$IRPF за прогресивною шкалою 19–47%, autónomo сплачують cuota та податки щоквартально.$txt$, $txt$Самозайнятість (autónomo) реєструється через Hacienda та Seguridad Social, потрібен NIE.$txt$, $txt$Державна медицина для резидентів, приватне страхування доступне.$txt$, $txt$Безкоштовна державна освіта, мовні класи для дітей-мігрантів.$txt$, $txt$Розвинене сполучення між містами, метро у великих містах.$txt$, 'published', $txt$Життя в Іспанії для українців: NIE, оренда, медицина, податки$txt$, $txt$Гайд для українців в Іспанії: NIE, оренда житла, медицина, податки для самозайнятих та вартість життя.$txt$)
on conflict (slug) do update set name=excluded.name, short_description=excluded.short_description, updated_at=now();
insert into countries (name, slug, emoji, short_description, capital, currency, language, average_salary, minimum_salary, average_rent, cost_of_living_index, tax_summary, business_summary, healthcare_summary, education_summary, transport_summary, status, seo_title, seo_description)
values ($txt$Португалія$txt$, $txt$portugal$txt$, $txt$🇵🇹$txt$, $txt$Спокійна країна з мʼяким кліматом, привітним ставленням до мігрантів та популярними програмами для digital nomad.$txt$, $txt$Лісабон$txt$, $txt$EUR$txt$, $txt$португальська$txt$, 1600, 870, 1000, 51, $txt$IRS за прогресивною шкалою, є режим для нових резидентів. Для бізнесу — categoria B.$txt$, $txt$Реєстрація atividade через Finanças, потрібен NIF. Популярна для фрилансерів.$txt$, $txt$Державна система SNS, доступна резидентам за номером SNS.$txt$, $txt$Безкоштовна державна освіта, програми інтеграції.$txt$, $txt$Зручний транспорт у Лісабоні та Порту, міжміські потяги.$txt$, 'published', $txt$Життя в Португалії для українців: NIF, оренда, бізнес, банки$txt$, $txt$Гайд для українців у Португалії: NIF, відкриття рахунку, оренда, digital nomad віза, бізнес та вартість життя.$txt$)
on conflict (slug) do update set name=excluded.name, short_description=excluded.short_description, updated_at=now();

-- ─── SEED: CATEGORIES ───
insert into categories (name, slug, description, type) values ($txt$Документи$txt$, $txt$documents$txt$, $txt$Оформлення документів за кордоном.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Гроші та банки$txt$, $txt$money$txt$, $txt$Банки, рахунки, перекази.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Житло$txt$, $txt$housing-articles$txt$, $txt$Пошук та оренда житла.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Робота$txt$, $txt$work$txt$, $txt$Працевлаштування за кордоном.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Бізнес$txt$, $txt$business$txt$, $txt$Відкриття та ведення бізнесу.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Вартість життя$txt$, $txt$cost-of-living-articles$txt$, $txt$Скільки коштує життя.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Порівняння$txt$, $txt$comparison$txt$, $txt$Порівняння країн.$txt$, $txt$article$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Банки$txt$, $txt$banks$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Перекази грошей$txt$, $txt$money-transfer$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$eSIM$txt$, $txt$esim$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Страхування$txt$, $txt$insurance$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Бухгалтерія$txt$, $txt$accounting$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$CRM$txt$, $txt$crm$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Хостинг$txt$, $txt$hosting$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$AI-інструменти$txt$, $txt$ai-tools$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Пошук житла$txt$, $txt$housing$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();
insert into categories (name, slug, description, type) values ($txt$Пошук роботи$txt$, $txt$jobs$txt$, NULL, $txt$service$txt$) on conflict (slug) do update set name=excluded.name, updated_at=now();

-- ─── SEED: SERVICES ───
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Wise$txt$, $txt$wise$txt$, $txt$Міжнародні перекази та мультивалютний рахунок з реальним курсом обміну.$txt$, $txt$https://wise.com$txt$, $txt$https://wise.com/invite/placeholder$txt$, (select id from categories where slug=$txt$money-transfer$txt$), ARRAY[$txt$Реальний курс обміну$txt$,$txt$Мультивалютна картка$txt$,$txt$Швидкі перекази$txt$], ARRAY[$txt$Комісія за переказ$txt$,$txt$Немає відділень$txt$], 4.7, $txt$Безкоштовний рахунок, комісія за переказ від 0.4%$txt$, true, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$wise$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$wise$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$wise$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$wise$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$wise$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Revolut$txt$, $txt$revolut$txt$, $txt$Цифровий банк з картками, обміном валют та інвестиціями.$txt$, $txt$https://revolut.com$txt$, $txt$https://revolut.com/referral/placeholder$txt$, (select id from categories where slug=$txt$banks$txt$), ARRAY[$txt$Швидке відкриття$txt$,$txt$Безкоштовний базовий план$txt$,$txt$Обмін валют$txt$], ARRAY[$txt$Ліміти на безкоштовному плані$txt$,$txt$Підтримка лише в чаті$txt$], 4.5, $txt$Standard безкоштовно, Premium від 7.99€/міс$txt$, true, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$revolut$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$revolut$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$revolut$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$revolut$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$revolut$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Airalo$txt$, $txt$airalo$txt$, $txt$eSIM для мобільного інтернету у понад 200 країнах без роумінгу.$txt$, $txt$https://airalo.com$txt$, $txt$https://airalo.com/ref/placeholder$txt$, (select id from categories where slug=$txt$esim$txt$), ARRAY[$txt$Миттєва активація$txt$,$txt$Без фізичної SIM$txt$,$txt$Дешевий інтернет за кордоном$txt$], ARRAY[$txt$Лише дані (без дзвінків)$txt$,$txt$Потрібен сумісний телефон$txt$], 4.4, $txt$Пакети даних від $4.50$txt$, true, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$airalo$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$airalo$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$airalo$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$airalo$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$airalo$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$SafetyWing$txt$, $txt$safetywing$txt$, $txt$Міжнародне медичне страхування для мандрівників та digital nomad.$txt$, $txt$https://safetywing.com$txt$, $txt$https://safetywing.com/ref/placeholder$txt$, (select id from categories where slug=$txt$insurance$txt$), ARRAY[$txt$Покриває багато країн$txt$,$txt$Помісячна оплата$txt$,$txt$Онлайн оформлення$txt$], ARRAY[$txt$Не замінює державну страховку$txt$,$txt$Франшиза$txt$], 4.2, $txt$Від $45/міс$txt$, true, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$safetywing$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$safetywing$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$safetywing$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Booking.com$txt$, $txt$booking$txt$, $txt$Бронювання житла та готелів для перших днів після переїзду.$txt$, $txt$https://booking.com$txt$, $txt$https://booking.com/ref/placeholder$txt$, (select id from categories where slug=$txt$housing$txt$), ARRAY[$txt$Великий вибір$txt$,$txt$Безкоштовне скасування$txt$,$txt$Відгуки$txt$], ARRAY[$txt$Ціни вищі за довгу оренду$txt$,$txt$Не для постійного житла$txt$], 4.3, $txt$Комісія включена у вартість$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$booking$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$booking$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$booking$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$booking$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$booking$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Hostinger$txt$, $txt$hostinger$txt$, $txt$Доступний хостинг та домени для сайтів і бізнесу.$txt$, $txt$https://hostinger.com$txt$, $txt$https://hostinger.com/ref/placeholder$txt$, (select id from categories where slug=$txt$hosting$txt$), ARRAY[$txt$Низька ціна$txt$,$txt$Простий інтерфейс$txt$,$txt$Українська підтримка$txt$], ARRAY[$txt$Ліміти на базовому плані$txt$], 4.4, $txt$Від $2.99/міс$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$hostinger$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$hostinger$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$hostinger$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$hostinger$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$hostinger$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Notion$txt$, $txt$notion$txt$, $txt$Інструмент для нотаток, документів та організації справ при переїзді.$txt$, $txt$https://notion.so$txt$, $txt$https://notion.so/ref/placeholder$txt$, (select id from categories where slug=$txt$ai-tools$txt$), ARRAY[$txt$Безкоштовний для особистого використання$txt$,$txt$Гнучкий$txt$,$txt$AI-функції$txt$], ARRAY[$txt$Крива навчання$txt$], 4.6, $txt$Безкоштовно, Plus від $10/міс$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$notion$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$notion$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$notion$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$notion$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$notion$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Canva$txt$, $txt$canva$txt$, $txt$Графічний редактор для документів, резюме та дизайну.$txt$, $txt$https://canva.com$txt$, $txt$https://canva.com/ref/placeholder$txt$, (select id from categories where slug=$txt$ai-tools$txt$), ARRAY[$txt$Багато шаблонів$txt$,$txt$Простий$txt$,$txt$Безкоштовний план$txt$], ARRAY[$txt$Преміум-елементи платні$txt$], 4.5, $txt$Безкоштовно, Pro від $12.99/міс$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$canva$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$canva$txt$), (select id from countries where slug=$txt$germany$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$canva$txt$), (select id from countries where slug=$txt$czech-republic$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$canva$txt$), (select id from countries where slug=$txt$spain$txt$) on conflict do nothing;
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$canva$txt$), (select id from countries where slug=$txt$portugal$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$Fakturownia$txt$, $txt$fakturownia$txt$, $txt$Сервіс виставлення рахунків (faktura) для бізнесу в Польщі.$txt$, $txt$https://fakturownia.pl$txt$, $txt$https://fakturownia.pl/ref/placeholder$txt$, (select id from categories where slug=$txt$accounting$txt$), ARRAY[$txt$Зручні фактури$txt$,$txt$Інтеграції$txt$,$txt$Польські стандарти$txt$], ARRAY[$txt$Інтерфейс польською$txt$], 4.3, $txt$Безкоштовно до 30 фактур, далі від 24 zł/міс$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$fakturownia$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;
insert into services (name, slug, description, website_url, affiliate_url, category_id, pros, cons, rating, pricing_summary, is_featured, status)
values ($txt$inFakt$txt$, $txt$infakt$txt$, $txt$Онлайн-бухгалтерія та підтримка бухгалтера для JDG у Польщі.$txt$, $txt$https://infakt.pl$txt$, $txt$https://infakt.pl/ref/placeholder$txt$, (select id from categories where slug=$txt$accounting$txt$), ARRAY[$txt$Бухгалтер у комплекті$txt$,$txt$Автоматизація ZUS/податків$txt$,$txt$Мобільний застосунок$txt$], ARRAY[$txt$Платний$txt$,$txt$Польською мовою$txt$], 4.4, $txt$Від 100 zł/міс$txt$, false, 'published')
on conflict (slug) do update set name=excluded.name, description=excluded.description, is_featured=excluded.is_featured, updated_at=now();
insert into service_countries (service_id, country_id) select (select id from services where slug=$txt$infakt$txt$), (select id from countries where slug=$txt$poland$txt$) on conflict do nothing;

-- ─── SEED: ARTICLES ───
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як відкрити банківський рахунок у Польщі українцю$txt$, $txt$yak-vidkryty-rahunok-u-polshchi$txt$, $txt$Покрокова інструкція відкриття рахунку в польському банку: документи, банки для українців та онлайн-варіанти.$txt$, $txt$Банківський рахунок — одна з перших речей, яку варто оформити після приїзду до Польщі. Він потрібен для зарплати, оренди та оплат.

## Які документи потрібні

Зазвичай достатньо закордонного паспорта та номера PESEL. Деякі банки приймають і паспорт громадянина України. Документ про адресу проживання може знадобитися.

## Які банки підходять

Популярні серед українців PKO BP, Pekao, Santander, mBank та ING. Багато з них мають україномовну підтримку та спрощене відкриття для біженців.

## Онлайн-альтернативи

Revolut та Wise дозволяють отримати рахунок та картку онлайн за кілька хвилин, що зручно для перших днів.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$poland$txt$), (select id from categories where slug=$txt$money$txt$), 'published', 1, $txt$Як відкрити банківський рахунок у Польщі українцю$txt$, $txt$Покрокова інструкція відкриття рахунку в польському банку: документи, банки для українців та онлайн-варіанти.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Що таке PESEL і як його отримати$txt$, $txt$shcho-take-pesel$txt$, $txt$PESEL — ідентифікаційний номер у Польщі. Розповідаємо, навіщо він потрібен і як його оформити.$txt$, $txt$PESEL — це універсальний ідентифікаційний номер у Польщі, без якого складно вести більшість офіційних справ.

## Навіщо потрібен PESEL

Номер потрібен для роботи, відкриття бізнесу, медицини, банку та отримання виплат. Для українців за тимчасовим захистом передбачено спеціальний статус UKR.

## Як оформити

PESEL оформлюється в Urząd Gminy (міській раді) за місцем перебування. Потрібен паспорт та заповнена заява.

## Profil Zaufany

Разом із PESEL варто налаштувати Profil Zaufany — електронний підпис для онлайн-сервісів держави.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$poland$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Що таке PESEL і як його отримати$txt$, $txt$PESEL — ідентифікаційний номер у Польщі. Розповідаємо, навіщо він потрібен і як його оформити.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як відкрити JDG у Польщі$txt$, $txt$yak-vidkryty-jdg-u-polshchi$txt$, $txt$JDG — польський аналог ФОП. Як зареєструватися, що таке ZUS та які податки сплачувати.$txt$, $txt$JDG (Jednoosobowa Działalność Gospodarcza) — це індивідуальна підприємницька діяльність, аналог українського ФОП.

## Реєстрація через CEIDG

Реєстрація безкоштовна та онлайн через систему CEIDG за допомогою Profil Zaufany. Потрібно обрати коди PKD (види діяльності).

## ZUS — соціальні внески

Після реєстрації потрібно сплачувати внески ZUS. Для нових підприємців діють пільги: Ulga na start та Mały ZUS.

## Форми оподаткування

Доступні ryczałt (фіксований відсоток з обороту), podatek liniowy 19% та загальна шкала. Вибір залежить від виду діяльності й витрат.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$poland$txt$), (select id from categories where slug=$txt$business$txt$), 'published', 1, $txt$Як відкрити JDG у Польщі$txt$, $txt$JDG — польський аналог ФОП. Як зареєструватися, що таке ZUS та які податки сплачувати.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Скільки коштує життя у Варшаві$txt$, $txt$skilky-koshtuie-zhyttia-u-varshavi$txt$, $txt$Розбираємо реальні витрати на оренду, їжу, транспорт та комуналку у столиці Польщі.$txt$, $txt$Варшава — найдорожче місто Польщі, але зарплати тут також вищі за середні по країні.

## Оренда житла

Однокімнатна квартира в центрі коштує орієнтовно 3000–4500 zł/міс, на околицях — від 2200 zł. Додатково оплачуються komunalne (чинш).

## Їжа та транспорт

Місячний проїзний коштує близько 110 zł. Продукти на одну людину — 1000–1500 zł залежно від звичок.

## Орієнтовний бюджет

Для комфортного життя однієї людини варто закладати 5000–7000 zł на місяць.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$poland$txt$), (select id from categories where slug=$txt$cost-of-living-articles$txt$), 'published', 1, $txt$Скільки коштує життя у Варшаві$txt$, $txt$Розбираємо реальні витрати на оренду, їжу, транспорт та комуналку у столиці Польщі.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Польща чи Німеччина: де краще українцю$txt$, $txt$polshcha-chy-nimechchyna$txt$, $txt$Порівнюємо дві найпопулярніші країни для українців за зарплатами, документами та вартістю життя.$txt$, $txt$Польща та Німеччина — два найпопулярніші напрямки. Вибір залежить від ваших пріоритетів.

## Мова та адаптація

Польська ближча до української, що спрощує адаптацію. Німецька складніша, але держава пропонує безкоштовні інтеграційні курси.

## Зарплати та витрати

У Німеччині вищі зарплати, але й вищі витрати. У Польщі нижчий поріг входу та простіше відкрити бізнес.

## Документи та підтримка

Польща дає швидший доступ до ринку праці, Німеччина — сильнішу соціальну підтримку за §24.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$poland$txt$), (select id from categories where slug=$txt$comparison$txt$), 'published', 1, $txt$Польща чи Німеччина: де краще українцю$txt$, $txt$Порівнюємо дві найпопулярніші країни для українців за зарплатами, документами та вартістю життя.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як зробити Anmeldung у Німеччині$txt$, $txt$yak-zrobyty-anmeldung$txt$, $txt$Anmeldung — реєстрація місця проживання. Без неї не оформити майже нічого. Покрокова інструкція.$txt$, $txt$Anmeldung — це обовʼязкова реєстрація за місцем проживання, перший крок після переїзду до Німеччини.

## Де і як зробити

Реєстрація відбувається в Bürgeramt. Потрібно записатися на термін (Termin), часто заздалегідь.

## Які документи

Паспорт, заповнена форма Anmeldung та Wohnungsgeberbestätigung — підтвердження від орендодавця.

## Що дає Anmeldung

Після реєстрації ви отримуєте Steuer-ID, можете відкрити рахунок, оформити страховку та отримувати виплати.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$germany$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Як зробити Anmeldung у Німеччині$txt$, $txt$Anmeldung — реєстрація місця проживання. Без неї не оформити майже нічого. Покрокова інструкція.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як працює медичне страхування в Німеччині$txt$, $txt$medychne-strakhuvannia-nimechchyna$txt$, $txt$Розбираємо державне та приватне медичне страхування, як обрати касу та що покривається.$txt$, $txt$Медичне страхування в Німеччині обовʼязкове для всіх. Є дві системи: державна та приватна.

## Державна (GKV)

Більшість людей застраховані в державних касах (TK, AOK, Barmer). Внески залежать від доходу.

## Приватна (PKV)

Доступна для високих доходів та фрилансерів. Внески залежать від віку та стану здоровʼя.

## Як обрати касу

Державні каси покривають схожий набір послуг, відрізняються сервісом та додатковими бонусами.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$germany$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Як працює медичне страхування в Німеччині$txt$, $txt$Розбираємо державне та приватне медичне страхування, як обрати касу та що покривається.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Скільки коштує життя в Берліні$txt$, $txt$skilky-koshtuie-zhyttia-v-berlini$txt$, $txt$Оренда, їжа, транспорт і страхування — реальний місячний бюджет життя в столиці Німеччини.$txt$, $txt$Берлін дешевший за Мюнхен чи Франкфурт, але оренда житла залишається головною статтею витрат.

## Оренда

Однокімнатна квартира коштує орієнтовно 900–1400€/міс. Знайти житло складно через високий попит.

## Транспорт та їжа

Deutschlandticket — 58€/міс на весь транспорт. Продукти — 300–450€ на людину.

## Орієнтовний бюджет

Комфортне життя однієї людини — від 1800€ на місяць із орендою.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$germany$txt$), (select id from categories where slug=$txt$cost-of-living-articles$txt$), 'published', 1, $txt$Скільки коштує життя в Берліні$txt$, $txt$Оренда, їжа, транспорт і страхування — реальний місячний бюджет життя в столиці Німеччини.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як українцю знайти роботу в Німеччині$txt$, $txt$yak-znaity-robotu-v-nimechchyni$txt$, $txt$Платформи пошуку, визнання дипломів, роль мови та допомога Jobcenter.$txt$, $txt$Ринок праці Німеччини потребує спеціалістів, але мова та визнання кваліфікації відіграють ключову роль.

## Де шукати

Основні платформи: StepStone, Indeed, LinkedIn та портал Bundesagentur für Arbeit.

## Визнання дипломів

Для багатьох професій потрібне визнання кваліфікації (Anerkennung), особливо в медицині та інженерії.

## Роль мови

Рівень B1–B2 значно розширює можливості. Jobcenter може оплатити мовні курси.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$germany$txt$), (select id from categories where slug=$txt$work$txt$), 'published', 1, $txt$Як українцю знайти роботу в Німеччині$txt$, $txt$Платформи пошуку, визнання дипломів, роль мови та допомога Jobcenter.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Які банки підходять українцям у Німеччині$txt$, $txt$banky-dlia-ukraintsiv-nimechchyna$txt$, $txt$Огляд банків та необанків з простим відкриттям рахунку для українців.$txt$, $txt$У Німеччині є традиційні банки та зручні необанки, які легко відкрити онлайн.

## Необанки

N26, Revolut та Vivid дозволяють відкрити рахунок онлайн за паспортом, без походу у відділення.

## Традиційні банки

Sparkasse та Commerzbank мають відділення в кожному місті та підходять для зарплатних рахунків.

## Що враховувати

Перевірте комісії за обслуговування та умови безкоштовного зняття готівки.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$germany$txt$), (select id from categories where slug=$txt$money$txt$), 'published', 1, $txt$Які банки підходять українцям у Німеччині$txt$, $txt$Огляд банків та необанків з простим відкриттям рахунку для українців.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Тимчасовий захист у Чехії$txt$, $txt$tymchasovyi-zakhyst-u-chekhii$txt$, $txt$Як оформити та продовжити тимчасовий захист, які права він дає українцям.$txt$, $txt$Тимчасовий захист (dočasná ochrana) дає українцям право легально перебувати, працювати та користуватися послугами в Чехії.

## Як оформити

Реєстрація відбувається в KACPU (центрах допомоги). Потрібен паспорт та підтвердження проживання.

## Які права дає

Доступ до ринку праці без дозволу, медичне страхування, освіта для дітей та соціальні виплати.

## Продовження

Захист потрібно періодично продовжувати — слідкуйте за оновленнями та термінами.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$czech-republic$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Тимчасовий захист у Чехії$txt$, $txt$Як оформити та продовжити тимчасовий захист, які права він дає українцям.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Скільки коштує життя у Празі$txt$, $txt$skilky-koshtuie-zhyttia-u-prazi$txt$, $txt$Оренда, продукти, транспорт — детальний розбір місячного бюджету в столиці Чехії.$txt$, $txt$Прага — найдорожче місто Чехії, але водночас із найвищими зарплатами та можливостями.

## Оренда

Однокімнатна квартира коштує 16000–25000 Kč/міс залежно від району.

## Транспорт та їжа

Місячний проїзний — близько 550 Kč. Продукти — 6000–9000 Kč на людину.

## Орієнтовний бюджет

Для комфортного життя варто закладати 25000–35000 Kč на місяць.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$czech-republic$txt$), (select id from categories where slug=$txt$cost-of-living-articles$txt$), 'published', 1, $txt$Скільки коштує життя у Празі$txt$, $txt$Оренда, продукти, транспорт — детальний розбір місячного бюджету в столиці Чехії.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Робота в Чехії для українців$txt$, $txt$robota-v-chekhii$txt$, $txt$Де шукати роботу, які сфери затребувані та як працює тимчасовий захист щодо працевлаштування.$txt$, $txt$Чехія має низьке безробіття та активно потребує працівників у багатьох сферах.

## Затребувані сфери

Виробництво, логістика, IT, будівництво та сфера послуг активно наймають.

## Де шукати

Jobs.cz, Prace.cz, LinkedIn та групи в соцмережах для українців.

## Тимчасовий захист

Зі статусом захисту можна працювати без окремого дозволу на роботу.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$czech-republic$txt$), (select id from categories where slug=$txt$work$txt$), 'published', 1, $txt$Робота в Чехії для українців$txt$, $txt$Де шукати роботу, які сфери затребувані та як працює тимчасовий захист щодо працевлаштування.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Банки в Чехії для українців$txt$, $txt$banky-v-chekhii$txt$, $txt$Які банки відкривають рахунки українцям та що для цього потрібно.$txt$, $txt$Рахунок у чеському банку спрощує отримання зарплати та оплати рахунків.

## Популярні банки

Česká spořitelna, ČSOB, Komerční banka та Air Bank працюють з українцями.

## Що потрібно

Паспорт, іноді підтвердження проживання чи статусу тимчасового захисту.

## Онлайн-варіанти

Revolut та Wise залишаються зручними для перших днів та валютних операцій.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$czech-republic$txt$), (select id from categories where slug=$txt$money$txt$), 'published', 1, $txt$Банки в Чехії для українців$txt$, $txt$Які банки відкривають рахунки українцям та що для цього потрібно.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Оренда житла в Чехії$txt$, $txt$orenda-zhytla-v-chekhii$txt$, $txt$Як шукати квартиру, що таке kauce та на що звертати увагу в договорі.$txt$, $txt$Оренда житла в Чехії потребує уваги до договору та депозиту.

## Де шукати

Sreality.cz, Bezrealitky.cz та групи в соцмережах. Будьте обережні з шахраями.

## Депозит (kauce)

Зазвичай депозит — 1–3 місячні орендні плати, який повертається після виїзду.

## Договір

Уважно читайте умови розірвання, оплати комуналки та відповідальності за ремонт.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$czech-republic$txt$), (select id from categories where slug=$txt$housing-articles$txt$), 'published', 1, $txt$Оренда житла в Чехії$txt$, $txt$Як шукати квартиру, що таке kauce та на що звертати увагу в договорі.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Що таке NIE в Іспанії$txt$, $txt$shcho-take-nie$txt$, $txt$NIE — ідентифікаційний номер іноземця. Навіщо потрібен і як оформити.$txt$, $txt$NIE (Número de Identidad de Extranjero) — ключовий документ для життя в Іспанії.

## Навіщо потрібен

NIE потрібен для роботи, відкриття рахунку, оренди, бізнесу та більшості офіційних дій.

## Як оформити

Запис (cita previa) робиться онлайн у поліцію або Extranjería. Потрібні форма EX-15 та паспорт.

## Терміни

Запис буває складно отримати у великих містах — плануйте заздалегідь.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$spain$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Що таке NIE в Іспанії$txt$, $txt$NIE — ідентифікаційний номер іноземця. Навіщо потрібен і як оформити.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Скільки коштує життя в Іспанії$txt$, $txt$skilky-koshtuie-zhyttia-v-ispanii$txt$, $txt$Порівнюємо витрати у Мадриді, Барселоні та менших містах узбережжя.$txt$, $txt$Вартість життя в Іспанії сильно залежить від міста: великі центри дорожчі за узбережжя.

## Оренда

У Мадриді та Барселоні однокімнатна — від 900€, у менших містах — від 550€.

## Їжа та транспорт

Продукти — 250–400€ на людину, проїзний — 20–55€ залежно від міста.

## Орієнтовний бюджет

Комфортне життя однієї людини — від 1300€ на місяць.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$spain$txt$), (select id from categories where slug=$txt$cost-of-living-articles$txt$), 'published', 1, $txt$Скільки коштує життя в Іспанії$txt$, $txt$Порівнюємо витрати у Мадриді, Барселоні та менших містах узбережжя.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як орендувати житло в Іспанії$txt$, $txt$yak-orenduvaty-zhytlo-v-ispanii$txt$, $txt$Платформи пошуку, документи для орендодавця та типові умови договору.$txt$, $txt$Оренда житла в Іспанії конкурентна, особливо у великих містах.

## Де шукати

Idealista, Fotocasa та групи в соцмережах. Idealista — найбільший портал.

## Документи

Орендодавці часто просять NIE, контракт про роботу та підтвердження доходу.

## Депозит

Зазвичай 1–2 місячні плати застави плюс перший місяць наперед.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$spain$txt$), (select id from categories where slug=$txt$housing-articles$txt$), 'published', 1, $txt$Як орендувати житло в Іспанії$txt$, $txt$Платформи пошуку, документи для орендодавця та типові умови договору.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Податки в Іспанії для самозайнятих$txt$, $txt$podatky-dlia-samozainiatykh-ispania$txt$, $txt$Як працює autónomo, що таке cuota та які податки сплачувати щоквартально.$txt$, $txt$Самозайнятість (autónomo) — поширений спосіб працювати на себе в Іспанії.

## Реєстрація

Реєстрація через Hacienda (податкова) та Seguridad Social. Потрібен NIE.

## Cuota de autónomo

Щомісячний соціальний внесок, що залежить від доходу. Для новачків діють знижки.

## Податки

IRPF та IVA декларуються щоквартально. Варто користуватися послугами gestoría.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$spain$txt$), (select id from categories where slug=$txt$business$txt$), 'published', 1, $txt$Податки в Іспанії для самозайнятих$txt$, $txt$Як працює autónomo, що таке cuota та які податки сплачувати щоквартально.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Іспанія чи Португалія для переїзду$txt$, $txt$ispania-chy-portugalia$txt$, $txt$Порівнюємо клімат, вартість життя, бізнес-умови та програми для мігрантів.$txt$, $txt$Іспанія та Португалія приваблюють кліматом і темпом життя, але мають відмінності.

## Вартість життя

Португалія загалом трохи дешевша, особливо поза Лісабоном. Іспанія має ширший вибір міст.

## Бізнес та податки

Португалія популярна серед фрилансерів та digital nomad, Іспанія має більший внутрішній ринок.

## Громада та мова

В Іспанії більша українська громада; португальська мова складніша для старту.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$spain$txt$), (select id from categories where slug=$txt$comparison$txt$), 'published', 1, $txt$Іспанія чи Португалія для переїзду$txt$, $txt$Порівнюємо клімат, вартість життя, бізнес-умови та програми для мігрантів.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Що таке NIF у Португалії$txt$, $txt$shcho-take-nif$txt$, $txt$NIF — податковий номер. Навіщо потрібен та як його отримати українцю.$txt$, $txt$NIF (Número de Identificação Fiscal) — базовий документ для будь-яких фінансових дій у Португалії.

## Навіщо потрібен

NIF потрібен для оренди, відкриття рахунку, покупок, роботи та бізнесу.

## Як отримати

Оформлюється у Finanças або онлайн через представника. Потрібен паспорт та адреса.

## Резидент чи ні

Нерезиденти можуть отримати NIF через фіскального представника.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$portugal$txt$), (select id from categories where slug=$txt$documents$txt$), 'published', 1, $txt$Що таке NIF у Португалії$txt$, $txt$NIF — податковий номер. Навіщо потрібен та як його отримати українцю.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як відкрити рахунок у Португалії$txt$, $txt$yak-vidkryty-rahunok-u-portugalii$txt$, $txt$Які банки обрати, що потрібно з документів та як працюють онлайн-банки.$txt$, $txt$Банківський рахунок у Португалії потрібен для оренди, зарплати та повсякденних оплат.

## Документи

Потрібні паспорт, NIF та підтвердження адреси. Деякі банки просять підтвердження доходу.

## Популярні банки

Millennium BCP, Novobanco та ActivoBank (онлайн) працюють з іноземцями.

## Онлайн-альтернативи

Revolut та Wise зручні для старту та валютних операцій.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$portugal$txt$), (select id from categories where slug=$txt$money$txt$), 'published', 1, $txt$Як відкрити рахунок у Португалії$txt$, $txt$Які банки обрати, що потрібно з документів та як працюють онлайн-банки.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Скільки коштує життя в Лісабоні$txt$, $txt$skilky-koshtuie-zhyttia-v-lisaboni$txt$, $txt$Оренда, продукти та транспорт у столиці Португалії — реальний бюджет.$txt$, $txt$Лісабон подорожчав за останні роки, оренда стала головною статтею витрат.

## Оренда

Однокімнатна квартира — від 1000€/міс у центрі, дешевше на околицях та в передмісті.

## Транспорт та їжа

Проїзний — близько 40€/міс. Продукти — 250–400€ на людину.

## Орієнтовний бюджет

Комфортне життя однієї людини — від 1400€ на місяць.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$portugal$txt$), (select id from categories where slug=$txt$cost-of-living-articles$txt$), 'published', 1, $txt$Скільки коштує життя в Лісабоні$txt$, $txt$Оренда, продукти та транспорт у столиці Португалії — реальний бюджет.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Digital nomad у Португалії$txt$, $txt$digital-nomad-u-portugalii$txt$, $txt$Як працює віза для цифрових кочівників, вимоги до доходу та переваги.$txt$, $txt$Португалія — один із найпопулярніших напрямків для digital nomad завдяки клімату та спеціальній візі.

## Віза D8

Віза для цифрових кочівників вимагає підтвердження віддаленого доходу вище встановленого мінімуму.

## Вимоги до доходу

Потрібно показати стабільний дохід, зазвичай кратний мінімальній зарплаті країни.

## Переваги

Доступ до резидентства, мʼякий клімат та розвинена спільнота фрилансерів.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$portugal$txt$), (select id from categories where slug=$txt$business$txt$), 'published', 1, $txt$Digital nomad у Португалії$txt$, $txt$Як працює віза для цифрових кочівників, вимоги до доходу та переваги.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
insert into articles (title, slug, excerpt, content, country_id, category_id, status, reading_time, seo_title, seo_description, published_at)
values ($txt$Як відкрити бізнес у Португалії$txt$, $txt$yak-vidkryty-biznes-u-portugalii$txt$, $txt$Реєстрація atividade, категорія B, податки та поради для старту.$txt$, $txt$Відкриття бізнесу в Португалії доступне навіть для фрилансерів через спрощену реєстрацію.

## Реєстрація atividade

Діяльність реєструється у Finanças. Потрібен NIF та вибір категорії оподаткування.

## Categoria B

Для самозайнятих діє categoria B з відповідними податковими правилами.

## Поради

Користуйтеся послугами бухгалтера (contabilista) для коректного звітування.

## Висновок

Це базовий гайд для орієнтації. Перед прийняттям рішень перевіряйте актуальну інформацію на офіційних ресурсах та консультуйтесь зі спеціалістами.
$txt$, (select id from countries where slug=$txt$portugal$txt$), (select id from categories where slug=$txt$business$txt$), 'published', 1, $txt$Як відкрити бізнес у Португалії$txt$, $txt$Реєстрація atividade, категорія B, податки та поради для старту.$txt$, now())
on conflict (slug) do update set title=excluded.title, content=excluded.content, updated_at=now();
