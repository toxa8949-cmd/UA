// Типи бази даних (замість Prisma). Відповідають таблицям у Supabase.
// Назви таблиць — у snake_case (PostgreSQL-стандарт), на відміну від Prisma-PascalCase.

export type ContentStatus = "draft" | "published" | "archived";
export type Role = "admin" | "editor" | "viewer";
export type CategoryType = "article" | "service" | "deal";

export interface Country {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  short_description: string | null;
  full_description: string | null;
  capital: string | null;
  currency: string | null;
  language: string | null;
  average_salary: number | null;
  minimum_salary: number | null;
  average_rent: number | null;
  cost_of_living_index: number | null;
  tax_summary: string | null;
  business_summary: string | null;
  healthcare_summary: string | null;
  education_summary: string | null;
  transport_summary: string | null;
  faq: { q: string; a: string }[];
  guides: Record<string, { title: string; body: string }[]>;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: CategoryType;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  country_id: string | null;
  category_id: string | null;
  author_id: string | null;
  status: ContentStatus;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website_url: string | null;
  affiliate_url: string | null;
  category_id: string | null;
  pros: string[];
  cons: string[];
  rating: number | null;
  pricing_summary: string | null;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  service_id: string | null;
  country_id: string | null;
  affiliate_url: string | null;
  bonus_amount: string | null;
  terms: string | null;
  valid_until: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  service_id: string | null;
  deal_id: string | null;
  article_id: string | null;
  country_code: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  country_interest: string | null;
  source: string | null;
  created_at: string;
}

// ─── Композитні типи з джойнами ──────────────────────────────

export interface ArticleWithRelations extends Article {
  country: Country | null;
  category: Category | null;
}

export interface ServiceWithRelations extends Service {
  category: Category | null;
  countries: Country[];
}

export interface DealWithRelations extends Deal {
  service: Service | null;
  country: Country | null;
}

// ─── Supabase Database schema (для типізації клієнта) ────────

export interface Database {
  public: {
    Tables: {
      countries: { Row: Country; Insert: Partial<Country>; Update: Partial<Country> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      articles: { Row: Article; Insert: Partial<Article>; Update: Partial<Article> };
      services: { Row: Service; Insert: Partial<Service>; Update: Partial<Service> };
      deals: { Row: Deal; Insert: Partial<Deal>; Update: Partial<Deal> };
      affiliate_clicks: { Row: AffiliateClick; Insert: Partial<AffiliateClick>; Update: Partial<AffiliateClick> };
      newsletter_subscribers: { Row: NewsletterSubscriber; Insert: Partial<NewsletterSubscriber>; Update: Partial<NewsletterSubscriber> };
      service_countries: {
        Row: { service_id: string; country_id: string };
        Insert: { service_id: string; country_id: string };
        Update: Partial<{ service_id: string; country_id: string }>;
      };
    };
  };
}
