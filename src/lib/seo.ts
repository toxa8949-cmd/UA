import type { Metadata } from "next";
import { SITE } from "./constants";

type SeoParams = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  ogEyebrow?: string;
  ogCode?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
  ogEyebrow,
  ogCode,
}: SeoParams): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.name;
  const desc = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const ogParams = new URLSearchParams({ title: title ?? SITE.name });
  if (ogEyebrow) ogParams.set("eyebrow", ogEyebrow);
  if (ogCode) ogParams.set("code", ogCode);
  const ogImage = image ?? `${SITE.url}/api/og?${ogParams.toString()}`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

// ─── JSON-LD builders ────────────────────────────────────────

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icons/logo.png`,
  };
}

export function articleJsonLd(a: {
  title: string;
  description?: string | null;
  slug: string;
  image?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  author?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description ?? undefined,
    image: a.image ?? undefined,
    url: `${SITE.url}/articles/${a.slug}`,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt?.toISOString(),
    author: { "@type": "Organization", name: a.author ?? SITE.name },
    publisher: organizationJsonLd(),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// JSON-LD для калькулятора (WebApplication) — допомагає Google показувати rich results
export function calculatorJsonLd(c: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: c.name,
    description: c.description,
    url: `${SITE.url}${c.url}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: "uk",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

// JSON-LD для локального бізнесу (LocalBusiness) — для rich results у локальному пошуку
export function localBusinessJsonLd(p: {
  name: string;
  description?: string | null;
  category?: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  website?: string | null;
  url: string;
  latitude?: number | null;
  longitude?: number | null;
  languages?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: p.name,
    url: `${SITE.url}${p.url}`,
  };
  if (p.description) data.description = p.description;
  if (p.phone) data.telephone = p.phone;
  if (p.website) data.sameAs = [p.website];
  if (p.address || p.city || p.country) {
    data.address = {
      "@type": "PostalAddress",
      ...(p.address ? { streetAddress: p.address } : {}),
      ...(p.city ? { addressLocality: p.city } : {}),
      ...(p.country ? { addressCountry: p.country } : {}),
    };
  }
  if (p.latitude != null && p.longitude != null) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: p.latitude,
      longitude: p.longitude,
    };
  }
  if (p.languages && p.languages.length > 0) {
    data.availableLanguage = p.languages.map((l) => ({
      "@type": "Language",
      name: l,
    }));
  }
  return data;
}
