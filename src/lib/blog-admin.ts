import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { BLOG_DIR } from "./blog";
import type { Locale } from "@/data/site";

/**
 * Bahasa file admin: "netral" = `<slug>.mdx` (tampil semua bahasa);
 * "id"/"en" = override terjemahan per-bahasa (`<slug>.<locale>.mdx`).
 */
export type AdminLocale = Locale | "netral";

export interface PostDraftInput {
  slug: string;
  locale: AdminLocale;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    draft: boolean;
    cover?: string;
  };
  body: string;
}

export interface SaveResult {
  /** Backend yang dipakai: "fs" (lokal) atau "github" (commit ke repo). */
  backend: "fs" | "github";
  /** URL commit (GitHub) bila tersedia. */
  commitUrl?: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ADMIN_LOCALES: readonly AdminLocale[] = ["netral", "id", "en"];
const MAX_BODY_BYTES = 200_000;

export function validateDraft(d: PostDraftInput): string | null {
  if (!SLUG_RE.test(d.slug)) return "Slug harus huruf kecil, angka, dan tanda hubung.";
  if (!ADMIN_LOCALES.includes(d.locale)) return "Locale tidak dikenal.";
  if (!d.frontmatter.title.trim()) return "Judul wajib diisi.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.frontmatter.date)) return "Format tanggal harus YYYY-MM-DD.";
  if (Buffer.byteLength(d.body, "utf8") > MAX_BODY_BYTES) return "Konten terlalu besar (maks 200KB).";
  return null;
}

/** Serialize frontmatter + body jadi file MDX. */
export function serializePost(d: PostDraftInput): string {
  const fm: Record<string, unknown> = {
    title: d.frontmatter.title,
    date: d.frontmatter.date,
    excerpt: d.frontmatter.excerpt,
    tags: d.frontmatter.tags,
    draft: d.frontmatter.draft,
  };
  if (d.frontmatter.cover) fm.cover = d.frontmatter.cover;
  return matter.stringify(d.body.replace(/\r\n/g, "\n").trimEnd() + "\n", fm);
}

/** Nama file untuk sepasang slug+locale ("netral" → `<slug>.mdx`). */
export function postFileName(d: Pick<PostDraftInput, "slug" | "locale">): string {
  return d.locale === "netral" ? `${d.slug}.mdx` : `${d.slug}.${d.locale}.mdx`;
}

export function postFilePath(d: Pick<PostDraftInput, "slug" | "locale">): string {
  return path.join(BLOG_DIR, postFileName(d));
}

function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

function repoParts(): { owner: string; repo: string } | null {
  const raw = process.env.GITHUB_REPO; // format: "owner/repo"
  if (!raw) return null;
  const [owner, repo] = raw.split("/");
  if (!owner || !repo) return null;
  return { owner, repo };
}

const GH_BRANCH = process.env.GITHUB_BRANCH ?? "main";

function b64(content: string): string {
  return Buffer.from(content, "utf8").toString("base64");
}

/**
 * Commit/ubah satu file MDX lewat GitHub Contents API.
 * Dipakai di produksi (Vercel) karena filesystem bersifat read-only/ephemeral.
 */
async function saveViaGitHub(relPath: string, content: string, message: string): Promise<SaveResult> {
  const cfg = repoParts();
  const token = process.env.GITHUB_TOKEN;
  if (!cfg || !token) throw new Error("GITHUB_TOKEN / GITHUB_REPO belum dikonfigurasi");

  const apiBase = "https://api.github.com";
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  // Ambil sha file bila sudah ada (wajib untuk update).
  const getUrl = `${apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${relPath}?ref=${GH_BRANCH}`;
  const existing = await fetch(getUrl, { headers });
  let sha: string | undefined;
  if (existing.ok) {
    const data = (await existing.json()) as { sha?: string };
    sha = data.sha;
  } else if (existing.status !== 404) {
    throw new Error(`GitHub API gagal membaca file (${existing.status})`);
  }

  const putRes = await fetch(`${apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${relPath}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message,
      content: b64(content),
      branch: GH_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`GitHub API gagal menyimpan (${putRes.status}): ${text.slice(0, 200)}`);
  }
  const result = (await putRes.json()) as { content?: { html_url?: string } };
  return { backend: "github", commitUrl: result.content?.html_url };
}

/** Hapus file via GitHub Contents API (perlu sha). */
async function deleteViaGitHub(relPath: string, message: string): Promise<SaveResult> {
  const cfg = repoParts();
  const token = process.env.GITHUB_TOKEN;
  if (!cfg || !token) throw new Error("GITHUB_TOKEN / GITHUB_REPO belum dikonfigurasi");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  const getUrl = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${relPath}?ref=${GH_BRANCH}`;
  const existing = await fetch(getUrl, { headers });
  if (existing.status === 404) return { backend: "github" }; // sudah tidak ada
  if (!existing.ok) throw new Error(`GitHub API gagal membaca file (${existing.status})`);
  const data = (await existing.json()) as { sha?: string };

  const delRes = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${relPath}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ message, branch: GH_BRANCH, sha: data.sha }),
  });
  if (!delRes.ok) throw new Error(`GitHub API gagal menghapus (${delRes.status})`);
  return { backend: "github" };
}

/**
 * Simpan post. Pilih backend otomatis:
 * - GITHUB_TOKEN + GITHUB_REPO ter-set → commit ke repo (Vercel, persisten → auto rebuild).
 * - Selain itu → tulis lokal via fs (npm run dev).
 */
export async function savePost(d: PostDraftInput): Promise<SaveResult> {
  const content = serializePost(d);
  const relPath = `src/content/blog/${postFileName(d)}`;

  if (githubConfigured()) {
    return saveViaGitHub(relPath, content, `blog: simpan ${relPath.split("/").pop()}`);
  }

  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.writeFile(postFilePath(d), content, "utf8");
  return { backend: "fs" };
}

/** Hapus post (lihat aturan backend sama seperti savePost). */
export async function deletePost(d: Pick<PostDraftInput, "slug" | "locale">): Promise<SaveResult> {
  const relPath = `src/content/blog/${postFileName(d)}`;

  if (githubConfigured()) {
    return deleteViaGitHub(relPath, `blog: hapus ${relPath.split("/").pop()}`);
  }

  try {
    await fs.unlink(postFilePath(d));
  } catch {
    // file tidak ada — tidak masalah
  }
  return { backend: "fs" };
}
