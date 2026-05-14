"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useMemo, useId, } from "react";




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
    desc: "We distill your brand into a mark that stops thumbs and earns loyalty.",
    accent: "#6d1fd4",
  },
  {
    label: "Meta & Performance Ads",
    stat: "↓62%",
    sub: "cost per acquisition",
    desc: "Data-first creative that converts — tested, iterated, scaled.",
    accent: "#4a0fa8",
  },
  {
    label: "Content Strategy",
    stat: "18M+",
    sub: "organic impressions",
    desc: "Stories engineered to spread — from brief to viral loop.",
    accent: "#2d0880",
  },
];

/* ── Hero ── */
export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setActiveCard((i) => (i + 1) % cardData.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  /* ── Theme tokens ── */
  const bg           = dark ? "#0a0a0a"                : "#f0ecfa";
  const textPrimary  = dark ? "#ffffff"                : "#0e0520";
  // ── FIX: p tag color — white in dark, dark in light ──
  const textMuted    = dark ? "rgba(255, 255, 255, 0.75)" : "rgba(14, 5, 32, 0.70)";
  const cardBorder   = dark ? "rgba(128,39,224,0.20)"  : "rgba(109,31,212,0.18)";
  const cardActiveBdr= dark ? "rgba(142,53,240,0.60)"  : "rgba(109,31,212,0.50)";
  const cardShadow   = dark
    ? "0 16px 56px rgba(128,39,224,0.25), 0 2px 12px rgba(0,0,0,0.6)"
    : "0 16px 56px rgba(109,31,212,0.22), 0 4px 16px rgba(109,31,212,0.14)";
  const glowOp1      = dark ? 0.08  : 0.20;
  const glowOp2      = dark ? 0.06  : 0.14;
  const dotInactive  = dark ? "rgba(128,39,224,0.25)" : "rgba(109,31,212,0.22)";
  const marqueeColor = dark ? "rgba(255,255,255,0.38)" : "rgba(14,5,32,0.40)";

  return (
    <section
      className="relative w-full flex flex-col lg:flex-row items-stretch overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bg, minHeight: "100vh" }}
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
      {/*
        FIX: Increased mobile top padding significantly — pt-36 on mobile (max-md)
        Previously was max-md:pt-20, now max-md:pt-36 for much more breathing room
      */}
      <div className="flex flex-col justify-center z-10 flex-[0_0_55%] px-20 pt-24 pb-16 max-lg:flex-[0_0_auto] max-lg:px-12 max-lg:pt-24 max-md:px-6 max-md:pt-24 max-md:mt-8 box-border">

        {/* Headline */}
        <h1
          className="font-medium leading-[1.02] tracking-[-0.02em] mb-6 max-w-[960px]"
          style={{
            fontFamily: "var(--font-clash)",
            fontSize: "clamp(42px, 6.5vw, 96px)",
            color: textPrimary,
          }}
        >
          Your {""}
          <span className="inline-block bg-gradient-to-r from-[#3b0f8a] via-[#6d1fd4] to-[#8e35f0] bg-clip-text text-transparent">
            Brand {""}
          </span>
          {""} is {""}
          <span
            className="inline-block text-white"
            style={{
              background: "linear-gradient(90deg, #4a0fa8 0%, #7c22e8 100%)",
              padding: "2px 14px 6px 6px",
            }}
          >
            Bleeding.
          </span>
          <br />
          <TextType
            texts={["Let's Stop it.", "Let's Fix it.", "Let's Own it."]}
            typingSpeed={65}
            deletingSpeed={40}
            pauseDuration={1800}
            showCursor
            cursorCharacter="_"
            cursorBlinkDuration={0.5}
          />
        </h1>

        {/* Body copy — FIX: white in dark theme, dark in light theme */}
        <p
          className="text-[17px] leading-[1.78] max-w-[500px] mb-7"
          style={{
            color: textMuted,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          We don&apos;t just run campaigns. We build brands that are impossible to scroll past,
          impossible to forget, and impossible to compete with.
        </p>
      </div>

      {/* ════════════ RIGHT — Cards ════════════ */}
      <div className="relative flex-[0_0_45%] flex items-center justify-center overflow-visible z-10 max-lg:flex-[0_0_auto] max-lg:justify-center max-lg:px-10 max-lg:pb-20 max-md:px-6 max-md:pb-16">

        <div
          className="relative"
          style={{
            width: "min(340px, 80vw)",
            height: "min(260px, 62vw)",
            perspective: 900,
            transform: "translateX(4%) translateY(6%)",
          }}
        >
          {cardData.map((card, i) => {
            const total = cardData.length;
            const dist = 44, vDist = 50, skew = 6;
            const isActive = i === activeCard;
            const slot = {
              x: i * dist,
              y: -i * vDist,
              z: -i * dist * 1.5,
              zIndex: total - i,
            };

            const cardBackground = dark
              ? "#0f0f0f"
              : "linear-gradient(135deg, #3b0f8a 0%, #6d1fd4 55%, #8e35f0 100%)";

            const cardTextMuted = dark
              ? "rgba(255,255,255,0.42)"
              : "rgba(255,255,255,0.70)";
            const cardStatColor = dark
              ? undefined
              : "rgba(255,255,255,0.95)";

            return (
              <div
                key={i}
                className="absolute rounded-[20px] flex flex-col justify-between overflow-hidden box-border"
                style={{
                  width: "min(340px, 80vw)",
                  height: "min(260px, 62vw)",
                  top: "50%",
                  left: "50%",
                  padding: "clamp(16px, 4vw, 28px) clamp(18px, 5vw, 32px)",
                  transform: isActive
                    ? `translate(-50%, -50%) translate3d(0px, 0px, 0px) skewY(${skew}deg)`
                    : `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) skewY(${skew}deg)`,
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

                {/* Label */}
                <p
                  className="text-[10px] font-bold tracking-[0.18em] uppercase m-0"
                  style={{
                    color: cardTextMuted,
                    fontFamily: "var(--font-clash)",
                  }}
                >
                  {card.label}
                </p>

                {/* Stat */}
                <div>
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
                  className="text-[13px] leading-[1.65] m-0"
                  style={{
                    color: cardTextMuted,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

      
      </div>

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