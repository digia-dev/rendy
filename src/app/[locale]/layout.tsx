import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { seo, type Locale } from "@/data/site";
import "../globals.css";
import { SmoothAnchor } from "@/components/sites/rendy/SmoothAnchor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;

  return {
    title: seo.title[l],
    description: seo.description[l],
    alternates: {
      canonical: `/${l}`,
      languages: { id: "/id", en: "/en" },
    },
    openGraph: {
      title: seo.title[l],
      description: seo.description[l],
      locale: l === "id" ? "id_ID" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`h-full antialiased ${bricolage.variable}`}>
      <body className="capitaine flex min-h-full flex-col bg-white text-[#1e1e1e]">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <SmoothAnchor />
      </body>
    </html>
  );
}
