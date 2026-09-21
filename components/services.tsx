"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

/* ─── Services Data ───────────────────────────────────────────── */
interface ServiceItem {
  id: string;
  category: "digital-marketing" | "branding" | "traditional" | "development";
  categoryName: string;
  badge: string;
  rightBadge?: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
}

const servicesData: ServiceItem[] = [
  // ── Digital Marketing ──
  {
    id: "01",
    category: "digital-marketing",
    categoryName: "Digital Marketing",
    badge: "01 // Growth",
    rightBadge: (
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" aria-hidden="true" />
    ),
    title: "Social Media Management",
    desc: "Full-funnel organic community architecture, cultural relevancy, and active brand presence that turns casual scrollers into vocal brand evangelists.",
    tags: ["Instagram", "TikTok", "LinkedIn", "Community"],
  },
  {
    id: "02",
    category: "digital-marketing",
    categoryName: "Digital Marketing",
    badge: "02 // Performance",
    rightBadge: <span className="text-xs text-purple-200 font-semibold tracking-wider uppercase">ROAS Driven</span>,
    title: "Paid Advertising (Performance Ads)",
    desc: "Ruthlessly tested creatives combined with algorithmic bidding on Meta, Google, and TikTok to systematically slash customer acquisition costs and scale spend profitably.",
    tags: ["Meta Ads", "Google Search", "YouTube", "Retargeting"],
  },
  {
    id: "03",
    category: "digital-marketing",
    categoryName: "Digital Marketing",
    badge: "03 // Visibility",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Rank #1</span>,
    title: "SEO & Content Strategy",
    desc: "High-intent organic search dominance. We build content engines that compound monthly organic traffic, answer buying queries, and build organic pipeline predictability.",
    tags: ["Technical SEO", "Keyword Clusters", "Authority Backlinks"],
  },
  {
    id: "04",
    category: "digital-marketing",
    categoryName: "Digital Marketing",
    badge: "04 // Retention",
    rightBadge: <span className="text-xs text-purple-200 font-medium">LTV Acceleration</span>,
    title: "Email & WhatsApp Marketing",
    desc: "Behavior-triggered automation flows, conversational WhatsApp CRM broadcasts, and VIP retention mechanics designed to maximize repeat purchase rates and customer lifetime value.",
    tags: ["Klaviyo / CRM", "WhatsApp API", "Drip Funnels"],
  },

  // ── Branding & Creative ──
  {
    id: "05",
    category: "branding",
    categoryName: "Branding & Creative",
    badge: "05 // Identity",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Iconic Design</span>,
    title: "Branding & Visual Identity",
    desc: "Comprehensive brand DNA systems: bespoke logos, distinctive color theory, typography architectures, and uncompromising design guidelines that refuse to look like a template.",
    tags: ["Brand Guidelines", "Logomarks", "Typography System"],
  },
  {
    id: "06",
    category: "branding",
    categoryName: "Branding & Creative",
    badge: "06 // Production",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Hook-Driven</span>,
    title: "Video & Reels Production",
    desc: "Stop-the-scroll short-form cinematography, viral vertical hooks, 3D motion graphics, and commercial-grade brand films crafted to hold attention in the first 3 seconds.",
    tags: ["9:16 Shorts", "Motion Graphics", "Ad Creatives"],
  },
  {
    id: "07",
    category: "branding",
    categoryName: "Branding & Creative",
    badge: "07 // Messaging",
    rightBadge: <span className="text-xs text-purple-200 font-medium">High Conversion</span>,
    title: "Copywriting & Brand Voice",
    desc: "Persuasive messaging that bridges pure psychology and raw commercial salesmanship. Landing pages, hooks, taglines, and value propositions that make saying \"no\" impossible.",
    tags: ["Direct Response", "Tone & Voice", "Sales Copy"],
  },

  // ── Traditional Media ──
  {
    id: "08",
    category: "traditional",
    categoryName: "Traditional Media",
    badge: "08 // OOH Media",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Physical Impact</span>,
    title: "Print & Outdoor Advertising",
    desc: "High-visibility urban billboards, metro placements, newspaper feature layouts, trade collateral, and large-scale activations with memorable physical presence.",
    tags: ["Billboards (OOH)", "Newspaper Ads", "Packaging"],
  },

  // ── Web & Engineering ──
  {
    id: "09",
    category: "development",
    categoryName: "Web & Engineering",
    badge: "09 // Web Presence",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Ultra Fast</span>,
    title: "Business & Portfolio Websites",
    desc: "Bespoke corporate websites engineered with modern web standards, micro-interactions, responsive precision, and zero template clunkiness for immediate authority.",
    tags: ["Next.js / Tailwind", "CMS Integration", "Micro-interactions"],
  },
  {
    id: "10",
    category: "development",
    categoryName: "Web & Engineering",
    badge: "10 // Commerce",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Conversion-First</span>,
    title: "E-Commerce Stores",
    desc: "High-converting custom Shopify and headless storefronts with instant 1-click checkouts, smart cart upsells, and sub-second load speeds designed to maximize checkout completions.",
    tags: ["Shopify Plus", "Headless Commerce", "Cart Funnels"],
  },
  {
    id: "11",
    category: "development",
    categoryName: "Web & Engineering",
    badge: "11 // Internal Tools",
    rightBadge: <span className="text-xs text-purple-200 font-medium">Scalable UX</span>,
    title: "Custom Panels & Dashboards",
    desc: "Tailored administrative consoles, inventory trackers, and internal operational analytics dashboards built to give executive teams real-time clarity and operational control.",
    tags: ["Admin Portals", "Real-time Analytics", "Role Security"],
  },
  {
    id: "12",
    category: "development",
    categoryName: "Web & Engineering",
    badge: "12 // Software",
    rightBadge: <span className="text-xs text-purple-200 font-medium">End-to-End</span>,
    title: "SaaS & Web Applications",
    desc: "Full-lifecycle cloud SaaS platforms from architecture, user authentication, and multi-tenant billing pipelines to smooth front-end user interfaces ready for seed and series stages.",
    tags: ["Full-Stack SaaS", "Stripe Billing", "REST / GraphQL"],
  },
];

