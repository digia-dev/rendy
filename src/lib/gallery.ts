import { promises as fs } from "fs";
import path from "path";

export interface GalleryItem {
  type: "image" | "video";
  src: string;
  poster?: string;
}

const GALLERY_DIR = path.join(process.cwd(), "public", "sites", "rendy", "gallery");
const GALLERY_URL = "/sites/rendy/gallery";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const VIDEO_EXT = [".mp4", ".webm", ".mov", ".ogv"];

/**
 * Baca isi folder galeri saat build (SSG) / SSR.
 * Cukup taruh foto & video di `public/sites/rendy/gallery/` — otomatis terbaca,
 * tanpa mendaftar di site.ts.
 *
 * Aturan penamaan opsional:
 * - `clip.mp4` + `clip.jpg` (nama basis sama) → `clip.jpg` dipakai sebagai
 *   poster/thumbnail video secara otomatis.
 * - Selain itu semua gambar = item galeri, semua video = item galeri.
 */
export async function readGalleryDir(): Promise<GalleryItem[]> {
  let names: string[];
  try {
    names = await fs.readdir(GALLERY_DIR);
  } catch {
    // Folder belum ada — fallback ke foto profil default.
    return [{ type: "image" as const, src: "/sites/rendy/foto-rendy.png" }];
  }

  const isImage = (name: string) => IMAGE_EXT.includes(path.extname(name).toLowerCase());
  const isVideo = (name: string) => VIDEO_EXT.includes(path.extname(name).toLowerCase());
  const baseOf = (name: string) => path.basename(name, path.extname(name)).toLowerCase();
  const url = (name: string) => `${GALLERY_URL}/${encodeURIComponent(name)}`;

  const videoNames = names.filter(isVideo);
  const items: GalleryItem[] = [];

  // Video (pakai poster otomatis jika ada gambar senama).
  for (const v of videoNames) {
    const base = baseOf(v);
    const poster = names.find((n) => isImage(n) && baseOf(n) === base);
    items.push({ type: "video", src: url(v), ...(poster ? { poster: url(poster) } : {}) });
  }

  // Gambar (kecuali yang jadi poster video senama).
  for (const img of names.filter(isImage)) {
    const base = baseOf(img);
    if (videoNames.some((v) => baseOf(v) === base)) continue; // itu poster video
    items.push({ type: "image", src: url(img) });
  }

  return items.sort((a, b) => a.src.localeCompare(b.src));
}