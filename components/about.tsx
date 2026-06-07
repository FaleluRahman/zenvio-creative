"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const stats = [
  {
    value: "100%",
    label: "Results-Driven",
    desc: "Every move we make is backed by data and obsessed with outcomes — not just aesthetics.",
    backIcon: "📊",
    backTitle: "Data Over Assumptions",
    backDesc: "We A/B test everything — ad copy, layouts, CTAs — until the numbers tell the truth. Gut feelings don't scale. Data does.",
  },
  {
    value: "∞",
    label: "Creative Without Limits",
    desc: "We never do templates. Every brand gets a strategy built from scratch, for them.",
    backIcon: "💡",
    backTitle: "Built From Blank Pages",
    backDesc: "Zero cookie-cutter decks. Every brief starts fresh and ends with something the market hasn't seen before.",
  },
];

/* ─── useInView ─── */
function useInView(threshold = 0.15) {
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

/* ─── BlurText ─── */
interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number; // base delay in ms before animation starts
  stagger?: number; // ms between each word
}
function BlurText({ text, className, style, spanStyle, delay = 0, stagger = 80 }: BlurTextProps & { spanStyle?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            filter: "blur(12px)",
            animation: `blurFadeIn 0.65s ease forwards`,
            animationDelay: `${delay + i * stagger}ms`,
            marginRight: i < words.length - 1 ? "0.25em" : 0,
            ...spanStyle,
          }}
        >
          {word}
        </span>
      ))}
      <style>{`
        @keyframes blurFadeIn {
          0%   { opacity: 0; filter: blur(12px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0px);  transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}

/* ─── TypeText (typewriter for paragraphs) ─── */
interface TypeTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startDelay?: number; // ms before typing begins
  speed?: number;      // ms per character
  trigger?: boolean;   // only starts when true
}
function TypeText({ text, className, style, startDelay = 0, speed = 22, trigger = true }: TypeTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [trigger, startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return (
    <p className={className} style={{ ...style, minHeight: "1em" }}>
      {displayed}
      {started && displayed.length < text.length && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "currentColor",
            marginLeft: "1px",
            verticalAlign: "text-bottom",
            animation: "cursorBlink 0.8s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </p>
  );
}

/* ─── Main Component ─── */
export default function About() {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(resolvedTheme === "dark"); }, [resolvedTheme]);

  const { ref, inView } = useInView();

  const bg          = dark ? "#080808"                : "#f7f3ff";
  const textPrimary = dark ? "#ffffff"                : "#0e0520";
  const textMuted   = dark ? "rgba(255,255,255,0.60)" : "rgba(14,5,32,0.60)";
  const tagBg       = dark ? "rgba(128,39,224,0.12)"  : "rgba(109,31,212,0.08)";
  const tagColor    = dark ? "#c8aaff"                : "#6d1fd4";
  const dividerColor= dark ? "rgba(128,39,224,0.20)"  : "rgba(109,31,212,0.15)";
  const cardBorder  = dark ? "rgba(128,39,224,0.15)"  : "rgba(109,31,212,0.12)";

  // Light mode: gradient card; dark mode: solid card


  const cardBg = dark
  ? "#0f0f0f"
  : "linear-gradient(135deg, #0d0130 0%, #3b0f8a 50%, #6d1fd4 100%)";
  const paras = [
    "You've seen brands blow up overnight and wondered — how?",
    "It wasn't luck. It wasn't a bigger budget. It was the right team, at the right time, with the right moves.",
    "Zenvio Creative is what happens when strategy gets obsessed with results — and creativity refuses to play it safe. We're built for brands that refuse to be ignored.",
  ];


  const paraDelays = [400, 400 + paras[0].length * 22 + 300, 400 + (paras[0].length + paras[1].length) * 22 + 600];

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden py-16 max-md:py-10"
      style={{ backgroundColor: bg }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, #6d1fd4 0%, transparent 65%)",
          opacity: dark ? 0.05 : 0.08,
          filter: "blur(80px)",
        }}
      />

<div className="w-full px-20 max-lg:px-12 max-md:px-6" ref={ref}>
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.22em] uppercase px-3 py-1 rounded-full"
            style={{ background: tagBg, color: tagColor, fontFamily: "var(--font-clash)" }}
          >
            What Is Zenvio Creative?
          </span>
        </div>

        <div className="grid grid-cols-2 gap-10 items-center max-lg:grid-cols-1 max-lg:gap-12">
          {/* Left: text */}
          <div>
        <h2
  className="font-bold leading-[1.06] tracking-[-0.02em] mb-6"
  style={{
    fontFamily: "var(--font-clash)",
    fontSize: "clamp(36px, 5vw, 70px)",
    color: textPrimary,
  }}
>
  {inView && (
    <>
      <BlurText text="Not Your" delay={0} stagger={90} />
      <br />
 <BlurText
        text="Average"
        delay={200}
        stagger={90}
        spanStyle={{
          backgroundImage: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      />
      <br />
      <BlurText text="Agency." delay={400} stagger={90} />
    </>
  )}
</h2>

            <div
              className="w-12 h-[3px] rounded mb-7"
              style={{
                background: "linear-gradient(90deg, #6d1fd4, #8e35f0)",
                opacity: inView ? 1 : 0,
                transition: "opacity 0.6s ease 0.25s",
              }}
            />

            {/* Paragraphs with TypeText */}
            {paras.map((text, i) => (
              <TypeText
                key={i}
                text={text}
                trigger={inView}
                startDelay={paraDelays[i]}
                speed={22}
                className={i < paras.length - 1 ? "mb-5" : ""}
                style={{
                  fontSize: "17px",
                  lineHeight: "1.75",
                  color: textMuted,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              />
            ))}
          </div>

{/* Right: stat cards */}
<div className="flex flex-col gap-5">
  {stats.map((s, i) => (
    <div
      key={s.label}
      className="flip-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(40px)",
        transition: `opacity 0.7s ease ${0.2 + i * 0.15}s, transform 0.7s ease ${0.2 + i * 0.15}s`,
      }}
    >
      <div className="flip-inner">

        {/* ── FRONT ── */}
        <div
          className="flip-front rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: dark
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(109,31,212,0.08)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #4a0fa8, #8e35f0)" }}
          />
          <span
            className="font-bold leading-none block mb-2"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(40px, 6vw, 64px)",
              backgroundImage: dark
                ? "linear-gradient(135deg, #c084fc, #e9d5ff)"
                : "linear-gradient(135deg, #e0c4ff, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {s.value}
          </span>
          <div
            className="font-bold tracking-[0.12em] uppercase mb-3 text-[11px]"
            style={{ fontFamily: "var(--font-clash)", color: dark ? tagColor : "#d4aaff" }}
          >
            {s.label}
          </div>
          <div
            className="h-px w-full mb-4"
            style={{ background: dark ? dividerColor : "rgba(255,255,255,0.15)" }}
          />
          <p
            className="text-[14px] leading-[1.65] m-0"
            style={{
              color: dark ? textMuted : "rgba(255,255,255,0.75)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {s.desc}
          </p>
        </div>

   {/* ── BACK ── */}
<div
  className="flip-back rounded-2xl relative overflow-hidden flex flex-col justify-center"
  style={{
    background: cardBg,   // ← use this instead of the inline gradient
    border: `1px solid ${cardBorder}`,
    boxShadow: dark
      ? "0 8px 32px rgba(109,31,212,0.35)"   // ← purple-tinted shadow in dark mode
      : "0 8px 32px rgba(109,31,212,0.08)",
    padding: "32px",
  }}
>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #8e35f0, #c084fc)" }}
          />
          {/* Subtle glow circle */}
          <div
            className="absolute bottom-[-40px] right-[-40px] w-[140px] h-[140px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(142,53,240,0.35) 0%, transparent 70%)",
            }}
          />
          <div
            className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3"
            style={{ color: "#c8aaff", fontFamily: "var(--font-clash)" }}
          >
            Behind the number
          </div>
          <div
            className="text-[20px] font-bold mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-clash)",
              color: "#ffffff",
            }}
          >
            {s.backTitle}
          </div>
          <div
            className="h-px w-10 mb-4"
            style={{ background: "rgba(200,170,255,0.4)" }}
          />
          <p
            className="text-[14px] leading-[1.7] m-0"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {s.backDesc}
          </p>
        </div>

      </div>
    </div>
  ))}
</div>
        </div>
      </div>
    </section>
  );
}