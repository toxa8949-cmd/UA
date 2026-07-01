import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

/**
 * Конверсійний банер під статтями: веде трафік із контенту
 * в каталог «Українцям поруч».
 */
export function PlacesCta({ countryName }: { countryName?: string | null }) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-ink text-white">
      <div className="h-0.5 bg-gradient-to-r from-emerald via-gold-500 to-emerald" />
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-7">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <MapPin size={20} className="text-gold-400" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold">
            Потрібен спеціаліст, який говорить українською?
          </p>
          <p className="mt-1 text-sm text-white/70">
            Юристи, бухгалтери, лікарі, садочки та магазини
            {countryName ? ` у ${countryName}` : " за кордоном"} — у каталозі
            «Українцям поруч».
          </p>
        </div>
        <Link
          href="/places"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Знайти поруч <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
