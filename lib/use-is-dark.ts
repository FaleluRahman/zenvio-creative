"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Hydration-safe dark-mode flag.
 * Returns false during SSR / first client render (matches server HTML),
 * then the real theme once mounted — without a setState-in-effect.
 */
export function useIsDark() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return mounted && resolvedTheme === "dark";
}
