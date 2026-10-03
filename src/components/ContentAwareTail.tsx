"use client";

import { useEffect, useState } from "react";

/**
 * Measures the bottom edge of the element matching `selector` (inside the
 * nearest `main.page` container) and returns how far it deviates from the
 * designed baseline. Tail sections (related stories, community, footer)
 * add this value to their designed positions so they always sit right
 * after the content — no gaps for short content, no overlap for long.
 *
 * Only active on desktop (>= 1300px) where absolute positioning is used.
 * On responsive widths, returns 0 (sections flow naturally via CSS).
 */
export function useContentBottom(
  selector: string,
  designedBottom: number,
): number {
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 1300) {
        setExtra(0);
        return;
      }

      const page = document.querySelector(
        "main[class*='page']",
      ) as HTMLElement | null;
      if (!page) return;

      const el = page.querySelector(selector) as HTMLElement | null;
      if (!el) return;

      const zoom =
        parseFloat(getComputedStyle(document.documentElement).zoom || "1") || 1;
      const pageRect = page.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const bottom = (rect.bottom - pageRect.top) / zoom;

      if (bottom > 0) {
        setExtra(Math.ceil(bottom) - designedBottom);
      }
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    const page = document.querySelector(
      "main[class*='page']",
    ) as HTMLElement | null;
    const target = page?.querySelector(selector) as HTMLElement | null;

    const observer = new ResizeObserver(measure);
    if (target) observer.observe(target);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selector, designedBottom]);

  return extra;
}
