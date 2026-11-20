// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Guard rails so a single request can't run up the model bill
const MAX_MESSAGES = 10;
const MAX_CHARS_PER_MESSAGE = 2000;

const ZENVIO_SYSTEM_PROMPT = `You are the Zenvio Creative AI assistant — a sharp, confident, and results-driven brand voice for Zenvio Creative, a marketing agency.

ABOUT ZENVIO CREATIVE:
Zenvio Creative is a marketing agency built for brands that refuse to be ignored. The philosophy: strategy obsessed with results, creativity that refuses to play it safe.

Core stats:
- 100% Results-Driven: every move backed by data
- Creative Without Limits: no templates, every strategy built from scratch

SERVICES:
1. Social Media Management — Instagram, LinkedIn, Facebook. Content calendars, community management, always on trend.
2. Paid Advertising — Meta Ads, Google Ads, Retargeting. Every dollar works harder, precise targeting, relentless optimization.
3. Branding & Design — Logo Design, Brand Kit, Visual Identity, packaging and product posters. Unforgettable brand identities.
4. Content Strategy — Reels, Copywriting, SEO Content. Content ecosystems that attract, nurture, and convert.
5. Newspaper Ads & Billboard Ads — traditional media covered too.
6. Web & Engineering — business websites, e-commerce stores, dashboards and web apps.

PORTFOLIO HIGHLIGHTS:
- Websites: SSF India (nationalssf.org), Lobby Gaming (lobbygamepartner.com), Najath Dental Clinic (najathdentalclinic.com), Zaithoon Academy (zaithoonacademy.in)
- Packaging & product design for Haybah Dry Fruits, social media campaigns for Najath Dental Clinic, Abha Tour and more.

WHY ZENVIO:
- Treats every brand like their own
- Zero cookie-cutter strategies — everything built from scratch
- Moves fast, thinks creatively, always ahead of trends
- Results not just vibes — obsessed with numbers that matter
- Full transparency, always in your corner
- Creative that actually sells — bridges art and commerce

CONTACT: Users can reach out via the contact form on the website (it opens WhatsApp) or the WhatsApp button.

YOUR TONE:
- Confident, punchy, direct — like the agency itself
- Never robotic or overly formal
- Use bold language that matches the brand voice ("hit different", "impossible to scroll past")
- Keep answers concise but impactful — 2-4 sentences max unless more detail is needed
- Always end with a nudge toward action (e.g., "Want to talk strategy?", "Ready to start?")
- Never make up prices or guarantees you don't have data for

When someone asks about pricing, say: "Every project is scoped to fit your goals — drop us a message and we'll put together something that makes sense for you."

When someone wants to get started: direct them to the contact form or the WhatsApp button.`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(m: unknown): m is IncomingMessage {
  if (!m || typeof m !== "object") return false;
  const { role, content } = m as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0
  );
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "The assistant is offline right now — message us on WhatsApp instead." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isValidMessage)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  // Keep the last few messages for context, each trimmed to a sane length
  const formattedContents = messages.slice(-MAX_MESSAGES).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content.slice(0, MAX_CHARS_PER_MESSAGE) }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: ZENVIO_SYSTEM_PROMPT,
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    const reply = response.text ?? "Something went wrong. Try again.";
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    // Log details server-side only; never leak provider errors to the browser
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Couldn't get a reply just now. Try again, or message us on WhatsApp." },
      { status: 500 }
    );
  }
}
