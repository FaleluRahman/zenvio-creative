import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import { geist, clashDisplay, vamos } from "./fonts";

export const metadata: Metadata = {
  title: "Zenvio Creative",
  description: "Bold marketing agency built for brands that move people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        geist.variable,
        clashDisplay.variable,
        vamos.variable
      )}
    >
      <body className="min-h-screen bg-background font-dm antialiased transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}