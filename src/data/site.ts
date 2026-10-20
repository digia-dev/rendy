/**
 * Seluruh konten situs — satu-satunya sumber kebenaran.
 * Tidak ada teks hardcoded di komponen (lihat PRD.md §8).
 * Angka & fakta berasal dari Marketing_Sales_CV_Rendy.pdf dan rapid.net.id.
 * Teks tersedia dwibahasa (id/en) — PRD.md §13 OQ-1.
 */

export type Locale = "id" | "en";
export type L10n = Record<Locale, string>;

export const profile = {
  initials: "RG",
  name: "Rendy Giantara",
  role: { id: "Marketing & Product Manager", en: "Marketing & Product Manager" } satisfies L10n,
  company: "Rapid Network",
  companyFull: "PT Media Cepat Indonesia",
  website: "https://www.rapid.net.id/",
  location: { id: "Tegal, Jawa Tengah", en: "Tegal, Central Java" } satisfies L10n,
  email: "rendygiantara@gmail.com",
  whatsappDisplay: "081776890009",
  whatsappUrl: "https://wa.me/6281776890009",
  instagram: "https://www.instagram.com/eeerendy/",
  instagramHandle: "@eeerendy",
  linkedin: "https://www.linkedin.com/in/rendygiantara/",
  linkedinHandle: "@rendygiantara",
  maps: "https://www.google.com/maps/search/?api=1&query=Jl.+Anggrek+No.91F+Gandasuli,+Brebes,+Jawa+Tengah",
  tagline: {
    id: "Pemasar yang perfeksionis. Tepat sasaran, tepat waktu.",
    en: "A perfectionist marketer. On target, on time.",
  } satisfies L10n,
} as const;

/** Metrik pribadi di Rapid Network (disetujui pengguna — PRD §5.2b). */
export const metrics = [
  { value: "200+", label: { id: "klien ditangani", en: "clients handled" } satisfies L10n },
  { value: "8+", label: { id: "proyek pemerintah", en: "government projects" } satisfies L10n },
  { value: "7+", label: { id: "cabang dioperasikan", en: "branches operated" } satisfies L10n },
] as const;

/** Kalimat judul hero (baris 1 & 2) — `website` ditandai underline. */
export const hero = {
  line1: { id: "Saya Rendy.", en: "I'm Rendy." } satisfies L10n,
  line2Prefix: { id: "Marketing & Product Manager", en: "Marketing & Product Manager" } satisfies L10n,
  line2Suffix: { id: "di", en: "at" } satisfies L10n,
  line2LinkText: { id: "Rapid Network", en: "Rapid Network" } satisfies L10n,
  subtitle: {
    id: "Menangani 200+ klien, 8+ proyek pemerintah, dan operasional 7+ cabang di ISP & system integrator One Stop Digital Solution.",
    en: "Handling 200+ clients, 8+ government projects, and operations across 7+ branches at an ISP & system integrator delivering one-stop digital solutions.",
  } satisfies L10n,
} as const;

/* ---------------------------------------------------------------- folders */

export interface Folder {
  slug: string;
  href: string;
  label: L10n;
}

export const folders: Folder[] = [
  { slug: "rapid-network", href: "/work/rapid-network", label: { id: "Rapid Network", en: "Rapid Network" } },
  { slug: "home-credit", href: "/work/home-credit", label: { id: "Home Credit", en: "Home Credit" } },
  { slug: "suryapran", href: "/work/suryapran", label: { id: "Suryapran", en: "Suryapran" } },
  { slug: "kimia-farma", href: "/work/kimia-farma", label: { id: "Kimia Farma", en: "Kimia Farma" } },
  { slug: "sertifikat", href: "/work/sertifikat", label: { id: "Sertifikat", en: "Certificates" } },
  { slug: "pendidikan", href: "/work/pendidikan", label: { id: "Pendidikan", en: "Education" } },
];

/* ------------------------------------------------------------ achievements */

export interface Achievement {
  icon: "users" | "building" | "trending" | "award" | "trophy";
  color: string;
  title: L10n;
  desc: L10n;
}

