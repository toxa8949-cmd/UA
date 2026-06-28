import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";
import { newsletterSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
    }
    const supabase = createAdminSupabase();
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: parsed.data.email,
      country_interest: parsed.data.countryInterest ?? null,
      source: parsed.data.source ?? null,
    } as never);
    // ігноруємо дублікат email (unique constraint)
    if (error && !error.message.includes("duplicate")) {
      return NextResponse.json({ error: "Помилка" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Помилка" }, { status: 500 });
  }
}
