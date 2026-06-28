"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/server/actions/auth";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signInWithPassword, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">Вхід в адмінку</h1>
        <p className="mt-1 text-sm text-slate-500">Введіть email і пароль.</p>

        <form action={action} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Пароль"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Вхід..." : "Увійти"}
          </Button>
        </form>
      </div>
    </div>
  );
}
