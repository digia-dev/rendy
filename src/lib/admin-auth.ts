import { createHmac, timingSafeEqual } from "node:crypto";

/** Nama cookie sesi admin. */
export const ADMIN_COOKIE = "rendy_admin";
/** Masa berlaku sesi: 12 jam. */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Secret untuk menandatangani cookie.
 * Produksi tanpa BLOG_ADMIN_SECRET → semua sesi dianggap tidak valid (fail-closed).
 * Dev boleh pakai fallback agar lokal langsung bisa dipakai.
 */
function getSecret(): string | null {
  const configured = process.env.BLOG_ADMIN_SECRET;
  if (configured && configured.length >= 8) return configured;
  if (process.env.NODE_ENV !== "production") return "rendy-dev-admin-secret";
  return null;
}

function hmac(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Buat nilai cookie = `<expiryMs>.<hmac>`. */
export function signSession(now = Date.now()): string {
  const secret = getSecret();
  if (!secret) throw new Error("BLOG_ADMIN_SECRET belum dikonfigurasi");
  const exp = String(now + SESSION_TTL_MS);
  return `${exp}.${hmac(exp, secret)}`;
}

/** Verifikasi sesi: signature cocok & belum kedaluwarsa (timing-safe). */
export function verifySession(value: string | undefined | null): boolean {
  if (!value) return false;
  const secret = getSecret();
  if (!secret) return false;

  const sep = value.indexOf(".");
  if (sep <= 0) return false;
  const exp = value.slice(0, sep);
  const sig = value.slice(sep + 1);
  if (!/^\d+$/.test(exp)) return false;

  const expected = hmac(exp, secret);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  return Date.now() <= Number(exp);
}

/**
 * Cocokkan password secara timing-safe.
 * Tanpa BLOG_ADMIN_PASSWORD → selalu false (admin nonaktif, aman default).
 */
export function checkPassword(input: string): boolean {
  const expected = process.env.BLOG_ADMIN_PASSWORD;
  if (!expected || expected.length === 0) return false;

  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // jalankan compare tetap agar durasi tidak bocor dari panjang password
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}
