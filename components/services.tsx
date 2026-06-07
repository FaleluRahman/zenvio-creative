"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const services = [
  {
    number: "01",
    title: "Social Media Management",
    desc: "We run your pages like they're our own — consistent, creative, and always on trend. From content calendars to community management, we handle it all.",
    tags: ["Instagram", "LinkedIn", "Facebook"],
    accent: "#6d1fd4",
  },
  {
    number: "02",
    title: "Paid Advertising",
    desc: "Every dollar you spend works harder. We build campaigns that chase results, not just reach — with precise targeting, sharp creatives, and relentless optimization.",
    tags: ["Meta Ads", "Google Ads", "Retargeting"],
    accent: "#4a0fa8",
  },
  {
    number: "03",
    title: "Branding & Design",
    desc: "Your visuals tell your story before you say a word. We create brand identities that are unforgettable — logos, palettes, typography, and everything in between.",
    tags: ["Logo Design", "Brand Kit", "Visual Identity"],
    accent: "#8e35f0",
  },
  {
    number: "04",
    title: "Content Strategy",
    desc: "No random posting. Every piece of content has a purpose, a plan, and a payoff. We build content ecosystems that attract, nurture, and convert.",
    tags: ["Reels", "Copywriting", "SEO Content"],
    accent: "#5814c0",
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const bg          = dark ? "#0a0a0a"                : "#f0ecfa";
  const textPrimary = dark ? "#ffffff"                : "#0e0520";
  const textMuted   = dark ? "rgba(255,255,255,0.58)" : "rgba(14,5,32,0.58)";
  const cardBg      = dark ? "#0d0d0d"                : "#ffffff";
  const cardBorder  = dark ? "rgba(128,39,224,0.15)"  : "rgba(109,31,212,0.12)";
  const tagBg       = dark ? "rgba(128,39,224,0.12)"  : "rgba(109,31,212,0.07)";
  const tagColor    = dark ? "#c8aaff"                : "#6d1fd4";

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden py-32 max-md:py-20"
      style={{ backgroundColor: bg }}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute -top-20 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, #4a0fa8 0%, transparent 70%)", opacity: dark ? 0.07 : 0.12, filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, #8e35f0 0%, transparent 70%)", opacity: dark ? 0.05 : 0.09, filter: "blur(80px)" }} />

<div className="w-full px-20 max-lg:px-12 max-md:px-6" ref={ref}>
        {/* Header */}
        <div className="mb-16 max-w-[640px]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span
            className="inline-block text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full mb-5"
            style={{ background: tagBg, color: tagColor, fontFamily: "var(--font-clash)" }}
          >
            What We Do
          </span>
          <h2
            className="font-bold leading-[1.06] tracking-[-0.02em] mb-5"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(34px, 4.5vw, 62px)",
              color: textPrimary,
            }}
          >
            WE MAKE BRANDS
            <br />
            <span style={{
              background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              HIT DIFFERENT.
            </span>
          </h2>
          <p className="text-[16px] leading-[1.70]" style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            One agency. Everything your brand needs to dominate.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          {services.map((svc, i) => {
            const isHovered = hoveredCard === i;
            return (
              <div
                key={svc.number}
                className="relative rounded-2xl p-8 overflow-hidden cursor-default group"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: cardBg,
                  border: `1px solid ${isHovered ? "rgba(142,53,240,0.50)" : cardBorder}`,
                  boxShadow: isHovered
                    ? dark
                      ? "0 16px 48px rgba(128,39,224,0.22), 0 2px 12px rgba(0,0,0,0.5)"
                      : "0 16px 48px rgba(109,31,212,0.18), 0 4px 16px rgba(109,31,212,0.10)"
                    : "none",
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? isHovered ? "translateY(-4px)" : "translateY(0)"
                    : "translateY(32px)",
                  transition: `opacity 0.7s ease ${0.1 + i * 0.08}s, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease`,
                }}
              >
                {/* Accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${svc.accent}, #8e35f0)`,
                    opacity: isHovered ? 1 : 0.4,
                  }}
                />

                {/* Number */}
                <div
                  className="font-bold mb-6 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-clash)",
                    fontSize: "clamp(40px, 4.5vw, 56px)",
                    lineHeight: 1,
                    background: isHovered
                      ? `linear-gradient(135deg, ${svc.accent}, #8e35f0)`
                      : dark ? "rgba(255,255,255,0.08)" : "rgba(14,5,32,0.07)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {svc.number}
                </div>

                {/* Title */}
                <h3
                  className="font-bold mb-3 leading-tight"
                  style={{
                    fontFamily: "var(--font-clash)",
                    fontSize: "clamp(18px, 2vw, 22px)",
                    color: textPrimary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {svc.title}
                </h3>

                {/* Desc */}
                <p
                  className="text-[14px] leading-[1.70] mb-6"
                  style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  {svc.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded-full"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${svc.accent}22, #8e35f022)`
                          : tagBg,
                        color: isHovered ? (dark ? "#d4b8ff" : svc.accent) : tagColor,
                        border: `1px solid ${isHovered ? svc.accent + "44" : "transparent"}`,
                        fontFamily: "var(--font-clash)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}