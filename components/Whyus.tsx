"use client";

import { useIsDark } from "@/lib/use-is-dark";
import { useEffect, useState, useRef } from "react";
import SpotlightCard from "./reactbits/card";

const reasons = [
  {
    title: "We Treat Your Brand Like Our Own",
    desc: "Your growth is how we measure ours.",
  },
  {
    title: "Zero Cookie-Cutter Strategies",
    desc: "Every plan built from scratch, for you.",
  },
  {
    title: "We Move Fast, Think Creatively",
    desc: "Ahead of trends, so you never fall behind.",
  },
  {
    title: "Results, Not Just Vibes",
    desc: "We chase numbers that matter, not likes.",
  },
  {
    title: "Always In Your Corner",
    desc: "One team, full transparency, no surprises.",
  },
  {
    title: "Creative That Actually Sells",
    desc: "Beautiful ideas, built to perform.",
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
  const dark = useIsDark();

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

<div className="relative w-full max-w-[1440px] mx-auto px-20 max-lg:px-12 max-md:px-6" ref={ref}>
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-20 max-md:mb-14">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
                transition: `opacity 0.65s ease ${0.08 * i}s, transform 0.65s ease ${0.08 * i}s`,
              }}
            >
              <SpotlightCard
                spotlightColor={spotlightColor}
                className={`relative h-full max-sm:p-4 max-sm:rounded-2xl transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 ${
                  dark
                    ? "hover:shadow-[0_16px_48px_rgba(128,39,224,0.30)]"
                    : "hover:shadow-[0_16px_48px_rgba(128,39,224,0.45)]"
                }`}
                style={{
                  background: cardBg,
                  borderColor: dark ? "rgba(128,39,224,0.14)" : "rgba(109,31,212,0.10)",
                }}
              >
                {/* Top gradient bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
                  style={{ background: "linear-gradient(90deg, #4a0fa8, #8e35f0)", opacity: 0.5 }}
                />

                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl mb-3 sm:mb-5 text-[10px] sm:text-[12px] font-bold"
                  style={{
                    fontFamily: "var(--font-clash)",
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: dark ? "#c8aaff" : "#ffffff",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="font-bold mb-2 sm:mb-3 leading-tight"
                  style={{
                    fontSize: "clamp(14px, 1.6vw, 20px)",
                    color: cardTitle,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {r.title}
                </h3>

                <p
                  className="text-[12px] sm:text-[14px] leading-[1.6] sm:leading-[1.70] m-0"
                  style={{ color: textMuted }}
                >
                  {r.desc}
                </p>
              </SpotlightCard>
            </div>
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
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Not from bad products — from being unseen. Let&apos;s fix that.
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