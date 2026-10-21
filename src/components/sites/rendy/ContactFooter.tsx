import { Link } from "@/i18n/navigation";
import { profile, ui, type Locale } from "@/data/site";
import { AppIcon, RoundBadge } from "./icons";

const links = [
  { key: "whatsapp", href: profile.whatsappUrl, label: ui.contact.whatsappLabel, external: true },
  { key: "email", href: `mailto:${profile.email}`, label: ui.contact.emailLabel, external: true },
  { key: "instagram", href: profile.instagram, label: ui.contact.instagramLabel, external: true },
  { key: "linkedin", href: profile.linkedin, label: ui.contact.linkedinLabel, external: true },
  { key: "website", href: profile.website, label: ui.contact.websiteLabel, external: true },
] as const;

const socialIcons = ["whatsapp", "instagram", "linkedin", "email"] as const;

const badges = [
  { color: "#4c9fe8", label: "200+\nklien" },
  { color: "#8a5cf0", label: "8+\nproyek" },
  { color: "#edb53c", label: "7+\ncabang" },
];

/** Footer kontak — sumber: 3 kolom (identitas+sosial · daftar tautan · lencana). */
export function ContactFooter({ locale }: { locale: Locale }) {
  const other = locale === "id" ? "en" : "id";

  return (
    <footer id="contact" className="relative z-10 border-t border-black/10 bg-white px-6 py-8 md:py-10">
      <div className="mx-auto grid max-w-[1060px] gap-10 md:grid-cols-[1.2fr_1fr_0.9fr] md:gap-6">
        {/* identitas */}
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[17px] font-extrabold text-black shadow-[0_4px_12px_rgba(0,0,0,0.14)]">
              {profile.initials}
            </span>
            <span>
              <span className="block text-[15px] font-bold text-black">{profile.name}</span>
              <span className="block text-[14px] text-neutral-500">{profile.tagline[locale]}</span>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialIcons.map((id) => {
              const href =
                id === "whatsapp"
                  ? profile.whatsappUrl
                  : id === "instagram"
                    ? profile.instagram
                    : id === "linkedin"
                      ? profile.linkedin
                      : `mailto:${profile.email}`;
              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={id}
                  className="rounded-[12px] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
                >
                  <AppIcon id={id} />
                </a>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/"
              locale={other}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-semibold text-neutral-600 hover:border-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {other.toUpperCase()}, {ui.footerLang[locale]}
            </Link>
          </div>
        </div>

        {/* daftar tautan */}
        <nav className="flex flex-col gap-3.5">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="w-fit text-[14px] text-neutral-700 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
            >
              {l.label[locale]} →
            </a>
          ))}
          <a
            href={profile.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 w-fit rounded-full bg-gradient-to-b from-[#57a4f0] to-[#3e8fe4] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_14px_rgba(62,143,228,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0069d9]"
          >
            {ui.contact.bookLabel[locale]} →
          </a>
        </nav>

        {/* lencana */}
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="flex gap-2">
            {badges.map((b) => (
              <RoundBadge key={b.label} color={b.color} label={b.label} />
            ))}
          </div>
          <p className="text-[13px] text-neutral-500">{ui.contact.badgesCaption[locale]}</p>
          <p className="text-[13px] text-neutral-400">{ui.contact.rights[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
