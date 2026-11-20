import localFont from "next/font/local";

export const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const vamos = localFont({
  src: [
    {
      path: "../public/fonts/vamos.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-vamos",
  display: "swap",
});

/* Secondary / body font */
export const pangram = localFont({
  src: [
    { path: "../public/fonts/Pangram-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../public/fonts/Pangram-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Pangram-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Pangram-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Pangram-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Pangram-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../public/fonts/Pangram-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-pangram",
  display: "swap",
});


/* Primary / heading font (h1–h6) */
export const brother = localFont({
  src: [
    { path: "../public/fonts/Brother1816-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Brother1816-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-brother",
  display: "swap",
});
