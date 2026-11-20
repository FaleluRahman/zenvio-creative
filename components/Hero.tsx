"use client";

import { useIsDark } from "@/lib/use-is-dark";
import { useEffect, useState, useRef, useMemo, useId } from "react";
import BlurText from "./reactbits/motion";

/* ── TextType Component ── */
type TextTypeProps = {
  texts?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
};

const TextType = ({
  texts = [],
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "_",
  cursorBlinkDuration = 0.5,
}: TextTypeProps) => {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");
  const [textIndex, setTextIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCursorVisible((v) => !v),
      cursorBlinkDuration * 1000
    );
    return () => clearInterval(interval);
  }, [cursorBlinkDuration]);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[textIndex];
    if (phase === "typing") {
      if (charIndexRef.current <= current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndexRef.current));
          charIndexRef.current++;
        }, typingSpeed);
        return () => clearTimeout(t);
      } else {
        setPhase("pausing");
      }
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), pauseDuration);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (charIndexRef.current > 0) {
        const t = setTimeout(() => {
          charIndexRef.current--;
          setDisplayed(current.slice(0, charIndexRef.current));
        }, deletingSpeed);
        return () => clearTimeout(t);
      } else {
        setTextIndex((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [phase, displayed, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span>
      <span className="bg-gradient-to-r from-[#3b0f8a] via-[#6d1fd4] to-[#8e35f0] bg-clip-text text-transparent">
        {displayed}
      </span>
      {showCursor && (
        <span
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: `opacity ${cursorBlinkDuration * 0.4}s`,
            color: "#8027e0",
            WebkitTextFillColor: "#8027e0",
          }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

/* ── CurvedLoop Component ── */
const CurvedLoop = ({
  marqueeText = "",
  speed = 2,
  className = "",
  curveAmount = 400,
  direction = "left",
  interactive = true,
  fillColor = "#ffffff",
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", initial + "px");
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const cur = parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );
        let next = cur + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", next + "px");
        setOffset(next);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const cur = parseFloat(
      textPathRef.current.getAttribute("startOffset") || "0"
    );
    let next = cur + dx;
    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;
    textPathRef.current.setAttribute("startOffset", next + "px");
    setOffset(next);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  return (
    <div
      className="w-full overflow-hidden select-none"
      style={{ visibility: ready ? "visible" : "hidden", cursor: interactive ? "grab" : "auto" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        style={{
          width: "100%",
          overflow: "visible",
          display: "block",
          aspectRatio: "100/12",
          fontSize: "clamp(1.15rem, 4.5vw, 1.6rem)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
        }}
        viewBox="0 0 1440 120"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" style={{ fill: fillColor }}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

/* ── Card data ── */
const cardData = [
  {
    label: "Brand Identity",
    stat: "3.2×",
    sub: "avg. recall lift",
    desc: "A mark that stops thumbs.",
    accent: "#6d1fd4",
  },
  {
    label: "Meta & Performance Ads",
    stat: "↓62%",
    sub: "cost per acquisition",
    desc: "Tested, iterated, scaled.",
    accent: "#4a0fa8",
  },
  {
    label: "Content Strategy",
    stat: "18M+",
    sub: "organic impressions",
    desc: "Stories built to spread.",
    accent: "#2d0880",
  },
];

/* ── Rotating headlines ── */
const headlines = [
  {
    line1: { text: "Make Noise.", gradient: false },
    line2: { text: "Make History.", gradient: "Make" },
  },
  {
    line1: { text: "Think Sharp.", gradient: false },
    line2: { text: "Grow Faster.", gradient: "Grow" },
  },
  {
    line1: { text: "Attention", gradient: false },
    line2: { text: "Into Impact.", gradient: "Impact." },
  },
];

/* ── Hero ── */
export default function Hero() {
  const dark = useIsDark();

  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setActiveCard((i) => (i + 1) % cardData.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [headlineKey, setHeadlineKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % headlines.length);
      setHeadlineKey((k) => k + 1);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  /* ── Theme tokens ── */
  const bg           = dark ? "#0a0a0a"                : "#f0ecfa";
  const textPrimary  = dark ? "#ffffff"                : "#0e0520";
  const cardBorder   = dark ? "rgba(128,39,224,0.20)"  : "rgba(109,31,212,0.18)";
  const cardActiveBdr= dark ? "rgba(142,53,240,0.60)"  : "rgba(109,31,212,0.50)";
  const cardShadow   = dark
    ? "0 16px 56px rgba(128,39,224,0.25), 0 2px 12px rgba(0,0,0,0.6)"
    : "0 16px 56px rgba(109,31,212,0.22), 0 4px 16px rgba(109,31,212,0.14)";
  const glowOp1      = dark ? 0.08  : 0.20;
  const glowOp2      = dark ? 0.06  : 0.14;
  const marqueeColor = dark ? "rgba(255,255,255,0.38)" : "rgba(14,5,32,0.40)";

  const gradientSpanStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <section
      id="home"
      className="relative w-full flex flex-col lg:flex-row items-stretch overflow-hidden transition-colors duration-300 min-h-svh"
      style={{ backgroundColor: bg }}
    >
      {/* ── Glows ── */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full"
        style={{
          background: "radial-gradient(circle, #8027e0 0%, transparent 70%)",
          opacity: glowOp1,
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle, #4a0fa8 0%, transparent 70%)",
          opacity: glowOp2,
          filter: "blur(80px)",
        }}
      />

      {/* ════════════ LEFT ════════════ */}
      <div className="flex flex-col justify-center z-10 flex-[0_0_55%] px-20 pt-24 pb-16 max-lg:flex-[0_0_auto] max-lg:px-12 max-lg:pt-24 max-md:px-6 max-md:pt-24 max-md:mt-8 box-border">

        {/* ── H1: Rotating BlurText headlines ── */}
        <h1
          className="font-bold leading-[1.08] tracking-[-0.02em] mb-6 max-w-[960px]"
          style={{
            fontSize: "clamp(42px, 6.5vw, 96px)",
            color: textPrimary,
          }}
        >
          <span key={headlineKey} className="flex flex-col">
            {/* Line 1 — always plain */}
            <span className="inline-flex flex-wrap">
              <BlurText
                text={headlines[headlineIndex].line1.text}
                delay={100}
                animateBy="words"
                direction="top"
                className="inline"
              />
            </span>

            {/* Line 2 — gradient word via spanStyle */}
            <span className="inline-flex flex-wrap items-baseline whitespace-nowrap">
              {headlines[headlineIndex].line2.gradient ? (
                <>
                  {headlines[headlineIndex].line2.text
                    .split(" ")
                    .map((word, wi) => {
                      const isGradient =
                        word.replace(/[^a-zA-Z]/g, "") ===
                        (headlines[headlineIndex].line2.gradient as string).replace(/[^a-zA-Z]/g, "");
                      return (
                        <BlurText
                          key={wi}
                          text={wi === 0 ? word : " " + word}
                          delay={260 + wi * 80}
                          animateBy="words"
                          direction="top"
                          className="inline"
                          spanStyle={isGradient ? gradientSpanStyle : undefined}
                        />
                      );
                    })}
                </>
              ) : (
                <BlurText
                  text={headlines[headlineIndex].line2.text}
                  delay={260}
                  animateBy="words"
                  direction="top"
                  className="inline"
                />
              )}
            </span>
          </span>
        </h1>

      {/* ── P tag: TextType (typing animation) ── */}
<p
  className="text-[17px] md:text-[19px] leading-[1.45] max-w-125 mb-8 min-h-[2.9em] md:min-h-[1.45em]"
  style={{
    background: "linear-gradient(90deg, #580ca5, #8027e0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}
>
  <TextType
    texts={[
      "We build brands impossible to scroll past.",
      "Impossible to forget. Hard to compete with.",
      "Data-first creative that spreads.",
    ]}
    typingSpeed={38}
    deletingSpeed={22}
    pauseDuration={2200}
    showCursor
    cursorCharacter="|"
    cursorBlinkDuration={0.5}
  />
</p>
        {/* ── CTA Buttons ── */}
        <div className="flex gap-4 flex-wrap max-sm:flex-col max-sm:gap-3">
          {/* Primary: What We Do */}
          <a
            href="#services"
            className="group relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              padding: "13px 28px",
              background: "linear-gradient(90deg, #4a0fa8 0%, #7c22e8 100%)",
              color: "#ffffff",
              borderRadius: "6px",
              boxShadow: dark
                ? "0 0 0 0 rgba(128,39,224,0)"
                : "0 4px 20px rgba(109,31,212,0.35)",
              textDecoration: "none",
              letterSpacing: "0.06em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 6px 28px rgba(128,39,224,0.55)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = dark
                ? "0 0 0 0 rgba(128,39,224,0)"
                : "0 4px 20px rgba(109,31,212,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            What We Do
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              style={{ transition: "transform 0.3s ease" }}
              className="group-hover:translate-x-1"
            >
              <path
                d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Secondary: Let's Connect */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              padding: "12px 28px",
              background: "transparent",
              color: dark ? "rgba(200,170,255,0.9)" : "#4a0fa8",
              border: `1.5px solid ${dark ? "rgba(142,53,240,0.45)" : "rgba(109,31,212,0.40)"}`,
              borderRadius: "6px",
              textDecoration: "none",
              letterSpacing: "0.06em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = dark
                ? "rgba(142,53,240,0.85)"
                : "rgba(109,31,212,0.80)";
              (e.currentTarget as HTMLAnchorElement).style.background = dark
                ? "rgba(128,39,224,0.10)"
                : "rgba(109,31,212,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = dark
                ? "rgba(142,53,240,0.45)"
                : "rgba(109,31,212,0.40)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            Let&apos;s Connect
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M2 7c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5S2 9.76 2 7zm5-2v4m-2-2h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* ════════════ RIGHT — Cards ════════════ */}
      <div className="relative flex-[0_0_45%] flex items-center justify-center overflow-visible z-10 max-lg:flex-[0_0_auto] max-lg:justify-center max-lg:px-10 max-lg:pb-32 max-md:px-6 max-md:pb-36 max-md:pt-10">

        <div
          className="relative"
          style={{
            width: "min(340px, 70vw)",
            height: "min(260px, 56vw)",
            perspective: 900,
            /* centre the whole fanned-out stack (cards fan right/up by 2 steps) */
            transform: "translate(calc(-1 * min(44px, 8vw)), min(50px, 9vw))",
          }}
        >
          {cardData.map((card, i) => {
            const total = cardData.length;
            const skew = 6;
            const isActive = i === activeCard;
            const slot = {
              x: `calc(${i} * min(44px, 8vw))`,
              y: `calc(${-i} * min(50px, 9vw))`,
              z: `${-i * 66}px`,
              zIndex: total - i,
            };

            const cardBackground = dark
              ? "#0f0f0f"
              : "linear-gradient(135deg, #3b0f8a 0%, #6d1fd4 55%, #8e35f0 100%)";

            const cardTextMuted = dark
              ? "rgba(255,255,255,0.42)"
              : "rgba(255,255,255,0.70)";
            const contentFade: React.CSSProperties = {
              opacity: isActive ? 1 : 0,
              transition: isActive ? "opacity 0.45s ease 0.3s" : "opacity 0.2s ease",
            };
            const cardStatColor = dark
              ? undefined
              : "rgba(255,255,255,0.95)";

            return (
              <div
                key={card.label}
                aria-hidden={!isActive}
                className="absolute rounded-[20px] flex flex-col justify-between overflow-hidden box-border"
                style={{
                  width: "min(340px, 70vw)",
                  height: "min(260px, 56vw)",
                  top: "50%",
                  left: "50%",
                  padding: "clamp(16px, 4vw, 28px) clamp(18px, 5vw, 32px)",
                  transform: isActive
                    ? `translate(-50%, -50%) translate3d(0px, 0px, 0px) skewY(${skew}deg)`
                    : `translate(-50%, -50%) translate3d(${slot.x}, ${slot.y}, ${slot.z}) skewY(${skew}deg)`,
                  transformOrigin: "center center",
                  zIndex: isActive ? total + 1 : slot.zIndex,
                  border: `1px solid ${isActive ? cardActiveBdr : cardBorder}`,
                  background: cardBackground,
                  opacity: isActive ? 1 : dark ? 0.48 : 0.55,
                  transition:
                    "transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                  boxShadow: isActive ? cardShadow : "none",
                }}
              >
                {/* Accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]"
                  style={{
                    background: dark
                      ? `linear-gradient(90deg, ${card.accent}, #8e35f0)`
                      : "rgba(255,255,255,0.35)",
                  }}
                />

                {/* Label — content only on the front card, back cards read as clean layers */}
                <p
                  className="text-[10px] font-bold tracking-[0.18em] uppercase m-0"
                  style={{
                    ...contentFade,
                    color: cardTextMuted,
                    fontFamily: "var(--font-clash)",
                  }}
                >
                  {card.label}
                </p>

                {/* Stat */}
                <div style={contentFade}>
                  <div
                    className="font-bold leading-none mb-1"
                    style={{
                      fontSize: "clamp(28px, 4.5vw, 52px)",
                      fontFamily: "var(--font-clash)",
                      ...(dark
                        ? {
                            background: `linear-gradient(135deg, ${card.accent}, #8e35f0)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : { color: cardStatColor }),
                    }}
                  >
                    {card.stat}
                  </div>
                  <div
                    className="text-[10px] font-bold tracking-[0.14em] uppercase"
                    style={{
                      color: cardTextMuted,
                      fontFamily: "var(--font-clash)",
                    }}
                  >
                    {card.sub}
                  </div>
                </div>

                {/* Description */}
                <p
                  className="text-[13px] leading-[1.6] m-0 max-sm:text-[12px] max-sm:line-clamp-2"
                  style={{
                    ...contentFade,
                    color: cardTextMuted,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-20">
        <div className="pb-5 pt-1">
          <CurvedLoop
            marqueeText="Digital Marketing ✦ Social Media ✦ Meta Ads ✦ Branding & Design ✦ Content Strategy ✦ Growth Marketing ✦ Billboard Ads ✦ Newspaper Ads ✦"
            speed={1.2}
            curveAmount={120}
            direction="left"
            interactive={true}
            fillColor={marqueeColor}
          />
        </div>
      </div>
    </section>
  );
}