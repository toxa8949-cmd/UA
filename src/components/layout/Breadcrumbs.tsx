import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Хлібні крихти" className="container py-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          {items.map((item, i) => (
            <li key={item.url} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
              {i === items.length - 1 ? (
                <span className="text-slate-700">{item.name}</span>
              ) : (
                <Link href={item.url} className="hover:text-brand-600">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