export const achievements: Achievement[] = [
  {
    icon: "users",
    color: "#4c9fe8",
    title: { id: "200+ klien aktif", en: "200+ active clients" },
    desc: { id: "Ditangani langsung di Rapid Network", en: "Handled directly at Rapid Network" },
  },
  {
    icon: "building",
    color: "#7fae8c",
    title: { id: "8+ proyek pemerintah", en: "8+ government projects" },
    desc: { id: "Konektivitas & solusi untuk instansi", en: "Connectivity & solutions for agencies" },
  },
  {
    icon: "trending",
    color: "#8a5cf0",
    title: { id: "Pertumbuhan 10×", en: "10× growth" },
    desc: { id: "Omzet online 100 juta → 1 miliar per bulan", en: "Online revenue IDR 100M → 1B per month" },
  },
  {
    icon: "award",
    color: "#e8524f",
    title: { id: "Innovation Brand Award", en: "Innovation Brand Award" },
    desc: {
      id: "Kimia Farma 2018 — pelopor penjualan online via Instagram",
      en: "Kimia Farma 2018 — pioneered online sales on Instagram",
    },
  },
  {
    icon: "trophy",
    color: "#edb53c",
    title: { id: "Sales JAWARA", en: "Sales JAWARA" },
    desc: { id: "Sertifikasi penjualan di Home Credit Indonesia", en: "Sales certification at Home Credit Indonesia" },
  },
];

/* ------------------------------------------------------------ certificates */

export interface Certificate {
  name: L10n;
  meta: L10n;
  color: string;
}

export const certificates: Certificate[] = [
  {
    name: { id: "Sales JAWARA", en: "Sales JAWARA" },
    meta: { id: "07/2022 – sekarang · Home Credit Indonesia", en: "07/2022 – present · Home Credit Indonesia" },
    color: "#edb53c",
  },
  {
    name: { id: "Strategi Internet Marketing", en: "Internet Marketing Strategy" },
    meta: { id: "04/2021 · efektif & terukur", en: "04/2021 · effective & measurable" },
    color: "#4c9fe8",
  },
  {
    name: { id: "Brand Innovation Award", en: "Brand Innovation Award" },
    meta: { id: "08/2018 · PT Kimia Farma Apotek", en: "08/2018 · PT Kimia Farma Apotek" },
    color: "#e8524f",
  },
  {
    name: { id: "Kimia Farma Innovation Awards", en: "Kimia Farma Innovation Awards" },
    meta: { id: "2018 · peserta", en: "2018 · participant" },
    color: "#8a5cf0",
  },
  {
    name: { id: "Siswa Berprestasi Brebes", en: "Brebes Outstanding Student" },
    meta: { id: "2012 · Dinas Pendidikan Kab. Brebes", en: "2012 · Brebes Education Office" },
    color: "#7fae8c",
  },
  {
    name: { id: "SMK Farmasi YPIB Brebes", en: "YPIB Brebes Pharmacy Vocational School" },
    meta: { id: "2014 · lulus program farmasi", en: "2014 · pharmacy program graduate" },
    color: "#4c9fe8",
  },
];

/* ---------------------------------------------------------------- pillars */

export interface Pillar {
  tab: L10n;
  index: string;
  title: L10n;
  body: L10n;
  ctas: { label: L10n; href: string }[];
  stats: { title: L10n; desc: L10n }[];
}

