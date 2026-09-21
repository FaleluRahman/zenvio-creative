import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zenvio Creative",
    short_name: "Zenvio",
    description:
      "Bold marketing agency built for brands that move people. Social media, paid ads, branding, and content strategy.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#7c3aed",
    orientation: "portrait",
    icons: [
      {
        src: "/images/Icon z.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/Icon z.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
