import type {
  Country, Article, Service, Deal, User,
  Category, ContentStatus, Role, CategoryType,
} from "@prisma/client";

export type { Country, Article, Service, Deal, User, Category };
export type { ContentStatus, Role, CategoryType };

export type ArticleWithRelations = Article & {
  country: Country | null;
  category: Category | null;
  author: User | null;
};

export type ServiceWithRelations = Service & {
  category: Category | null;
  countries: Country[];
};

export type DealWithRelations = Deal & {
  service: Service | null;
  country: Country | null;
};