export const pillars: Pillar[] = [
  {
    tab: { id: "PEMASARAN", en: "MARKETING" },
    index: "1",
    title: { id: "Pemasaran digital yang terukur.", en: "Digital marketing that measurably works." },
    body: {
      id: "Mengelola social media perusahaan dan pelopor penjualan online via Instagram @kimiafarmabatik — kini merangkap peran pemasaran & produk di Rapid Network.",
      en: "Ran company social media and pioneered online sales on Instagram @kimiafarmabatik — now also owning marketing & product at Rapid Network.",
    },
    ctas: [{ label: { id: "Studi kasus Kimia Farma", en: "Kimia Farma case study" }, href: "/work/kimia-farma" }],
    stats: [
      {
        title: { id: "10× pertumbuhan", en: "10× growth" },
        desc: {
          id: "omzet online 100 juta → 1 miliar per bulan di Suryapran Nutrisindo",
          en: "online revenue IDR 100M → IDR 1B per month at Suryapran Nutrisindo",
        },
      },
      {
        title: { id: "Innovation Brand Award", en: "Innovation Brand Award" },
        desc: { id: "pelopor strategi penjualan online via Instagram, 2018", en: "pioneered online sales via Instagram, 2018" },
      },
      {
        title: { id: "Content maker & copywriting", en: "Content making & copywriting" },
        desc: { id: "keterampilan inti yang dipakai setiap hari", en: "core skills used every single day" },
      },
    ],
  },
  {
    tab: { id: "PENJUALAN", en: "SALES" },
    index: "2",
    title: { id: "Penjualan & negosiasi win-win.", en: "Sales & win-win negotiation." },
    body: {
      id: "Penawaran pembiayaan ke nasabah dan perusahaan, negosiasi sampai menemukan titik kesepakatan dengan angsuran yang tepat.",
      en: "Financing offers to individuals and companies, negotiating until we reach agreement on the right installment plan.",
    },
    ctas: [{ label: { id: "Studi kasus Home Credit", en: "Home Credit case study" }, href: "/work/home-credit" }],
    stats: [
      { title: { id: "3+ tahun", en: "3+ years" }, desc: { id: "Sales Associate di Home Credit Indonesia", en: "Sales Associate at Home Credit Indonesia" } },
      { title: { id: "Win-win solution", en: "Win-win solution" }, desc: { id: "negosiasi sampai titik kesepakatan", en: "negotiating until agreement is reached" } },
      { title: { id: "Orientasi target", en: "Target-driven" }, desc: { id: "kerja dengan target yang ditetapkan perusahaan", en: "working to company-set targets" } },
    ],
  },
  {
    tab: { id: "OPERASIONAL", en: "OPERATIONS" },
    index: "3",
    title: { id: "Operasional & pelaporan yang rapi.", en: "Tidy operations & reporting." },
    body: {
      id: "Laporan harian, mingguan, dan bulanan; kontrol barang keluar-masuk gudang; perhitungan HPP dan laporan penjualan.",
      en: "Daily, weekly and monthly reports; warehouse in-out control; cost-of-goods and sales reporting.",
    },
    ctas: [{ label: { id: "Studi kasus Suryapran", en: "Suryapran case study" }, href: "/work/suryapran" }],
    stats: [
      { title: { id: "Laporan terjadwal", en: "Scheduled reporting" }, desc: { id: "harian, mingguan, dan bulanan", en: "daily, weekly and monthly" } },
      { title: { id: "Kontrol stok", en: "Stock control" }, desc: { id: "barang keluar-masuk & cek barang expired", en: "in-out goods & expiry checks" } },
      { title: { id: "Perhitungan HPP", en: "Cost of goods" }, desc: { id: "dasar harga jual yang tepat", en: "the basis for the right pricing" } },
    ],
  },
  {
    tab: { id: "CUSTOMER", en: "CUSTOMER" },
    index: "4",
    title: { id: "Pengalaman pelanggan dulu.", en: "Customer experience first." },
    body: {
      id: "Layanan terbaik untuk pasien, solusi atas masalah kesehatan, dan konsultasi kredit yang menemukan kesepakatan tepat.",
      en: "Best service for patients, solutions to health problems, and credit consultations that land on the right agreement.",
    },
    ctas: [{ label: { id: "Peran saat ini", en: "Current role" }, href: "/work/rapid-network" }],
    stats: [
      { title: { id: "200+ klien", en: "200+ clients" }, desc: { id: "ditangani langsung di Rapid Network", en: "handled directly at Rapid Network" } },
      { title: { id: "8+ proyek pemerintah", en: "8+ government projects" }, desc: { id: "kebutuhan instansi dengan SLA jelas", en: "agency needs with clear SLAs" } },
      { title: { id: "7+ cabang", en: "7+ branches" }, desc: { id: "operasional lintas kota & provinsi", en: "operations across cities & provinces" } },
    ],
  },
];

/* -------------------------------------------------------------- portfolio */

export interface Experience {
  slug: string;
  company: string;
  role: L10n;
  period: string;
  status: "current" | "portfolio";
  desc: L10n;
}

export const experiences: Experience[] = [
  {
    slug: "rapid-network",
    company: "Rapid Network",
    role: { id: "Marketing & Product Manager", en: "Marketing & Product Manager" },
    period: "Sekarang",
    status: "current",
    desc: {
      id: "Menangani 200+ klien, 8+ proyek pemerintah, dan operasional 7+ cabang.",
      en: "Handling 200+ clients, 8+ government projects, and operations across 7+ branches.",
    },
  },
  {
    slug: "home-credit",
    company: "Home Credit Indonesia",
    role: { id: "Sales Associate", en: "Sales Associate" },
    period: "03/2022 – Present",
    status: "portfolio",
    desc: {
      id: "Penawaran pembiayaan & negosiasi win-win dengan angsuran yang tepat.",
      en: "Financing offers & win-win negotiation on the right installment plan.",
    },
  },
  {
    slug: "suryapran",
    company: "PT Suryapran Nutrisindo",
    role: { id: "Warehouse Supervisor", en: "Warehouse Supervisor" },
    period: "07/2020 – 03/2021",
    status: "portfolio",
    desc: {
      id: "Strategi online mengubah penjualan 100 juta/bulan menjadi 1 miliar/bulan; laporan harian–bulanan.",
      en: "Online strategy moved sales from IDR 100M to IDR 1B per month; daily-to-monthly reporting.",
    },
  },
  {
    slug: "kimia-farma",
    company: "PT Kimia Farma Apotek",
    role: { id: "Pharmacist's Assistant", en: "Pharmacist's Assistant" },
    period: "12/2014 – 06/2020",
    status: "portfolio",
    desc: {
      id: "Laporan penjualan & HPP, promosi produk, pelopor penjualan online via Instagram.",
      en: "Sales & cost reporting, product promotion, pioneered online sales via Instagram.",
    },
  },
  {
    slug: "pendidikan",
    company: "SMK Farmasi YPIB Brebes",
    role: { id: "Farmasi", en: "Pharmacy" },
    period: "2014",
    status: "portfolio",
    desc: {
      id: "Lulus program farmasi; juara kompetisi tim cerdas siswa berprestasi Brebes.",
      en: "Pharmacy program graduate; quiz-competition winner among Brebes' outstanding students.",
    },
  },
];

