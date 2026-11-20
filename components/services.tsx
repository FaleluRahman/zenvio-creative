"use client";

import { useIsDark } from "@/lib/use-is-dark";
import { useEffect, useState, useRef } from "react";
import {
  Clapperboard, TrendingUp, Palette, Newspaper, Globe, LayoutDashboard, type LucideIcon,
} from "lucide-react";

/* ─── Services Data ───────────────────────────────────────────── */
interface ServiceItem {
  id: string;
  category: "digital-marketing" | "branding" | "traditional" | "development";
  badge: string;
  rightBadge?: React.ReactNode;
  title: string;
  shortTitle: string; // compact label for mobile tiles
  tagline: string;    // 2–3 word hook for mobile tiles
  icon: LucideIcon;
  desc: string;
  tags: string[];     // the specific services this card covers
}

/* One accent per category — colours the mobile tile icons */
const categoryAccent: Record<ServiceItem["category"], string> = {
  "digital-marketing": "#c084fc",
  branding: "#f472b6",
  traditional: "#fbbf24",
  development: "#38bdf8",
};

const servicesData: ServiceItem[] = [
  {
    id: "01",
    category: "digital-marketing",
    badge: "01 // Social",
    rightBadge: (
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" aria-hidden="true" />
    ),
    title: "Social Media & Content",
    shortTitle: "Social & Content",
    tagline: "Scrollers → fans",
    icon: Clapperboard,
    desc: "Daily content, reels and community that turn scrollers into fans.",
    tags: ["Social Media", "Reels & Video", "Community"],
  },
  {
    id: "02",
    category: "digital-marketing",
    badge: "02 // Growth",
    rightBadge: <span className="text-xs text-purple-200 font-semibold tracking-wider uppercase">ROAS Driven</span>,
    title: "Growth Marketing",
    shortTitle: "Growth Marketing",
    tagline: "Ads, SEO & retention",
    icon: TrendingUp,
    desc: "Meta & Google ads, SEO and WhatsApp flows that bring buyers — and bring them back.",
    tags: ["Meta & Google Ads", "SEO", "Email & WhatsApp"],
  },
  {
    id: "03",
    category: "branding",
    badge: "03 // Identity",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Iconic Design</span>,
    title: "Branding & Copy",
    shortTitle: "Branding & Copy",
    tagline: "Look & sound iconic",
    icon: Palette,
    desc: "Logos, visual identity, packaging and words that make your brand unforgettable.",
    tags: ["Logo & Identity", "Packaging", "Copywriting"],
  },
  {
    id: "04",
    category: "traditional",
    badge: "04 // OOH Media",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Physical Impact</span>,
    title: "Print & Outdoor",
    shortTitle: "Print & Outdoor",
    tagline: "Seen everywhere",
    icon: Newspaper,
    desc: "Billboards, newspaper ads and print that get noticed offline.",
    tags: ["Billboards", "Newspaper Ads", "Print"],
  },
  {
    id: "05",
    category: "development",
    badge: "05 // Web",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Ultra Fast</span>,
    title: "Websites & E-Commerce",
    shortTitle: "Websites & Stores",
    tagline: "Fast & built to sell",
    icon: Globe,
    desc: "Fast business sites and online stores built to convert.",
    tags: ["Business Sites", "E-Commerce", "Next.js"],
  },
  {
    id: "06",
    category: "development",
    badge: "06 // Software",
    rightBadge: <span className="text-xs text-purple-200 font-medium">End-to-End</span>,
    title: "Apps & Dashboards",
    shortTitle: "Apps & Dashboards",
    tagline: "Built for control",
    icon: LayoutDashboard,
    desc: "Admin panels, dashboards and SaaS products, from login to billing.",
    tags: ["Dashboards", "Admin Panels", "SaaS"],
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Services() {
  const dark = useIsDark();

  const { ref, inView } = useInView();

  // Theme colors matching WhyUs / About / main brand theme
  const sectionBg  = dark ? "#080808" : "#f7f3ff";
  const titleColor = dark ? "#ffffff" : "#0e0520";
  const descColor  = dark ? "rgba(255,255,255,0.70)" : "#4b5563";
  const cardBg     = dark
    ? "#0f0f0f"
    : "linear-gradient(135deg, #190247 0%, #580ca5 55%, #8027e0 100%)";
  const cardBorder = dark
    ? "1px solid rgba(128,39,224,0.18)"
    : "1px solid rgba(255,255,255,0.15)";

  return (
    <section
      id="services"
      className="relative w-full py-24 max-md:py-16 overflow-hidden"
      style={{ backgroundColor: sectionBg, color: titleColor }}
    >
      {/* Ambient Glow matching reference design */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px]"
        style={{
          background: dark
            ? "radial-gradient(circle at 50% 10%, rgba(121, 40, 224, 0.22) 0%, rgba(10, 10, 12, 0) 70%)"
            : "radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.18) 0%, rgba(243, 240, 255, 0) 70%)",
        }}
      />

      <div ref={ref} className="relative w-full max-w-[1440px] mx-auto px-20 max-lg:px-12 max-md:px-6">
        {/* Section Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Zenvio Signature Pill Badge */}
          <div className="inline-block mb-5">
            <span
              className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
              style={{
                backgroundColor: dark ? "rgba(121, 40, 224, 0.25)" : "rgba(237, 232, 255, 0.9)",
                color: dark ? "#c084fc" : "#6816ec",
                border: dark ? "1px solid rgba(168, 85, 247, 0.3)" : "1px solid #ded4ff",
                fontFamily: "var(--font-clash), sans-serif",
              }}
            >
              WHAT WE EXCEL AT
            </span>
          </div>

          {/* Headline */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            Engineered For Impact.<br className="hidden sm:block" />
            <span
              style={{
                background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built To Outperform.
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto"
            style={{ color: descColor }}
          >
            Bold creative, sharp performance — everything your brand needs to grow.
          </p>
        </div>

        {/* Services grid — 2 per row on phones, 3 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
          {servicesData.map((svc, i) => (
            <article
              key={svc.id}
              className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 flex flex-col justify-between text-white relative overflow-hidden transition-all duration-350 hover:-translate-y-1.5 group cursor-default"
              style={{
                background: cardBg,
                boxShadow: dark
                  ? "0 10px 30px -10px rgba(0,0,0,0.5)"
                  : "0 10px 30px -10px rgba(109,31,212,0.30)",
                border: cardBorder,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.5s ease ${0.04 * i}s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease`,
              }}
            >
              {/* Top accent bar matching WhyUs and About cards */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
                style={{
                  background: "linear-gradient(90deg, #4a0fa8, #6d1fd4, #8e35f0)",
                  opacity: 0.7,
                }}
              />

              {/* ── Mobile: compact icon tile ── */}
              <div className="sm:hidden relative z-10 flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${categoryAccent[svc.category]}26`,
                    border: `1px solid ${categoryAccent[svc.category]}55`,
                    color: categoryAccent[svc.category],
                  }}
                >
                  <svc.icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[15px] font-bold leading-tight text-white">{svc.shortTitle}</h3>
                  <p className="text-[11.5px] leading-snug text-purple-100/75 mt-1">{svc.tagline}</p>
                </div>
              </div>

              {/* ── Tablet / desktop: full card ── */}
              <div className="relative z-10 max-sm:hidden">
                {/* Top bar with badge & right status indicator */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-purple-200 bg-white/15 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                    {svc.badge}
                  </span>
                  <span className="max-sm:hidden">{svc.rightBadge}</span>
                </div>

                {/* Title */}
                <h3
                  className="text-[15px] leading-snug sm:text-2xl sm:leading-tight font-bold text-white mb-2 sm:mb-3 tracking-tight"
                >
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed sm:mb-6 font-normal">
                  {svc.desc}
                </p>
              </div>

              {/* Card Tags bottom row */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex-wrap gap-1.5 hidden sm:flex">
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-black/20 text-purple-100 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}