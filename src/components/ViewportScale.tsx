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
    html.style.zoom = "";
    body.style.zoom = "";
    body.style.margin = "";
    return;
  }

  const width = window.innerWidth;

  if (width < DESIGN_WIDTH) {
    html.classList.remove("site-scale");
    html.style.removeProperty("--site-scale");
    html.style.zoom = "";
    body.style.zoom = "";
    body.style.margin = "";
    return;
  }

  const scale = width / DESIGN_WIDTH;
  const next = String(scale);

  html.classList.add("site-scale");

  if (html.style.getPropertyValue("--site-scale") === next) {
    return;
  }

  html.style.setProperty("--site-scale", next);

  if (supportsZoom()) {
    html.style.zoom = next;
    body.style.zoom = "";
    body.style.margin = "0";
  } else {
    html.style.zoom = "";
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

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return children;
}
