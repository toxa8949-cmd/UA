"use client";

import { useActionState } from "react";
import { signInWithEmail } from "@/server/actions/auth";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signInWithEmail, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">Вхід в адмінку</h1>
        <p className="mt-1 text-sm text-slate-500">
          Введіть email — ми надішлемо посилання для входу.
        </p>

        {state.ok ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Лист надіслано. Перевірте пошту та перейдіть за посиланням.
          </div>
        ) : (
          <form action={action} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Надсилання..." : "Надіслати посилання"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
