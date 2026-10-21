"use client";

import { useState } from "react";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { ui, type Locale } from "@/data/site";

interface AdminPost {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  body: string;
}

interface Props {
  locale: Locale;
  authed: boolean;
  initialPosts: AdminPost[];
}

interface FormState {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  excerpt: string;
  tags: string;
  draft: boolean;
  body: string;
}

function emptyForm(locale: Locale): FormState {
  return {
    slug: "",
    locale,
    title: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    tags: "",
    draft: true,
    body: "",
  };
}

/** Gabungkan state form + posts; tampilkan login dialog bila belum sesi. */
export function AdminGate({ locale, authed, initialPosts }: Props) {
  const [posts, setPosts] = useState<AdminPost[]>(initialPosts);
  const [form, setForm] = useState<FormState>(() => emptyForm(locale));
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const selectPost = (p: AdminPost) => {
    setForm({
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      tags: p.tags.join(", "),
      draft: p.draft,
      body: p.body,
    });
    setStatus(null);
    // Daftar hanya berisi meta — muat body terpisah via query slug+locale.
    if (!p.body) {
      void (async () => {
        try {
          const res = await fetch(
            `/api/admin/posts?slug=${encodeURIComponent(p.slug)}&locale=${p.locale}`,
          );
          const data = (await res.json()) as { ok: boolean; post?: { body: string } };
          if (res.ok && data.ok && data.post) {
            setForm((prev) => (prev.slug === p.slug && prev.locale === p.locale ? { ...prev, body: data.post!.body } : prev));
          }
        } catch {
          // biarkan form kosong; user bisa muat ulang
        }
      })();
    }
  };

  const refreshList = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = (await res.json()) as {
        ok: boolean;
        posts?: { slug: string; locale: Locale; title: string; date: string; excerpt: string; tags: string[]; draft: boolean }[];
      };
      if (data.ok && data.posts) {
        setPosts((prev) =>
          data.posts!.map((m) => {
            const old = prev.find((o) => o.slug === m.slug && o.locale === m.locale);
            return { ...m, body: old?.body ?? "" };
          }),
        );
      }
    } catch {
      // daftar lama tetap dipakai
    }
  };

  if (!authed)
    return (
      <LoginDialog
        locale={locale}
        onLogin={() => {
          // router.refresh() me-render ulang server (authed + initialPosts baru),
          // tapi useState posts tidak reset — isi ulang daftar via API (cookie
          // sudah terpasang oleh respons login).
          router.refresh();
          void refreshList();
        }}
      />
    );

  const onSave = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          locale: form.locale,
          title: form.title,
          date: form.date,
          excerpt: form.excerpt,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          draft: form.draft,
          body: form.body,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; backend?: string };
      if (!res.ok || !data.ok) {
        setStatus({ kind: "err", text: data.error ?? "Gagal menyimpan." });
      } else {
        setStatus({
          kind: "ok",
          text:
            data.backend === "github"
              ? "Tersimpan — commit terkirim, deploy menyusul (~1 menit)."
              : "Tersimpan ke src/content/blog (build ulang diperlukan di produksi).",
        });
        await refreshList();
      }
    } catch {
      setStatus({ kind: "err", text: "Gagal menghubungi server." });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!form.slug) return;
    if (!confirm(`Hapus ${form.slug}.${form.locale}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(
        `/api/admin/posts?slug=${encodeURIComponent(form.slug)}&locale=${form.locale}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({ kind: "err", text: data.error ?? "Gagal menghapus." });
      } else {
        setStatus({ kind: "ok", text: "Post dihapus." });
        setForm(emptyForm(locale));
        await refreshList();
      }
    } catch {
      setStatus({ kind: "err", text: "Gagal menghubungi server." });
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const inputCls =
    "w-full rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-[#0069d9]/40 focus:outline-none";

  return (
    <div className="sheet-enter flex h-[calc(100dvh-8rem)] min-h-[480px] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.07] md:h-[calc(100dvh-9rem)]">
      {/* Titlebar */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-black/[0.008] bg-[#f4f4f5] px-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/[0.08] ring-inset" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/[0.08] ring-inset" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/[0.08] ring-inset" />
        </div>
        <span className="flex-1 truncate text-center text-[12.5px] font-medium text-neutral-500">
          Blog Admin
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-neutral-500 transition-colors hover:bg-black/[0.06] hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Keluar
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Daftar file */}
        <aside className="flex min-h-0 w-full shrink-0 flex-col border-b border-black/[0.07] bg-[#fafafa] md:w-[290px] md:border-r md:border-b-0">
          <div className="shrink-0 px-3 pt-3 pb-2">
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm(locale));
                setStatus(null);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-black px-2.5 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Post baru
            </button>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3" aria-label="Daftar post">
            {posts.length === 0 ? (
              <p className="px-2 py-6 text-center text-[13px] text-neutral-400">
                Belum ada file. Buat post baru.
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {posts.map((p) => {
                  const active = p.slug === form.slug && p.locale === form.locale;
                  return (
                    <li key={`${p.slug}.${p.locale}`}>
                      <button
                        type="button"
                        onClick={() => selectPost(p)}
                        className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
                          active ? "bg-[#e8e8ed]" : "hover:bg-black/[0.045]"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[13px] font-semibold text-neutral-900">
                            {p.title || p.slug}
                          </span>
                          <span className="shrink-0 rounded bg-black/[0.06] px-1 py-px text-[9.5px] font-bold uppercase text-neutral-500">
                            {p.locale}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <span>{p.date}</span>
                          {p.draft ? (
                            <span className="rounded bg-[#febc2e]/30 px-1 py-px text-[9.5px] font-semibold uppercase text-[#8a6100]">
                              Draf
                            </span>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </aside>

        {/* Form editor */}
        <section className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-6 md:px-7">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              {/* Baris: slug + locale */}
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                    Slug (URL)
                  </span>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }))}
                    placeholder="contoh: tips-marketing"
                    className={inputCls}
                  />
                </label>
                <div className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                    Bahasa
                  </span>
                  <div className="flex overflow-hidden rounded-md ring-1 ring-black/10">
                    {(["id", "en"] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, locale: loc }))}
                        className={`px-3 py-1.5 text-[12.5px] font-bold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9] ${
                          form.locale === loc
                            ? "bg-black text-white"
                            : "bg-white text-neutral-500 hover:bg-black/[0.04]"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                  Judul
                </span>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputCls}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                <label className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                    Tanggal
                  </span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className={`${inputCls} w-auto`}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                    Tags (pisahkan koma)
                  </span>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="marketing, product"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                  Cuplikan (excerpt)
                </span>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  className={`${inputCls} resize-y`}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-500">
                  Konten (Markdown/MDX)
                </span>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={14}
                  spellCheck={false}
                  className={`${inputCls} resize-y font-mono text-[13px] leading-relaxed`}
                />
              </label>

              <label className="flex items-center gap-2 text-[13.5px] text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.draft}
                  onChange={(e) => setForm((f) => ({ ...f, draft: e.target.checked }))}
                  className="h-4 w-4 accent-[#febc2e]"
                />
                Draf (tidak tampil di publik & RSS)
              </label>

              {/* Aksi */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={busy || !form.slug || !form.title}
                  className="flex items-center gap-1.5 rounded-md bg-black px-3.5 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {busy ? "Menyimpan…" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={busy || !form.slug}
                  className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold text-[#d70015] ring-1 ring-[#d70015]/30 transition-colors hover:bg-[#fff0f0] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70015]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Hapus
                </button>
                {form.slug && !form.draft ? (
                  <a
                    href={`/${locale}/blog/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-neutral-500 underline underline-offset-2 transition-colors hover:text-black"
                  >
                    Lihat di situs ↗
                  </a>
                ) : null}
                {status ? (
                  <span
                    role="status"
                    className={`text-[12.5px] font-medium ${
                      status.kind === "ok" ? "text-[#1c7c2f]" : "text-[#d70015]"
                    }`}
                  >
                    {status.text}
                  </span>
                ) : null}
              </div>

              <p className="text-[12px] leading-relaxed text-neutral-400">
                Frontmatter otomatis dari form. Satu pasang file per post:{" "}
                <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[11.5px]">
                  {"<slug>.<locale>.mdx"}
                </code>{" "}
                di <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[11.5px]">src/content/blog/</code>.
              </p>
            </div>
          </div>
        </section>
      </div>
      <p className="sr-only">{ui.blog.windowTitle[locale]}</p>
    </div>
  );
}

/** Dialog login ala macOS: kotak password kecil di tengah. */
function LoginDialog({ locale, onLogin }: { locale: Locale; onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login gagal.");
      } else {
        setPassword("");
        onLogin();
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sheet-enter w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.07]">
      <div className="flex h-10 items-center gap-2 border-b border-black/[0.08] bg-[#f4f4f5] px-3" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/[0.08] ring-inset" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/[0.08] ring-inset" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/[0.08] ring-inset" />
        <span className="flex-1 text-center text-[12.5px] font-medium text-neutral-500">
          Blog Admin
        </span>
        <span className="w-[60px]" />
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3 px-5 pt-5 pb-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.06]">
            <span className="text-[22px]" aria-hidden="true">
              🔒
            </span>
          </div>
          <p className="mt-2.5 text-[15px] font-semibold text-neutral-900">Masuk ke blog admin</p>
          <p className="mt-0.5 text-[12.5px] text-neutral-500">
            {locale === "id"
              ? "Area ini terproteksi password."
              : "This area is password protected."}
          </p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Password"
          aria-label="Password"
          className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-[#0069d9]/40 focus:outline-none"
        />
        {error ? (
          <p role="alert" className="text-center text-[12.5px] font-medium text-[#d70015]">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="rounded-md bg-black px-3.5 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
        >
          {busy ? "Memeriksa…" : locale === "id" ? "Masuk" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
