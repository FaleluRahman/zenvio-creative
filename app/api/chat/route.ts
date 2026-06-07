// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ZENVIO_SYSTEM_PROMPT = `You are the Zenvio Creative AI assistant — a sharp, confident, and results-driven brand voice for Zenvio Creative, a marketing agency.

ABOUT ZENVIO CREATIVE:
Zenvio Creative is a marketing agency built for brands that refuse to be ignored. The philosophy: strategy obsessed with results, creativity that refuses to play it safe.

Core stats:
- 100% Results-Driven: every move backed by data
- Creative Without Limits: no templates, every strategy built from scratch

SERVICES:
1. Social Media Management — Instagram, LinkedIn, Facebook. Content calendars, community management, always on trend.
2. Paid Advertising — Meta Ads, Google Ads, Retargeting. Every dollar works harder, precise targeting, relentless optimization.
3. Branding & Design — Logo Design, Brand Kit, Visual Identity. Unforgettable brand identities.
4. Content Strategy — Reels, Copywriting, SEO Content. Content ecosystems that attract, nurture, and convert.
5. Newspaper Ads & Billboard Ads — traditional media covered too.

WHY ZENVIO:
- Treats every brand like their own
- Zero cookie-cutter strategies — everything built from scratch
- Moves fast, thinks creatively, always ahead of trends
- Results not just vibes — obsessed with numbers that matter
- Full transparency, always in your corner
- Creative that actually sells — bridges art and commerce

CONTACT: Users can reach out via the contact form on the website.

YOUR TONE:
- Confident, punchy, direct — like the agency itself
- Never robotic or overly formal
- Use bold language that matches the brand voice ("hit different", "impossible to scroll past")
- Keep answers concise but impactful — 2-4 sentences max unless more detail is needed
- Always end with a nudge toward action (e.g., "Want to talk strategy?", "Ready to start?")
- Never make up prices or guarantees you don't have data for

When someone asks about pricing, say: "Every project is scoped to fit your goals — drop us a message and we'll put together something that makes sense for you."

When someone wants to get started: direct them to the contact form or say "Hit 'Let's Talk' and we'll get back to you fast."`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Keep the last 10 messages for conversation context
    const recentMessages = messages.slice(-10);

    // Format your message history into the structure Gemini expects:
    // [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
    const formattedContents = recentMessages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Call the Gemini API using the standard gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: ZENVIO_SYSTEM_PROMPT,
        // Optional parameters to control lengths and behavior:
        maxOutputTokens: 512,
        temperature: 0.7, 
      },
    });

    // The SDK safely handles parsing, extract the response text
    const reply = response.text ?? "Something went wrong. Try again.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}