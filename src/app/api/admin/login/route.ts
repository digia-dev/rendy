import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_TTL_MS, checkPassword, signSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

interface LoginBody {
  password?: unknown;
}

/**
 * POST /api/admin/login — verifikasi password lalu set cookie sesi httpOnly (12 jam).
 * Jika BLOG_ADMIN_PASSWORD tidak di-set, selalu gagal (401).
 */
export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: "Password salah." }, { status: 401 });
  }

  let token: string;
  try {
    token = signSession();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Admin belum dikonfigurasi (BLOG_ADMIN_SECRET)." },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
