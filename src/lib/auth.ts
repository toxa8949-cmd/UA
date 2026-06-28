import { createServerSupabase } from "./supabase";
import type { Role } from "@prisma/client";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

/** Повертає поточного користувача або null */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
  return {
    id: user.id,
    email: user.email,
    role: isAdmin ? "admin" : "viewer",
  };
}

/** true, якщо користувач адмін */
export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin";
}

/** Кидає, якщо не адмін — для захисту admin actions */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
