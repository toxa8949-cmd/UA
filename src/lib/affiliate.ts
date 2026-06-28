import { createHash } from "crypto";

/** Хешуємо IP, щоб не зберігати персональні дані у відкритому вигляді */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip + (process.env.IP_SALT ?? "salt")).digest("hex").slice(0, 32);
}

/** Дозволяємо redirect лише на абсолютні https-URL (захист від open redirect) */
export function isSafeAffiliateUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