/* ─── Filter Categories ───────────────────────────────────────── */
const filterTabs = [
  { id: "all", label: "All Capabilities (12)" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "branding", label: "Branding & Creative" },
  { id: "traditional", label: "Traditional & Out-Of-Home" },
  { id: "development", label: "Web & Engineering" },
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
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(resolvedTheme === "dark"); }, [resolvedTheme]);

  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? servicesData
    : servicesData.filter((s) => s.category === activeFilter);

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
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10"
        style={{
          background: dark
            ? "radial-gradient(circle at 50% 10%, rgba(121, 40, 224, 0.22) 0%, rgba(10, 10, 12, 0) 70%)"
            : "radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.18) 0%, rgba(243, 240, 255, 0) 70%)",
        }}
      />

      <div ref={ref} className="w-full px-20 max-lg:px-12 max-md:px-6">
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
            style={{ fontFamily: "var(--font-clash), sans-serif" }}
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
            We eliminate the guesswork between boundary-pushing creative and razor-sharp performance. Every capability is deployed to build authority, scale customer lifetime value, and dominate your category.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "var(--font-clash), sans-serif",
                  backgroundColor: isActive
                    ? "#6816ec"
                    : dark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "#ffffff",
                  color: isActive ? "#ffffff" : dark ? "rgba(255, 255, 255, 0.8)" : "#374151",
                  border: isActive
                    ? "1px solid #6816ec"
                    : dark
                    ? "1px solid rgba(255, 255, 255, 0.12)"
                    : "1px solid #e5e7eb",
                  boxShadow: isActive ? "0 4px 14px rgba(104, 22, 236, 0.35)" : "none",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 12 Services Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filtered.map((svc, i) => (
            <article
              key={svc.id}
              className="rounded-3xl p-7 md:p-8 flex flex-col justify-between text-white relative overflow-hidden transition-all duration-350 hover:-translate-y-1.5 group cursor-default"
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

              <div className="relative z-10">
                {/* Top bar with badge & right status indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200 bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                    {svc.badge}
                  </span>
                  {svc.rightBadge}
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-clash), sans-serif" }}
                >
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-purple-100/90 text-sm leading-relaxed mb-6 font-normal">
                  {svc.desc}
                </p>
              </div>

              {/* Card Tags bottom row */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
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