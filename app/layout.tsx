// import type { Metadata } from "next";
// import { Providers } from "./providers";
// import "./globals.css";
// import { cn } from "@/lib/utils";
// import { geist, clashDisplay, vamos } from "./fonts";

// export const metadata: Metadata = {
//   title: "Zenvio Creative",
//   description: "Bold marketing agency built for brands that move people.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cn(
//         geist.variable,
//         clashDisplay.variable,
//         vamos.variable
//       )}
//     >
//       <body className="min-h-screen bg-background font-dm antialiased transition-colors duration-300">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import { geist, clashDisplay, vamos } from "./fonts";
import ZenvioChatbot from "@/components/ZenvioChatbot";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenvio.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Core ────────────────────────────────────────────────
  title: {
    default: "Zenvio Creative — Bold Marketing Agency",
    template: "%s | Zenvio Creative",
  },
  description:
    "Zenvio Creative is a results-driven marketing agency. We build brands that are impossible to scroll past — through social media, paid ads, branding, and content strategy.",
  keywords: [
    "marketing agency",
    "social media management",
    "Meta Ads",
    "Google Ads",
    "branding agency",
    "content strategy",
    "digital marketing",
    "brand identity",
    "growth marketing",
    "Zenvio Creative",
  ],
  authors: [{ name: "Zenvio Creative", url: BASE_URL }],
  creator: "Zenvio Creative",
  publisher: "Zenvio Creative",

  // ── Canonical ───────────────────────────────────────────
  alternates: {
    canonical: "/",
  },

  // ── Open Graph (Facebook / LinkedIn / WhatsApp) ─────────
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Zenvio Creative",
    title: "Zenvio Creative — Bold Marketing Agency",
    description:
      "We build brands that are impossible to scroll past, impossible to forget, and impossible to compete with.",
    images: [
      {
        url: "/og-image.jpg", // 📁 add a 1200×630 image in /public
        width: 1200,
        height: 630,
        alt: "Zenvio Creative — Bold Marketing Agency",
      },
    ],
    locale: "en_US",
  },

  // ── Twitter / X Card ────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Zenvio Creative — Bold Marketing Agency",
    description:
      "Strategy obsessed with results. Creativity that refuses to play it safe.",
    images: ["/og-image.jpg"], // same image as OG
    // creator: "@zenvio", // 🔁 uncomment if you have a Twitter handle
  },

  // ── Icons ───────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/Icon z.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/Icon z.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // ── Manifest / PWA ──────────────────────────────────────
  manifest: "/manifest.webmanifest",

  // ── Theme ───────────────────────────────────────────────
  other: {
    "theme-color": "#7c3aed",
    "color-scheme": "light",
    "msapplication-TileColor": "#7c3aed",
  },

  // ── Verification (add real tokens when ready) ────────────
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  //   other: { "msvalidate.01": "YOUR_BING_TOKEN" },
  // },

  // ── Robots ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ── JSON-LD Structured Data (Google rich results) ────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "MarketingAgency"],
  name: "Zenvio Creative",
  url: BASE_URL,
  logo: `${BASE_URL}/images/Icon%20z.png`,
  image: `${BASE_URL}/og-image.jpg`,
  description:
    "Results-driven marketing agency specialising in social media, paid advertising, branding, and content strategy.",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Marketing Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social Media Management" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paid Advertising (Meta & Google Ads)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Branding & Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Content Strategy" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Newspaper Ads" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Billboard Ads" } },
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    // 🔁 add your real contact email / phone
    // telephone: "+1-000-000-0000",
    // email: "hello@zenvio.com",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.instagram.com/zenviocreative",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geist.variable, clashDisplay.variable, vamos.variable)}
    >
      <head>
        {/* JSON-LD structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-dm antialiased transition-colors duration-300">
        <Providers>{children}</Providers>

        {/* Chatbot — renders on every page, floats bottom-right */}
        <ZenvioChatbot />
      </body>
    </html>
  );
}