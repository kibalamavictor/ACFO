"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const DESIGN_WIDTH = 1280;

function supportsZoom() {
  if (typeof CSS !== "undefined" && CSS.supports("zoom", "1")) {
    return true;
  }

  const test = document.createElement("div");
  test.style.zoom = "2";
  return test.style.zoom === "2";
}

export function applySiteScale() {
  if (typeof document === "undefined") {
    return;
  }

  const html = document.documentElement;
  const body = document.body;
  if (!body) {
    return;
  }

  if (location.pathname.startsWith("/admin")) {
    html.classList.remove("site-scale");
    html.style.removeProperty("--site-scale");
    body.style.zoom = "";
    body.style.margin = "";
    return;
  }

  const width = window.innerWidth;
  const scale = Math.max(width / DESIGN_WIDTH, 0.01);

  html.classList.add("site-scale");
  html.style.setProperty("--site-scale", String(scale));

  if (supportsZoom()) {
    body.style.zoom = String(scale);
    body.style.margin = "0";
  } else {
    body.style.zoom = "";
    body.style.margin = "0 auto";
  }
}

export default function ViewportScale({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    applySiteScale();

    const onResize = () => applySiteScale();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return children;
}