export const portfolioMeta = {
  title: { id: "Portfolio & perjalanan karier", en: "Portfolio & career journey" },
  meta: { id: "2014 – sekarang", en: "2014 – present" },
} as const;

/* --------------------------------------------------------- halaman detail */

export interface WorkPage {
  label: L10n;
  title: L10n;
  subtitle: L10n;
  body: L10n[];
  bullets: L10n[];
}

export const workPages: Record<string, WorkPage> = {
  "rapid-network": {
    label: { id: "Peran saat ini", en: "Current role" },
    title: { id: "Marketing & Product Manager di Rapid Network", en: "Marketing & Product Manager at Rapid Network" },
    subtitle: {
      id: "PT Media Cepat Indonesia — ISP & system integrator, One Stop Digital Solution.",
      en: "PT Media Cepat Indonesia — ISP & system integrator, one-stop digital solutions.",
    },
    body: [
      {
        id: "Rapid Network melayani konektivitas dan infrastruktur digital di 7 kota, 3 provinsi, dengan SLA 99,5% dan support NOC 24/7. Di sini saya menangani sisi pemasaran dan produk: dari kebutuhan klien sampai solusi yang benar-benar terpasang.",
        en: "Rapid Network serves connectivity and digital infrastructure across 7 cities in 3 provinces, with a 99.5% SLA and 24/7 NOC support. I own the marketing and product side: from client needs to solutions that actually get deployed.",
      },
      {
        id: "Sebelumnya saya bekerja di ritel, farmasi, dan pembiayaan — latar itulah yang membuat saya terbiasa membedah kebutuhan pelanggan menjadi angka, lalu mengejar angkanya sampai selesai.",
        en: "Before that I worked in retail, pharmacy and consumer financing — that background is what makes me comfortable turning customer needs into numbers, then chasing those numbers until they land.",
      },
    ],
    bullets: [
      { id: "200+ klien ditangani", en: "200+ clients handled" },
      { id: "8+ proyek pemerintah", en: "8+ government projects" },
      { id: "Operasional di 7+ cabang", en: "Operations across 7+ branches" },
      { id: "Lingkup: marketing, produk, dan koordinasi klien", en: "Scope: marketing, product, and client coordination" },
    ],
  },
  "home-credit": {
    label: { id: "Studi kasus", en: "Case study" },
    title: { id: "Sales Associate di Home Credit Indonesia", en: "Sales Associate at Home Credit Indonesia" },
    subtitle: { id: "03/2022 – Present · pembiayaan konsumen", en: "03/2022 – Present · consumer financing" },
    body: [
      {
        id: "Setiap hari saya menawarkan pembiayaan kredit ke nasabah dan perusahaan, lalu bernegosiasi sampai menemukan titik kesepakatan win-win dengan angsuran yang tepat.",
        en: "Every day I offer credit financing to individuals and companies, then negotiate until we reach a win-win agreement on the right installment plan.",
      },
      {
        id: "Pekerjaan ini dijalankan dengan orientasi pada target yang ditetapkan perusahaan — dan menuntut kesabaran, kejelasan informasi, dan ketelitian dokumen.",
        en: "The role is run against company-set targets — and demands patience, clear information, and document precision.",
      },
    ],
    bullets: [
      { id: "Penawaran pembiayaan ke nasabah & perusahaan", en: "Financing offers to individuals & companies" },
      { id: "Negosiasi win-win sampai kesepakatan", en: "Win-win negotiation until agreement" },
      { id: "Sertifikasi Sales JAWARA (07/2022)", en: "Sales JAWARA certification (07/2022)" },
    ],
  },
  suryapran: {
    label: { id: "Studi kasus", en: "Case study" },
    title: { id: "Warehouse Supervisor di PT Suryapran Nutrisindo", en: "Warehouse Supervisor at PT Suryapran Nutrisindo" },
    subtitle: { id: "07/2020 – 03/2021 · distribusi & ritel", en: "07/2020 – 03/2021 · distribution & retail" },
    body: [
      {
        id: "Selain mengawasi barang keluar-masuk gudang dan memeriksa barang expired, saya mengelola social media perusahaan untuk meningkatkan strategi online.",
        en: "Besides supervising warehouse in-out flows and checking expired goods, I ran the company's social media to strengthen the online strategy.",
      },
      {
        id: "Hasilnya: penjualan berpindah dari 100 juta per bulan menjadi 1 miliar per bulan — sekaligus laporan harian, mingguan, dan bulanan yang rapi.",
        en: "The result: sales moved from IDR 100 million to IDR 1 billion per month, alongside tidy daily, weekly and monthly reports.",
      },
    ],
    bullets: [
      { id: "10× pertumbuhan penjualan online", en: "10× growth in online sales" },
      { id: "Laporan harian, mingguan, bulanan", en: "Daily, weekly and monthly reports" },
      { id: "Kontrol stok & barang kedaluwarsa", en: "Stock & expiry control" },
    ],
  },
  "kimia-farma": {
    label: { id: "Studi kasus", en: "Case study" },
    title: { id: "Pharmacist's Assistant di PT Kimia Farma Apotek", en: "Pharmacist's Assistant at PT Kimia Farma Apotek" },
    subtitle: { id: "12/2014 – 06/2020 · farmasi ritel", en: "12/2014 – 06/2020 · retail pharmacy" },
    body: [
      {
        id: "Saya memberikan layanan terbaik untuk pasien dan solusi atas masalah kesehatan, sekaligus membuat laporan penjualan, menghitung HPP, dan mempromosikan produk.",
        en: "I delivered the best service for patients and solutions to health problems, while writing sales reports, calculating cost of goods, and promoting products.",
      },
      {
        id: "Di sini saya menjadi pelopor strategi penjualan online melalui Instagram @kimiafarmabatik dan meraih gelar innovation brand award pada 2018.",
        en: "This is where I pioneered online sales via Instagram @kimiafarmabatik and earned the innovation brand award in 2018.",
      },
    ],
    bullets: [
      { id: "Innovation Brand Award 2018", en: "Innovation Brand Award 2018" },
      { id: "Pelopor penjualan online via Instagram", en: "Pioneered online sales via Instagram" },
      { id: "Laporan penjualan & perhitungan HPP", en: "Sales reporting & cost-of-goods calculations" },
    ],
  },
  sertifikat: {
    label: { id: "Bukti", en: "Proof" },
    title: { id: "Sertifikat & penghargaan", en: "Certificates & awards" },
    subtitle: { id: "Dokumen yang mendukung portfolio saya", en: "Documents that back up my portfolio" },
    body: [
      {
        id: "Seluruh daftar ini berasal dari CV saya dan dokumen asli yang tersimpan. Nama dan tahun mengikuti dokumen apa adanya.",
        en: "Everything in this list comes from my CV and the original documents I keep on file. Names and years follow the documents as written.",
      },
    ],
    bullets: certificates.map((c) => ({
      id: `${c.name.id} — ${c.meta.id}`,
      en: `${c.name.en} — ${c.meta.en}`,
    })),
  },
  pendidikan: {
    label: { id: "Pendidikan", en: "Education" },
    title: { id: "SMK Farmasi YPIB Brebes", en: "YPIB Brebes Pharmacy Vocational School" },
    subtitle: { id: "Program Farmasi · lulus 2014", en: "Pharmacy program · graduated 2014" },
    body: [
      {
        id: "Sekolah menengah kejuruan dengan kompetensi keahlian farmasi. Semasa sekolah saya memenangkan kompetisi tim cerdas pada kegiatan kemah pramuka khusus siswa berprestasi di wilayah Brebes.",
        en: "A vocational high school with a pharmacy competency program. During school I won a quiz competition at the outstanding-students scout camp held in the Brebes area.",
      },
    ],
    bullets: [
      { id: "Kompetensi keahlian: Farmasi", en: "Competency: Pharmacy" },
      { id: "Juara kompetisi tim cerdas siswa berprestasi", en: "Winner, outstanding-student quiz competition" },
      { id: "Angkatan 2013/2014", en: "Class of 2013/2014" },
    ],
  },
};

