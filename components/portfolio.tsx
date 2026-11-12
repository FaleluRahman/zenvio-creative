"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Portfolio Data ──────────────────────────────────────────── */
type Category = "packaging" | "product-ads" | "social-media" | "websites";

interface DesignWork {
  kind: "design";
  id: string;
  category: Exclude<Category, "websites">;
  title: string;
  client: string;
  src: string;
}

interface WebsiteWork {
  kind: "website";
  id: string;
  category: "websites";
  title: string;
  client: string;
  url: string;
  image: string; // site's og:image, saved locally
  desc: string;
  tags: string[];
}

type Work = DesignWork | WebsiteWork;

const IMG = "/images/designworks";

const designWorks: DesignWork[] = [
  // ── Packaging Design ──
  { kind: "design", id: "almond", category: "packaging", title: "Premium Almond Packaging", client: "Haybah Dry Fruits", src: `${IMG}/haybah-almond-packaging.jpg` },
  { kind: "design", id: "pistachio", category: "packaging", title: "Premium Pistachios Packaging", client: "Haybah Dry Fruits", src: `${IMG}/haybah-pistachio-packaging.jpg` },
  { kind: "design", id: "cashew", category: "packaging", title: "Premium Cashew Packaging", client: "Haybah Dry Fruits", src: `${IMG}/haybah-cashew-packaging.jpg` },
  { kind: "design", id: "figs", category: "packaging", title: "Premium Dried Figs Packaging", client: "Haybah Dry Fruits", src: `${IMG}/haybah-figs-packaging.jpg` },
  { kind: "design", id: "kiwi", category: "packaging", title: "Dried Kiwi Healthy Snack", client: "Haybah Dry Fruits", src: `${IMG}/haybah-kiwi-packaging.jpg` },
  { kind: "design", id: "grapes", category: "packaging", title: "Black Dry Grapes Packaging", client: "Haybah Dry Fruits", src: `${IMG}/haybah-black-grapes-packaging.jpg` },

  // ── Product Advertising ──
  { kind: "design", id: "ps5", category: "product-ads", title: "PS5 Rental Advertisement", client: "Lobby Gaming", src: `${IMG}/lobby-ps5-rental-ad.jpg` },
  { kind: "design", id: "osm", category: "product-ads", title: "Onam Offer – Electric Auto", client: "OSM", src: `${IMG}/osm-electric-auto-onam.jpg` },
  { kind: "design", id: "floor-cleaner", category: "product-ads", title: "Buy 1 Get 1 Floor Cleaner", client: "Product Advertisement", src: `${IMG}/floor-cleaner-bogo-ad.jpg` },
  { kind: "design", id: "detergent", category: "product-ads", title: "Liquid Detergent Poster", client: "Product Advertisement", src: `${IMG}/liquid-detergent-ad.jpg` },

  // ── Social Media Campaigns ──
  { kind: "design", id: "najath", category: "social-media", title: "A Healthy Smile, A Brighter Tomorrow", client: "Najath Dental Clinic", src: `${IMG}/najath-dental-healthy-smile.jpg` },
  { kind: "design", id: "abha-booked", category: "social-media", title: "Fully Booked Travel Campaign", client: "Abha Tour", src: `${IMG}/abha-tour-fully-booked.jpg` },
  { kind: "design", id: "abha-poster", category: "social-media", title: "Premium Travel Poster", client: "Abha Tourism", src: `${IMG}/abha-tourism-travel-poster.jpg` },
  { kind: "design", id: "eid", category: "social-media", title: "Luxury Eid Campaign", client: "Aviation Brand", src: `${IMG}/aviation-eid-campaign.jpg` },
  { kind: "design", id: "teachers-day", category: "social-media", title: "Happy Teacher's Day", client: "Swadish Biryani Rice", src: `${IMG}/swadish-biryani-teachers-day.jpg` },
  { kind: "design", id: "nurses-day", category: "social-media", title: "International Nurses Day", client: "Dream to Go", src: `${IMG}/dream-to-go-nurses-day.jpg` },
];

