import { z } from "zod";

export const emailSchema = z.string().email("Невірний email");

export const newsletterSchema = z.object({
  email: emailSchema,
  countryInterest: z.string().optional(),
  source: z.string().optional(),
});

export const searchSchema = z.object({
  q: z.string().min(2).max(100),
});

export const articleSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(120),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal("")),
  countryId: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  countryIds: z.array(z.string()).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  pricingSummary: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export const dealSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120),
  description: z.string().optional(),
  serviceId: z.string().optional(),
  countryId: z.string().optional(),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  bonusAmount: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
});
