import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Websites, packaging, product ads and social media campaigns by Zenvio Creative.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio | Zenvio Creative",
    description:
      "Websites, packaging, product ads and social media campaigns by Zenvio Creative.",
    url: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <Portfolio asPage />
      </main>
      <Footer />
    </>
  );
}
