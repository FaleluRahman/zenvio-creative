/**
 * app/robots.ts
 *
 * Next.js App Router — auto-served at /robots.txt
 *
 * Rules:
 *  - All crawlers: allow all public paths
 *  - Explicitly disallow API routes (not pages, should never be indexed)
 *  - Explicitly disallow Next.js internal paths
 *  - Sitemap pointer: canonical production URL
 *
 * Note: the `host` field is a Yandex extension, not part of the Robots
 * Exclusion Protocol and is ignored by Google. Removed to keep output clean.
 */

import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://zenvio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",   // API routes — not indexable pages
          "/_next/", // Next.js internals
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
