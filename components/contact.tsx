"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

const services = [
  "Social Media Management",
  "Paid Advertising",
  "Branding & Design",
  "Content Strategy",
  "Billboard / Newspaper Ads",
  "Growth Marketing",
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

export default function Contact() {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(resolvedTheme === "dark"); }, [resolvedTheme]);

  const { ref, inView } = useInView();

  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const bg          = dark ? "#0a0a0a"                : "#f0ecfa";
  const textPrimary = dark ? "#ffffff"                : "#0e0520";
  const textMuted   = dark ? "rgba(255,255,255,0.58)" : "rgba(14,5,32,0.58)";
  const cardBg      = dark ? "#0d0d0d"                : "#ffffff";
  const cardBorder  = dark ? "rgba(128,39,224,0.16)"  : "rgba(109,31,212,0.12)";
  const tagBg       = dark ? "rgba(128,39,224,0.12)"  : "rgba(109,31,212,0.08)";
  const tagColor    = dark ? "#c8aaff"                : "#6d1fd4";
  const inputBg     = dark ? "#171717"                : "#f7f3ff";
  const inputBorder = dark ? "rgba(128,39,224,0.20)"  : "rgba(109,31,212,0.14)";
  const inputFocus  = "rgba(142,53,240,0.55)";

  const toggleService = (s: string) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden py-32 max-md:py-20"
      style={{ backgroundColor: bg }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, #8e35f0 0%, transparent 70%)", opacity: dark ? 0.06 : 0.11, filter: "blur(90px)" }} />
      <div className="pointer-events-none absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, #4a0fa8 0%, transparent 70%)", opacity: dark ? 0.05 : 0.09, filter: "blur(80px)" }} />

<div className="w-full px-20 max-lg:px-12 max-md:px-6" ref={ref}>
        {/* Header */}
        <div
          className="text-center mb-14"
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
            Get In Touch
          </span>
          <h2
            className="font-bold leading-[1.06] tracking-[-0.02em] mb-4"
            style={{
              fontFamily: "var(--font-clash)",
              fontSize: "clamp(36px, 5.5vw, 76px)",
              color: textPrimary,
            }}
          >
            LET&apos;S BUILD
            <br />
            <span style={{
              background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              SOMETHING BIG.
            </span>
          </h2>
          <p className="text-[16px] leading-[1.65] max-w-[460px] mx-auto"
            style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Drop us a message. We respond fast — because good opportunities shouldn&apos;t wait.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: dark
              ? "0 24px 80px rgba(0,0,0,0.55), 0 2px 16px rgba(128,39,224,0.10)"
              : "0 24px 80px rgba(109,31,212,0.10), 0 4px 20px rgba(109,31,212,0.06)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          {/* Top accent bar */}
          <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #3b0f8a, #6d1fd4, #8e35f0)" }} />

          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #4a0fa8, #8e35f0)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3
                className="font-bold mb-3"
                style={{ fontFamily: "var(--font-clash)", fontSize: "28px", color: textPrimary }}
              >
                Message Sent!
              </h3>
              <p className="text-[15px]" style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                We&apos;ll be in touch soon. Get ready to build something big.
              </p>
            </div>
          ) : (
            <div className="p-10 max-md:p-7">
              {/* Service selector */}
              <div className="mb-8">
                <p
                  className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                  style={{ color: tagColor, fontFamily: "var(--font-clash)" }}
                >
                  What Do You Need?
                </p>
                <div className="flex flex-wrap gap-3">
                  {services.map((s) => {
                    const isActive = selected.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleService(s)}
                        className="text-[12px] font-semibold tracking-wide uppercase px-4 py-2 rounded-full transition-all duration-250"
                        style={{
                          fontFamily: "var(--font-clash)",
                          letterSpacing: "0.08em",
                          background: isActive
                            ? "linear-gradient(90deg, #4a0fa8, #7c22e8)"
                            : inputBg,
                          color: isActive ? "#ffffff" : textMuted,
                          border: `1px solid ${isActive ? "transparent" : inputBorder}`,
                          boxShadow: isActive ? "0 4px 16px rgba(109,31,212,0.30)" : "none",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-8">
                <p
                  className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3"
                  style={{ color: tagColor, fontFamily: "var(--font-clash)" }}
                >
                  Tell Us More
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your brand, your goals, and what's holding you back..."
                  rows={5}
                  className="w-full rounded-xl px-5 py-4 text-[14px] leading-[1.65] resize-none outline-none transition-all duration-250"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textPrimary,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = inputFocus)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between flex-wrap gap-5">
                <p className="text-[13px]" style={{ color: textMuted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  No spam. No long waits. Just real conversations.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !message.trim()}
                  className="inline-flex items-center gap-2 font-semibold tracking-wide transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-clash)",
                    fontSize: "13px",
                    letterSpacing: "0.07em",
                    padding: "13px 30px",
                    background: message.trim()
                      ? "linear-gradient(90deg, #4a0fa8, #7c22e8)"
                      : dark ? "rgba(255,255,255,0.08)" : "rgba(14,5,32,0.08)",
                    color: message.trim() ? "#ffffff" : textMuted,
                    border: "none",
                    borderRadius: "8px",
                    cursor: message.trim() ? "pointer" : "not-allowed",
                    boxShadow: message.trim() ? "0 4px 20px rgba(109,31,212,0.35)" : "none",
                    opacity: sending ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!message.trim()) return;
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(128,39,224,0.50)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = message.trim()
                      ? "0 4px 20px rgba(109,31,212,0.35)"
                      : "none";
                  }}
                >
                  {sending ? "Sending…" : "Send It →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}