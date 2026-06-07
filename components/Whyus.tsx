"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import SpotlightCard from "./reactbits/card";
// import SpotlightCard from './SpotlightCard';

const reasons = [
  {
    title: "We Treat Your Brand Like Our Own",
    desc: "No inbox-and-forget approach here. We're invested in your growth because your success is how we measure ours.",
  },
  {
    title: "Zero Cookie-Cutter Strategies",
    desc: "Everything is built for you — from scratch. Your competitors get their own version. You get yours.",
  },
  {
    title: "We Move Fast, Think Creatively",
    desc: "Trends don't wait. Neither do we. We're always ahead of the curve so your brand never falls behind.",
  },
  {
    title: "Results, Not Just Vibes",
    desc: "Pretty content that doesn't convert is just expensive decoration. We obsess over numbers that actually matter.",
  },
  {
    title: "Always In Your Corner",
    desc: "One team, full transparency, no surprises. You'll always know what we're doing and why it's working.",
  },
  {
    title: "Creative That Actually Sells",
    desc: "We bridge the gap between art and commerce. Every idea is beautiful — and built to perform.",
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

export default function WhyUs() {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(resolvedTheme === "dark"); }, [resolvedTheme]);

  const { ref, inView } = useInView();

  const bg          = dark ? "#080808"                 : "#f7f3ff";
  const textPrimary = dark ? "#ffffff"                 : "#0e0520";
  const textMuted   = dark ? "rgba(255,255,255,0.58)"  : "rgba(255,255,255,0.72)";
  const cardBg      = dark ? "#0f0f0f"                 : "linear-gradient(135deg, #190247 0%, #580ca5 55%, #8027e0 100%)";
  const tagBg       = dark ? "rgba(128,39,224,0.12)"   : "rgba(109,31,212,0.08)";
  const tagColor    = dark ? "#c8aaff"                 : "#6d1fd4";
  const cardTitle   = "#ffffff"; // always white — cards have dark gradient bg
  const spotlightColor = dark
    ? "rgba(142, 53, 240, 0.18)"
    : "rgba(255, 255, 255, 0.15)";

  /* CTA banner */
  const bannerBg = dark
    ? "linear-gradient(135deg, #1a0640 0%, #2d0880 50%, #1a0640 100%)"
    : "linear-gradient(135deg, #3b0f8a 0%, #6d1fd4 50%, #8e35f0 100%)";

  return (
    <section
      id="why"
      className="relative w-full overflow-hidden py-32 max-md:py-20"
      style={{ backgroundColor: bg }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
        style={{ background: "radial-gradient(ellipse, #6d1fd4 0%, transparent 70%)", opacity: dark ? 0.06 : 0.10, filter: "blur(80px)" }} />

<div className="w-full px-20 max-lg:px-12 max-md:px-6" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16 max-w-[700px] mx-auto"
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
            Why Choose Us
          </span>
          <h2
            className="font-bold leading-[1.06] tracking-[-0.02em] mb-5"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(32px, 4.5vw, 62px)",
              color: textPrimary,
            }}
          >
            Because Good Enough
            <br />
            <span style={{
              background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Was Never The Goal.
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5 mb-20 max-lg:grid-cols-2 max-md:grid-cols-1">
          {reasons.map((r, i) => (
            <SpotlightCard
              key={r.title}
              spotlightColor={spotlightColor}
              className="relative"
style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
                transition: `opacity 0.65s ease ${0.08 * i}s, transform 0.65s ease ${0.08 * i}s`,
                background: cardBg,
                borderColor: dark ? "rgba(128,39,224,0.14)" : "rgba(109,31,212,0.10)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = "0.82";
                el.style.transform = "translateY(-4px) scale(1.02)";
                el.style.transition = "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease";
                el.style.boxShadow = dark ? "0 16px 48px rgba(128,39,224,0.30)" : "0 16px 48px rgba(128,39,224,0.45)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = "1";
                el.style.transform = "translateY(0) scale(1)";
                el.style.transition = "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease";
                el.style.boxShadow = "none";
              }}
            >
              {/* Top gradient bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, #4a0fa8, #8e35f0)", opacity: 0.5 }}
              />

              <h3
                className="font-bold mb-3 leading-tight"
                style={{
                  fontFamily: "var(--font-clash)",
                  fontSize: "clamp(15px, 1.5vw, 17px)",
                  color: cardTitle,
                  letterSpacing: "-0.01em",
                }}
              >
                {r.title}
              </h3>

              <p
                className="text-[13.5px] leading-[1.70] m-0"
                style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {r.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="relative rounded-3xl overflow-hidden px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-8 max-md:text-center max-md:px-8 max-md:py-10"
          style={{
            background: bannerBg,
            boxShadow: "0 24px 80px rgba(109,31,212,0.40)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s",
          }}
        >
          {/* Internal glow */}
          <div className="pointer-events-none absolute top-0 left-0 w-full h-full"
            style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />

          <div className="relative z-10">
            <p
              className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.60)", fontFamily: "var(--font-clash)" }}
            >
              Your brand deserves more
            </p>
            <h3
              className="font-bold leading-[1.1] tracking-[-0.02em] m-0"
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "clamp(24px, 3vw, 40px)",
                color: "#ffffff",
              }}
            >
              Most brands lose customers
              <br className="max-md:hidden" />
              every single day.
            </h3>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <p
              className="text-[15px] leading-[1.65] mb-6 max-w-[340px]"
              style={{ color: "rgba(255,255,255,0.72)", fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Not because their product is bad, but because nobody knows they exist.
              That changes today.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-semibold tracking-wide no-underline transition-all duration-300"
              style={{
                fontFamily: "var(--font-clash)",
                fontSize: "13px",
                letterSpacing: "0.07em",
                padding: "13px 28px",
                background: "#ffffff",
                color: "#4a0fa8",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.30)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
              }}
            >
              Start The Conversation
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}