const websiteWorks: WebsiteWork[] = [
  {
    kind: "website",
    id: "ssf",
    category: "websites",
    title: "SSF India",
    client: "Sunni Students' Federation",
    url: "https://www.nationalssf.org",
    image: "/images/websites/ssf-india.png",
    desc: "National platform for a million-member student movement — departments, news, events like Sahityotsav, and a map of units across India.",
    tags: ["Organisation", "News & Events", "Unit Map"],
  },
  {
    kind: "website",
    id: "lobby",
    category: "websites",
    title: "Lobby Gaming",
    client: "Console Rentals · Kerala",
    url: "https://www.lobbygamepartner.com",
    image: "/images/websites/lobby-gaming.png",
    desc: "Rental storefront for PS5, PS4 & Xbox setups delivered to homes, hostels and events — with a 400+ game library showcase.",
    tags: ["Business", "Rental Booking", "Gaming"],
  },
  {
    kind: "website",
    id: "najath-web",
    category: "websites",
    title: "Najath Dental Clinic",
    client: "Dental Care · Kannur",
    url: "https://www.najathdentalclinic.com",
    image: "/images/websites/najath-dental.jpg",
    desc: "Clinic website presenting general, cosmetic, orthodontic & implant treatments with online appointment booking.",
    tags: ["Healthcare", "Online Booking", "Local SEO"],
  },
  {
    kind: "website",
    id: "zaithoon",
    category: "websites",
    title: "Zaithoon Academy",
    client: "Civil Service Coaching · Thiruvananthapuram",
    url: "https://www.zaithoonacademy.in",
    image: "/images/websites/zaithoon-academy.png",
    desc: "Free UPSC coaching initiative — programmes, mentorship, guest lectures from IAS/IPS officers and scholarship details.",
    tags: ["Education", "Admissions", "Scholarships"],
  },
];

const allWorks: Work[] = [...websiteWorks, ...designWorks];

const filterTabs: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "websites", label: "Websites" },
  { id: "packaging", label: "Packaging Design" },
  { id: "product-ads", label: "Product Ads" },
  { id: "social-media", label: "Social Media Campaigns" },
];