/* --------------------------------------------------------------- about.txt */

export const aboutTxt = {
  file: "about-me.txt",
  then: {
    label: { id: "DULU", en: "THEN" },
    body: {
      id: "Mulai sebagai asisten apoteker: melayani pasien, menghitung HPP, dan membuat laporan penjualan. Dari situ saya belajar bahwa layanan dan data tidak bisa dipisah.",
      en: "Started as a pharmacist's assistant: serving patients, calculating cost of goods, writing sales reports. That is where I learned service and data cannot be separated.",
    },
  },
  now: {
    label: { id: "SEKARANG", en: "NOW" },
    body: {
      id: "Marketing & Product Manager di Rapid Network — menangani 200+ klien, 8+ proyek pemerintah, dan operasional di 7+ cabang.",
      en: "Marketing & Product Manager at Rapid Network — handling 200+ clients, 8+ government projects, and operations across 7+ branches.",
    },
  },
  future: {
    label: { id: "MASA DEPAN", en: "THE FUTURE" },
    body: {
      id: "Membangun tim pemasaran yang tumbuh dari data, bukan tebakan — dan tetap perfeksionis soal target.",
      en: "Building a marketing team that grows from data rather than guesses — and staying perfectionist about targets.",
    },
  },
} as const;

/* ------------------------------------------------------------------ dock */

