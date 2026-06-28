"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit() {
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      if (!res.ok) throw new Error();
      setState("ok"); setMsg("Готово! Перевірте пошту."); setEmail("");
    } catch {
      setState("error"); setMsg("Не вдалося підписатися. Спробуйте пізніше.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald/20 bg-emerald p-8 md:p-12">
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Корисні оновлення раз на тиждень</h2>
        <p className="mt-3 text-emerald-50/90">Нові гайди, калькулятори й вигідні пропозиції. Без спаму, відписка будь-коли.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com" aria-label="Email"
            className="flex-1 rounded-xl border-0 px-4 py-3 text-ink outline-none ring-2 ring-transparent focus:ring-gold-400"
          />
          <Button variant="secondary" onClick={submit} disabled={state === "loading"} className="bg-ink hover:bg-ink-800">
            {state === "loading" ? "..." : "Підписатися"}
          </Button>
        </div>
        {msg && <p className="mt-3 text-sm text-emerald-50">{msg}</p>}
      </div>
    </div>
  );
}
