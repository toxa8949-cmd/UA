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
      setState("ok");
      setMsg("Готово! Перевірте пошту.");
      setEmail("");
    } catch {
      setState("error");
      setMsg("Не вдалося підписатися. Спробуйте пізніше.");
    }
  }

  return (
    <div className="rounded-2xl bg-brand-600 p-8 text-white md:p-12">
      <h2 className="text-2xl font-bold">Отримуйте корисні оновлення для українців за кордоном</h2>
      <p className="mt-2 max-w-xl text-brand-100">
        Гайди, калькулятори та вигідні пропозиції — без спаму.
      </p>
      <div className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email"
          className="flex-1 rounded-lg px-4 py-2.5 text-slate-900 outline-none"
        />
        <Button variant="secondary" onClick={submit} disabled={state === "loading"}>
          {state === "loading" ? "..." : "Підписатися"}
        </Button>
      </div>
      {msg && <p className="mt-3 text-sm text-brand-100">{msg}</p>}
    </div>
  );
}
