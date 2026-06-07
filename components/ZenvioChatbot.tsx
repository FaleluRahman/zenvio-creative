"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { label: "Services", icon: "✦", text: "What services does Zenvio offer?" },
  { label: "Pricing", icon: "◈", text: "How much does it cost to work with Zenvio?" },
  { label: "Get Started", icon: "⟶", text: "How do I get started with Zenvio?" },
];

export default function ZenvioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleToggle = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    setIsOpen((v) => !v);
  };

  const sendMessage = async (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Couldn't reach the server. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isOpen
            ? "linear-gradient(135deg, #6c2fdb, #4a0fa8)"
            : "linear-gradient(135deg, #4a0fa8, #3008a0)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          boxShadow: isOpen
            ? "0 8px 32px rgba(74,15,168,0.5), 0 0 0 4px rgba(74,15,168,0.15)"
            : "0 4px 20px rgba(74,15,168,0.4)",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          animation: isOpen ? "none" : "pulseRing 2.8s ease-out infinite",
          overflow: "visible",
        }}
      >
        {ripple && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              animation: "rippleOut 0.6s ease-out forwards",
            }}
          />
        )}

        <span
          style={{
            position: "relative",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              transition: "opacity 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? "scale(0.4) rotate(90deg)" : "scale(1) rotate(0deg)",
            }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="0.8" fill="#fff" stroke="none" />
            <circle cx="12" cy="10" r="0.8" fill="#fff" stroke="none" />
            <circle cx="15" cy="10" r="0.8" fill="#fff" stroke="none" />
          </svg>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              position: "absolute",
              transition: "opacity 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-90deg)",
            }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </button>

      {/* ── Chat Panel ── */}
      <div
        role="dialog"
        aria-label="Zenvio Creative chat assistant"
        style={{
          position: "fixed",
          /* Mobile: anchor to all four sides with safe margins */
          bottom: "calc(56px + 1.5rem + 0.75rem)", /* above the button */
          right: "1.5rem",
          left: "1.5rem",           /* fills width on mobile */
          /* Desktop override via the <style> block below */
          maxHeight: "min(520px, calc(100dvh - 56px - 1.5rem - 0.75rem - 1.5rem))",
          background: "#0A0A0A",
          border: "1px solid #1E1E1E",
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 999,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.88) translateY(20px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.04)",
        }}
        className="zenvio-chat-panel"
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid #1E1E1E",
            background: "linear-gradient(180deg, #111111 0%, #0A0A0A 100%)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c2fdb, #4a0fa8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.5px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Z
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(74,15,168,0.4)",
                  animation: "avatarPulse 2s ease-in-out infinite",
                }}
              />
            </div>

            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff", letterSpacing: "0.2px" }}>
                Zenvio{" "}
                <span style={{ color: "#444", fontWeight: 400 }}>Assistant</span>
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#7b3fe4", display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#7b3fe4",
                    animation: "statusBlink 2s ease-in-out infinite",
                  }}
                />
                Online
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {messages.length > 0 && (
              <IconBtn onClick={clearChat} title="Clear chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </IconBtn>
            )}
            <IconBtn onClick={() => setIsOpen(false)} title="Close">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </IconBtn>
          </div>
        </div>

        {/* ── Quick Prompts ── */}
        {messages.length === 0 && (
          <div style={{ padding: "16px 14px 0", flexShrink: 0 }}>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
              Hey there 👋 — ask me anything about Zenvio.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {QUICK_PROMPTS.map((q) => (
                <QuickPromptBtn key={q.label} prompt={q} onClick={() => sendMessage(q.text)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            scrollbarWidth: "none",
            minHeight: 0, /* critical: lets flex child shrink + scroll */
          }}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input ── */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid #1A1A1A",
            background: "#0A0A0A",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              background: "#111111",
              border: "1px solid #252525",
              borderRadius: "12px",
              padding: "9px 10px",
              transition: "border-color 0.15s",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Zenvio…"
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "13px",
                resize: "none",
                lineHeight: 1.5,
                maxHeight: "100px",
                fontFamily: "inherit",
                scrollbarWidth: "none",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: input.trim() ? "linear-gradient(135deg, #6c2fdb, #4a0fa8)" : "#1a1a1a",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
                transform: input.trim() ? "scale(1)" : "scale(0.92)",
                boxShadow: input.trim() ? "0 4px 12px rgba(74,15,168,0.4)" : "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: "11px", color: "#2a2a2a", letterSpacing: "0.3px" }}>
            Powered by Zenvio AI
          </p>
        </div>
      </div>

      <style>{`
        /* Desktop: fixed 360px width, anchored to right */
        @media (min-width: 480px) {
          .zenvio-chat-panel {
            left: auto !important;
            width: 360px !important;
          }
        }

        @keyframes pulseRing {
          0%   { box-shadow: 0 4px 20px rgba(74,15,168,0.4), 0 0 0 0 rgba(74,15,168,0.55); }
          65%  { box-shadow: 0 4px 20px rgba(74,15,168,0.4), 0 0 0 14px rgba(74,15,168,0); }
          100% { box-shadow: 0 4px 20px rgba(74,15,168,0.4), 0 0 0 0 rgba(74,15,168,0); }
        }
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes avatarPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.08); }
        }
        @keyframes statusBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "7px",
        background: hovered ? "#1a1a1a" : "transparent",
        border: "none",
        color: hovered ? "#fff" : "#444",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function QuickPromptBtn({
  prompt,
  onClick,
}: {
  prompt: { label: string; icon: string; text: string };
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: "left",
        padding: "10px 14px",
        background: hovered ? "#1a1a1a" : "#111111",
        border: `1px solid ${hovered ? "#333" : "#1e1e1e"}`,
        borderRadius: "11px",
        color: hovered ? "#fff" : "#bbb",
        cursor: "pointer",
        fontSize: "13px",
        lineHeight: 1.4,
        transition: "all 0.15s",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
      }}
    >
      <span
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "7px",
          background: hovered ? "rgba(74,15,168,0.25)" : "rgba(74,15,168,0.12)",
          border: "1px solid rgba(74,15,168,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          flexShrink: 0,
          transition: "all 0.15s",
          color: "#7b3fe4",
        }}
      >
        {prompt.icon}
      </span>
      <span>
        <strong style={{ color: hovered ? "#fff" : "#eee", display: "block", fontSize: "12px", marginBottom: "1px" }}>
          {prompt.label}
        </strong>
        <span style={{ fontSize: "12px", color: "#555" }}>{prompt.text}</span>
      </span>
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        animation: "fadeSlideUp 0.25s ease forwards",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6c2fdb, #4a0fa8)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Z
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 14px",
          borderRadius: isUser ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
          fontSize: "13px",
          lineHeight: 1.6,
          background: isUser
            ? "linear-gradient(135deg, #6c2fdb, #4a0fa8)"
            : "#141414",
          color: isUser ? "#fff" : "#d4d4d4",
          border: isUser ? "none" : "1px solid #1e1e1e",
          fontWeight: isUser ? 500 : 400,
          boxShadow: isUser ? "0 4px 12px rgba(74,15,168,0.3)" : "none",
          wordBreak: "break-word",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        animation: "fadeSlideUp 0.25s ease forwards",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6c2fdb, #4a0fa8)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Z
      </div>
      <div
        style={{
          padding: "12px 16px",
          background: "#141414",
          border: "1px solid #1e1e1e",
          borderRadius: "14px 14px 14px 3px",
          display: "flex",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {[0, 0.18, 0.36].map((delay, i) => (
          <div
            key={i}
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "#4a0fa8",
              animation: `bounce 1.1s ${delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}