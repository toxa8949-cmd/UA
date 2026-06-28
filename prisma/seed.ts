import { PrismaClient } from "@prisma/client";
import { countriesSeed } from "../src/data/countries.seed";
import { categoriesSeed } from "../src/data/categories.seed";
import { servicesSeed } from "../src/data/services.seed";
import { articlesSeed } from "../src/data/articles.seed";

const prisma = new PrismaClient();

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

async function main() {
  console.log("🌱 Seeding...");

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@ukrabroad.local" },
    update: {},
    create: { email: "admin@ukrabroad.local", name: "Admin", role: "admin" },
  });

  // Countries
  const countryMap = new Map<string, string>();
  for (const c of countriesSeed) {
    const country = await prisma.country.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    countryMap.set(c.slug, country.id);
  }
  console.log(`✅ Countries: ${countriesSeed.length}`);

  // Categories
  const categoryMap = new Map<string, string>();
  for (const cat of categoriesSeed) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, type: cat.type, description: cat.description ?? null },
      create: { name: cat.name, slug: cat.slug, type: cat.type, description: cat.description ?? null },
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(`✅ Categories: ${categoriesSeed.length}`);

  // Services
  for (const s of servicesSeed) {
    const countryIds = s.countrySlugs
      .map((slug) => countryMap.get(slug))
      .filter((id): id is string => Boolean(id));
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        websiteUrl: s.websiteUrl,
        affiliateUrl: s.affiliateUrl,
        categoryId: categoryMap.get(s.categorySlug) ?? null,
        pros: s.pros,
        cons: s.cons,
        rating: s.rating,
        pricingSummary: s.pricingSummary,
        isFeatured: s.isFeatured,
        countries: { set: countryIds.map((id) => ({ id })) },
      },
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        websiteUrl: s.websiteUrl,
        affiliateUrl: s.affiliateUrl,
        categoryId: categoryMap.get(s.categorySlug) ?? null,
        pros: s.pros,
        cons: s.cons,
        rating: s.rating,
        pricingSummary: s.pricingSummary,
        isFeatured: s.isFeatured,
        countries: { connect: countryIds.map((id) => ({ id })) },
      },
    });
  }
  console.log(`✅ Services: ${servicesSeed.length}`);

  // Articles
  for (const a of articlesSeed) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        countryId: countryMap.get(a.countrySlug) ?? null,
        categoryId: categoryMap.get(a.categorySlug) ?? null,
        seoTitle: a.seoTitle ?? a.title,
        seoDescription: a.seoDescription ?? a.excerpt,
        readingTime: readingTime(a.content),
        status: "published",
        publishedAt: new Date(),
        authorId: admin.id,
      },
      create: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        countryId: countryMap.get(a.countrySlug) ?? null,
        categoryId: categoryMap.get(a.categorySlug) ?? null,
        seoTitle: a.seoTitle ?? a.title,
        seoDescription: a.seoDescription ?? a.excerpt,
        readingTime: readingTime(a.content),
        status: "published",
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
  }
  console.log(`✅ Articles: ${articlesSeed.length}`);

  console.log("🎉 Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
