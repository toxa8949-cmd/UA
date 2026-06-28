import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";
import { hashIp, isSafeAffiliateUrl } from "@/lib/affiliate";
import type { Service, Deal } from "@/types/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const supabase = createAdminSupabase();

  // 1. Шукаємо сервіс за slug
  const { data: serviceData } = await supabase
    .from("services")
    .select("id, affiliate_url, website_url")
    .eq("slug", slug)
    .maybeSingle();
  const service = serviceData as Pick<Service, "id" | "affiliate_url" | "website_url"> | null;

  // 2. Якщо немає — шукаємо deal
  let dealId: string | null = null;
  let target = service?.affiliate_url || service?.website_url || null;

  if (!service) {
    const { data: dealData } = await supabase
      .from("deals")
      .select("id, affiliate_url")
      .eq("slug", slug)
      .maybeSingle();
    const deal = dealData as Pick<Deal, "id" | "affiliate_url"> | null;
    if (deal) {
      dealId = deal.id;
      target = deal.affiliate_url;
    }
  }

  // 3. Якщо ціль не знайдено або небезпечна — 404
  if (!target || !isSafeAffiliateUrl(target)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Логуємо клік (best-effort, не блокуємо редірект)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  try {
    await supabase.from("affiliate_clicks").insert({
      service_id: service?.id ?? null,
      deal_id: dealId,
      referrer: req.headers.get("referer") ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
      ip_hash: hashIp(ip),
    } as never);
  } catch {
    // ігноруємо помилки трекінгу
  }

  // 5. Редірект
  return NextResponse.redirect(target, { status: 302 });
}