export const askAiPrompt =
  "Tell me about Rendy Giantara, Marketing & Product Manager at Rapid Network (PT Media Cepat Indonesia, www.rapid.net.id), an ISP and system integrator serving 7 cities in Indonesia, where he handles 200+ clients, 8+ government projects and 7+ branches. Before that he grew a company's online sales from IDR 100M/month to IDR 1B/month, closed credit financing deals at Home Credit Indonesia, and won the 2018 Kimia Farma Innovation Brand Award for pioneering online sales on Instagram. Summarize his background, superpowers, and what makes him a standout marketing hire: ";

export const dockApps = [
  { id: "whatsapp", href: profile.whatsappUrl, external: true },
  { id: "email", href: `mailto:${profile.email}`, external: true },
  { id: "instagram", href: profile.instagram, external: true },
  { id: "linkedin", href: profile.linkedin, external: true },
  { id: "website", href: profile.website, external: true },
  { id: "cv", href: "/work/pendidikan", external: false },
  { id: "maps", href: profile.maps, external: true },
  { id: "claude", href: `https://claude.ai/new?q=${encodeURIComponent(askAiPrompt + profile.website)}`, external: true },
  { id: "chatgpt", href: `https://chatgpt.com/?q=${encodeURIComponent(askAiPrompt + profile.website)}`, external: true },
  { id: "lang", href: "", external: false },
] as const;

/* ---------------------------------------------------------------- widgets */

export const widgets = {
  clocks: [
    { label: "JAKARTA", timeZone: "Asia/Jakarta", note: { id: "zona waktu", en: "time zone" } },
  ],
  calendar: {
    /**
     * Penjadwalan mandiri bertema macOS (keputusan pengguna — ganti DaySchedule).
     * Kartu kalender membuka dialog; pengunjung pilih tanggal + jam, lalu tombol
     * membangkitkan tautan Google Calendar (template event) untuk menyimpannya.
     * Tanpa backend/OAuth; `fallbackUrl` (WhatsApp) selalu tersedia sebagai cadangan.
     */
    duration: 30, // menit per slot
    slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "16:00", "17:00"],
    timeZone: "Asia/Jakarta",
    fallbackUrl: profile.whatsappUrl,
    event: {
      title: { id: "Meeting dengan Rendy Giantara", en: "Meeting with Rendy Giantara" },
      details: {
        id: "Halo Rendy, saya ingin menjadwalkan meeting (30 menit) via situs pribadimu.",
        en: "Hi Rendy, I'd like to schedule a 30-minute meeting via your personal site.",
      },
      location: { id: "Online / Rapid Network", en: "Online / Rapid Network" },
    },
    desktopTitle: { id: "kalender", en: "calendar" },
    mobileHint: { id: "Ketuk untuk jadwal meeting", en: "Tap to book a meeting" },
  },
  weather: {
    city: { id: "Jakarta Selatan", en: "Jakarta Selatan" },
    lat: -6.2615,
    lon: 106.8106,
    tz: "Asia/Jakarta",
  },
  music: {
    track: "Melompat Lebih Tinggi",
    artist: "Sheila On 7",
    // Durasi diisi dinamis dari metadata berkas audio saat diputar; nilai ini
    // dipakai sebelum metadata tersedia (fallback).
    duration: "0:00",
    // OQ-4: cover album asli + berkas audio lokal siap putar (keputusan pengguna).
    cover: "/sites/rendy/music/melompat-lebih-tinggi.jpg",
    audioSrc: "/sites/rendy/audio/melompat-lebih-tinggi.mp3",
    streamingUrl: "https://music.youtube.com/search?q=Sheila+On+7+Melompat+Lebih+Tinggi",
  },
  photo: { src: "/sites/rendy/foto-rendy.png" },
} as const;

