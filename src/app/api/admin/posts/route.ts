import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { readPostFiles } from "@/lib/blog";
import {
  deletePost,
  savePost,
  validateDraft,
  type AdminLocale,
  type PostDraftInput,
} from "@/lib/blog-admin";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";

const ADMIN_LOCALES: readonly AdminLocale[] = ["netral", ...routing.locales];

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Tidak terautentikasi." }, { status: 401 });
}

function isLocale(v: unknown): v is AdminLocale {
  return typeof v === "string" && (ADMIN_LOCALES as readonly string[]).includes(v);
}

/**
 * GET /api/admin/posts?slug=&locale=&includeDrafts=1
 * Kembalikan isi post (termasuk draft) untuk editor.
 * Tanpa query → daftar ringkas semua file (termasuk draft).
 * locale bisa "netral" (file `<slug>.mdx`) atau "id"/"en" (override per-bahasa).
 */
export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const locale = url.searchParams.get("locale");
  const files = await readPostFiles();

  if (slug && isLocale(locale)) {
    // "netral" → file.locale === null; selain itu file.locale sesuai.
    const want = locale === "netral" ? null : locale;
    const file = files.find((f) => f.slug === slug && f.locale === want);
    if (!file) return NextResponse.json({ ok: false, error: "Post tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ ok: true, post: file });
  }

  return NextResponse.json({
    ok: true,
    posts: files
      .map((f) => ({
        slug: f.slug,
        locale: (f.locale ?? "netral") as AdminLocale,
        title: f.title,
        date: f.date,
        excerpt: f.excerpt,
        tags: f.tags,
        draft: f.draft,
      }))
      .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)),
  });
}

/**
 * POST /api/admin/posts — buat/update post.
 * Body: { slug, locale, title, date, excerpt, tags, draft, cover?, body }
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }

  const draft: PostDraftInput = {
    slug: String(payload.slug ?? ""),
    locale: isLocale(payload.locale) ? payload.locale : "netral",
    frontmatter: {
      title: String(payload.title ?? ""),
      date: String(payload.date ?? ""),
      excerpt: String(payload.excerpt ?? ""),
      tags: Array.isArray(payload.tags)
        ? payload.tags.filter((t): t is string => typeof t === "string")
        : [],
      draft: payload.draft === true,
      ...(typeof payload.cover === "string" && payload.cover ? { cover: payload.cover } : {}),
    },
    body: String(payload.body ?? ""),
  };

  const error = validateDraft(draft);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

  try {
    const result = await savePost(draft);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal menyimpan post.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/posts?slug=&locale=
 */
export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const locale = url.searchParams.get("locale");
  if (!slug || !isLocale(locale)) {
    return NextResponse.json({ ok: false, error: "Parameter kurang." }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return NextResponse.json({ ok: false, error: "Slug tidak valid." }, { status: 400 });
  }

  try {
    const result = await deletePost({ slug, locale });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal menghapus post.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