const categoryLabel: Record<Category, string> = {
  websites: "Website",
  packaging: "Packaging Design",
  "product-ads": "Product Ad",
  "social-media": "Social Media",
};

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

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/* ─── Component ──────────────────────────────────────────────── */
export default function Portfolio() {
  const { resolvedTheme } = useTheme();
  // Hydration-safe: false on server, true after mount
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";

  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState<"all" | Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "all"
    ? allWorks
    : allWorks.filter((w) => w.category === activeFilter);

  const filteredDesigns = filtered.filter((w): w is DesignWork => w.kind === "design");
  const filteredSites = filtered.filter((w): w is WebsiteWork => w.kind === "website");

  const countFor = (id: "all" | Category) =>
    id === "all" ? allWorks.length : allWorks.filter((w) => w.category === id).length;

  /* Lightbox keyboard + scroll lock */
  const designCount = filteredDesigns.length;
  const close = () => setLightbox(null);
  const step = (dir: 1 | -1) =>
    setLightbox((i) => (i === null ? i : (i + dir + designCount) % designCount));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (e.key === "Escape") setLightbox(null);
      else if (dir) setLightbox((i) => (i === null ? i : (i + dir + designCount) % designCount));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, designCount]);

  // Theme colors matching Services / WhyUs
  const sectionBg  = dark ? "#0b0b0b" : "#ffffff";
  const titleColor = dark ? "#ffffff" : "#0e0520";
  const descColor  = dark ? "rgba(255,255,255,0.70)" : "#4b5563";
  const cardBg     = dark
    ? "#0f0f0f"
    : "linear-gradient(135deg, #190247 0%, #580ca5 55%, #8027e0 100%)";
  const cardBorder = dark
    ? "1px solid rgba(128,39,224,0.18)"
    : "1px solid rgba(255,255,255,0.15)";

  const active = lightbox !== null ? filteredDesigns[lightbox] : null;

  return (
    <section
      id="portfolio"
      className="relative w-full py-24 max-md:py-16 overflow-hidden"
      style={{ backgroundColor: sectionBg, color: titleColor }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px]"
        style={{
          background: dark
            ? "radial-gradient(circle at 50% 10%, rgba(121, 40, 224, 0.18) 0%, rgba(10, 10, 12, 0) 70%)"
            : "radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      <div ref={ref} className="relative w-full px-20 max-lg:px-12 max-md:px-6">
        {/* Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
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
              OUR PORTFOLIO
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-clash), sans-serif" }}
          >
            Work That Speaks.<br className="hidden sm:block" />
            <span
              style={{
                background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Brands We&apos;ve Built.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto"
            style={{ color: descColor }}
          >
            From websites that convert to packaging that sells off the shelf — a selection of recent projects across web, packaging, advertising and social media.
          </p>
        </div>

        {/* Filter pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 md:mb-16"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.15s" }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                aria-pressed={isActive}
                className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "var(--font-clash), sans-serif",
                  backgroundColor: isActive ? "#6816ec" : dark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
                  color: isActive ? "#ffffff" : dark ? "rgba(255, 255, 255, 0.8)" : "#374151",
                  border: isActive
                    ? "1px solid #6816ec"
                    : dark
                    ? "1px solid rgba(255, 255, 255, 0.12)"
                    : "1px solid #e5e7eb",
                  boxShadow: isActive ? "0 4px 14px rgba(104, 22, 236, 0.35)" : "none",
                }}
              >
                {tab.label} <span className="opacity-60">({countFor(tab.id)})</span>
              </button>
            );
          })}
        </div>

        {/* Websites */}
        {filteredSites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 mb-6 lg:mb-7">
            {filteredSites.map((site, i) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl overflow-hidden flex flex-col text-white transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: cardBg,
                  border: cardBorder,
                  boxShadow: dark
                    ? "0 10px 30px -10px rgba(0,0,0,0.5)"
                    : "0 10px 30px -10px rgba(109,31,212,0.30)",
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.05 * i}s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,
                }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-black/25 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 flex-1 truncate text-[11px] text-purple-100/80 bg-white/10 rounded-md px-3 py-1">
                    {hostOf(site.url)}
                  </span>
                </div>

                {/* OG preview */}
                <div className="relative aspect-[1200/630] overflow-hidden bg-black/30">
                  <Image
                    src={site.image}
                    alt={`${site.title} website preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-200 bg-white/15 px-3 py-1 rounded-full">
                        {categoryLabel[site.category]}
                      </span>
                      <h3
                        className="text-2xl font-bold mt-4 tracking-tight"
                        style={{ fontFamily: "var(--font-clash), sans-serif" }}
                      >
                        {site.title}
                      </h3>
                      <p className="text-xs text-purple-200/80 mt-1">{site.client}</p>
                    </div>
                    <span className="shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white/25">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <p className="text-purple-100/90 text-sm leading-relaxed mb-6">{site.desc}</p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {site.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-medium bg-black/20 text-purple-100 px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Design works */}
        {filteredDesigns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredDesigns.map((work, i) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden text-left cursor-zoom-in"
                style={{
                  border: cardBorder,
                  boxShadow: dark
                    ? "0 10px 30px -10px rgba(0,0,0,0.5)"
                    : "0 10px 30px -10px rgba(109,31,212,0.25)",
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.5s ease ${0.03 * i}s`,
                }}
                aria-label={`View ${work.title} for ${work.client}`}
              >
                <Image
                  src={work.src}
                  alt={`${work.title} – ${work.client}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#190247]/95 via-[#190247]/30 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 text-white md:translate-y-3 md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-purple-100 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
                    {categoryLabel[work.category]}
                  </span>
                  <h3
                    className="text-sm md:text-lg font-bold leading-tight"
                    style={{ fontFamily: "var(--font-clash), sans-serif" }}
                  >
                    {work.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-purple-200/90 mt-0.5">{work.client}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          {filteredDesigns.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 md:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 md:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <figure className="flex flex-col items-center max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              key={active.src}
              src={active.src}
              alt={`${active.title} – ${active.client}`}
              width={736}
              height={920}
              sizes="(max-width: 768px) 90vw, 600px"
              className="w-auto h-auto max-h-[78vh] max-w-[88vw] rounded-2xl object-contain"
            />
            <figcaption className="text-center text-white mt-4">
              <p className="font-bold" style={{ fontFamily: "var(--font-clash), sans-serif" }}>{active.title}</p>
              <p className="text-sm text-purple-200/80">{active.client} · {categoryLabel[active.category]}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