/* -------------------------------------------------------------------- ui */

export const seo = {
  title: {
    id: "Rendy Giantara — Marketing & Product Manager di Rapid Network",
    en: "Rendy Giantara — Marketing & Product Manager at Rapid Network",
  },
  description: {
    id: "Situs pribadi Rendy Giantara, Marketing & Product Manager di Rapid Network (PT Media Cepat Indonesia). Portfolio penjualan, pemasaran digital, dan operasional 2014–sekarang.",
    en: "Personal site of Rendy Giantara, Marketing & Product Manager at Rapid Network (PT Media Cepat Indonesia). Portfolio in sales, digital marketing and operations, 2014–present.",
  },
} as const;

export const ui = {
  headings: {
    achievements: { id: "Pencapaian", en: "Achievements" },
    certificates: { id: "Sertifikat & penghargaan", en: "Certificates & awards" },
  } satisfies Record<string, L10n>,
  superpowerLabel: { id: "KEUNGGULAN", en: "SUPERPOWER" },
  noSign: "Nº",
  sectionNav: {
    pillars: { href: "#pillar-stack", label: { id: "Pilar keunggulan", en: "Superpower pillars" } },
    achievements: { href: "#achievements", label: { id: "Pencapaian", en: "Achievements" } },
    gallery: { href: "#playground", label: { id: "Galeri", en: "Gallery" } },
    about: { href: "#about", label: { id: "Tentang saya", en: "About me" } },
    booking: { href: profile.whatsappUrl, label: { id: "Jadwalkan meeting", en: "Book a meeting" } },
    contact: { href: "#contact", label: { id: "Kontak", en: "Contact" } },
  },
  navAria: { id: "Navigasi section", en: "Section navigation" },
  menuRole: { id: "peran", en: "role" },
  playground: {
    the: { id: "Sang", en: "The" },
    title: { id: "Galeri", en: "Gallery" },
    viewCta: { id: "Lihat Galeri", en: "View Playground" },
    subtitle: {
      id: "Dokumen, sertifikat, dan potongan perjalanan karier saya.",
      en: "Documents, certificates, and slices of my journey.",
    },
    aria: { id: "Tumpukan kartu galeri", en: "Gallery card stack" },
  },
  playgroundPage: {
    label: { id: "GALERI", en: "PLAYGROUND" },
    title: {
      id: "Karya lama, proyek sampingan & pengalaman sebelumnya.",
      en: "Old work, side projects & earlier gigs.",
    },
    subtitle: {
      id: "Galeri pribadi saya. Hal-hal yang pernah saya kerjakan dan yang saya sukai.",
      en: "My personal gallery. Random stuff I've done and things I like.",
    },
    note: {
      id: "Saya suka membangun sesuatu yang terukur: dari menaikkan penjualan online 100 juta jadi 1 miliar rupiah per bulan, sampai menangani 200+ klien di disruptor ISP. Kalau kamu juga suka bikin sesuatu berdampak, kita sudah teman.",
      en: "I love building things that measurably work: from growing an online business from IDR 100M to IDR 1B/month, to running marketing for 200+ clients at an ISP disruptor. If building with impact is your jam too, we're already friends.",
    },
    noteSig: { id: "Rendy", en: "Rendy" },
    aria: { id: "Halaman galeri", en: "Playground page" },
  },
  terminal: {
    host: "visitor@rendygiantara",
    titlebar: { id: "visitor@rendygiantara — zsh — 80×24", en: "visitor@rendygiantara — zsh — 80×24" },
    close: { id: "Tutup terminal", en: "Close terminal" },
    login: { id: "Last login: just now on ttys001", en: "Last login: just now on ttys001" },
    welcome: {
      id: "rendy-5 shell. Tanya apa saja tentang Rendy, atau ketik `help`.",
      en: "rendy-5 shell. Ask anything about Rendy, or type `help`.",
    },
    prompt: "~ %",
    command: { id: "help", en: "help" },
    helpIntro: { id: "perintah yang tersedia:", en: "available commands:" },
    help: {
      list: { id: "daftar ini", en: "this list" },
      ls: { id: "lihat sekeliling", en: "look around" },
      catContact: { id: "cara menghubungi Rendy", en: "how to reach Rendy" },
      whoami: { id: "cek eksistensi", en: "existential check" },
      clear: { id: "bersihkan layar", en: "clean the screen" },
      exit: { id: "tutup jendela", en: "close the window" },
    },
    anything: {
      id: "selain itu adalah pertanyaan untuk rendy-5.",
      en: "anything else is a question for rendy-5.",
    },
    lsNote: {
      id: "(ketik `cat <berkas>` untuk melihat isinya)",
      en: "(type `cat <file>` to peek inside)",
    },
    ls: {
      caseStudies: { id: "case-studies/", en: "case-studies/" },
      playground: { id: "playground/", en: "playground/" },
      press: { id: "press/", en: "press/" },
      contact: "contact.txt",
      resume: { id: "resume.pdf", en: "resume.pdf" },
    },
    contact: {
      intro: { id: "cara paling cepat menghubungi Rendy:", en: "the quickest ways to reach Rendy:" },
      email: { id: "email:", en: "email:" },
      whatsapp: { id: "whatsapp:", en: "whatsapp:" },
      linkedin: { id: "linkedin:", en: "linkedin:" },
      instagram: { id: "instagram:", en: "instagram:" },
    },
    whoami: {
      id: "pengunjung. Saya rendy-5, terminal Rendy. Tanya apa saja tentang dia.",
      en: "visitor. I'm rendy-5, Rendy's terminal. Ask me anything about him.",
    },
    aiHint: {
      id: "Ini akan mengajukan pertanyaanmu ke AI.",
      en: "This will take your question to an AI.",
    },
  },
  contact: {
    writeLabel: { id: "Tulis pesan", en: "Send a message" },
    bookLabel: { id: "Jadwalkan meeting", en: "Book a meeting" },
    emailLabel: { id: "Email", en: "Email" },
    whatsappLabel: { id: "WhatsApp", en: "WhatsApp" },
    instagramLabel: { id: "Instagram", en: "Instagram" },
    linkedinLabel: { id: "LinkedIn", en: "LinkedIn" },
    websiteLabel: { id: "Website Rapid Network", en: "Rapid Network website" },
    rights: { id: "© 2026 Rendy Giantara", en: "© 2026 Rendy Giantara" },
    badgesCaption: { id: "Marketing & Product · Rapid Network", en: "Marketing & Product · Rapid Network" },
  },
  footerLang: { id: "Bahasa", en: "Language" },
  clockAria: { id: "Jam analog", en: "Analog clock" },
  weatherError: { id: "Cuaca tidak tersedia", en: "Weather unavailable" },
  weatherDay: { id: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  musicPlay: { id: "Putar di YouTube Music", en: "Play on YouTube Music" },
  bookingTitle: { id: "Jadwalkan meeting", en: "Book a meeting" },
  booking: {
    title: { id: "Pilih waktu", en: "Pick a time" },
    subtitle: {
      id: "Meeting 30 menit bersama Rendy. Pilih tanggal & jam, lalu simpan ke kalender.",
      en: "A 30-minute meeting with Rendy. Pick a date & time, then save it to your calendar.",
    },
    prevMonth: { id: "Bulan sebelumnya", en: "Previous month" },
    nextMonth: { id: "Bulan berikutnya", en: "Next month" },
    slotsLabel: { id: "Jam tersedia", en: "Available times" },
    pickPrompt: { id: "Pilih jam di atas untuk melanjutkan.", en: "Pick a time above to continue." },
    addLabel: { id: "Simpan ke Google Calendar", en: "Add to Google Calendar" },
    whatsLabel: { id: "Atau chat WhatsApp", en: "Or chat on WhatsApp" },
    closeLabel: { id: "Tutup", en: "Close" },
    chosenLabel: { id: "Terpilih", en: "Selected" },
    dayAria: { id: "Pilih tanggal", en: "Select date" },
  },
  backToHome: { id: "← Kembali ke beranda", en: "← Back to home" },
  caseStudy: { id: "STUDI KASUS", en: "CASE STUDY" },
  currentRoleBadge: { id: "PERAN SAAT INI", en: "CURRENT ROLE" },
} as const;

export const monthsShort = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} as const;

export const daysLong = {
  id: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
} as const;

export const daysShort = {
  id: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
} as const;

export const monthsLong = {
  id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
} as const;
