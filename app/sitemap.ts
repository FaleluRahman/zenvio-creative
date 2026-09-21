/**
 * app/sitemap.ts
 *
 * Next.js App Router — auto-served at /sitemap.xml
 *
 * Inspection summary:
 *  - Single-page site: all content (Hero, About, Why Us, Contact) lives on `/`
 *  - No dynamic routes, no blog, no products
 *  - API routes: /api/chat — excluded (not a page)
 *  - Canonical URL: https://zenvio.com/ (matches layout.tsx alternates.canonical)
 *  - No noindex found on any route
 *  - No redirects configured
 *
 * Google's sitemap spec: fragment identifiers (#section) are stripped by
 * crawlers — do NOT include /#about, /#contact, etc. Only canonical page
 * URLs belong in a sitemap.
 *
 * lastModified: static date — updated manually when the site content changes.
 * Do NOT use `new Date()` here; that would falsely signal to Google that
 * every page changes on every request.
 */

import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://zenvio.com";

/**
 * Last significant content update to the site.
 * Update this date whenever meaningful page content changes.
 */
const SITE_LAST_UPDATED = new Date("2025-09-21");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      /**
       * The homepage — the only indexable URL on this site.
       * All sections (About, Services, Why Us, Contact) are anchor-scrolled
       * sections on this single page. Canonical: https://zenvio.com/
       */
      url: `${BASE_URL}/`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
