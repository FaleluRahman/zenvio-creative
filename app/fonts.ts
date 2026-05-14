import localFont from "next/font/local";
import { Geist } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

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