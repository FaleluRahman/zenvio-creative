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

const BASE_URL = "https://zenvio.com"; // 🔁 replace with your real domain

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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

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
  "@type": "MarketingAgency",
  name: "Zenvio Creative",
  url: BASE_URL,
  description:
    "Results-driven marketing agency specialising in social media, paid advertising, branding, and content strategy.",
  areaServed: "Worldwide",
  serviceType: [
    "Social Media Management",
    "Paid Advertising",
    "Branding & Design",
    "Content Strategy",
    "Newspaper Ads",
    "Billboard Ads",
  ],
  sameAs: [
    // 🔁 add your real social links
    // "https://instagram.com/zenvio",
    // "https://linkedin.com/company/zenvio",
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