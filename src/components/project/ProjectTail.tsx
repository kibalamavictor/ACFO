"use client";

import { useEffect, useRef, useState } from "react";
import ProjectGallery from "@/components/project/ProjectGallery";
import ProjectCommunity from "@/components/project/ProjectCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/project.module.css";

const DEFAULTS = {
  gallery: 3043,
  community: 3738,
  footer: 4220,
};
const GALLERY_HEIGHT = 596;
const COMMUNITY_HEIGHT = 531;
const GAP = 48;

export default function ProjectTail({ after }: { after: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tops, setTops] = useState(DEFAULTS);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      if (window.innerWidth < 1300) {
        setTops(DEFAULTS);
        return;
      }

      const page = el.closest("main") as HTMLElement | null;
      if (!page) return;

      const target = page.querySelector(after) as HTMLElement | null;
      if (!target) return;

      const pageRect = page.getBoundingClientRect();
      const zoom =
        parseFloat(getComputedStyle(document.documentElement).zoom || "1") || 1;
      const targetRect = target.getBoundingClientRect();
      const bottom = (targetRect.bottom - pageRect.top) / zoom;

      if (bottom > 0) {
        const galleryTop = Math.ceil(bottom) + GAP;
        const communityTop = galleryTop + GALLERY_HEIGHT + GAP;
        const footerTop = communityTop + COMMUNITY_HEIGHT;
        setTops({
          gallery: galleryTop,
          community: communityTop,
          footer: footerTop,
        });
      }
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    const observer = new ResizeObserver(measure);
    const page = el.closest("main");
    if (page) observer.observe(page);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [after]);

  const minHeight = tops.footer + 505;

  return (
    <div ref={ref} style={{ display: "contents" }}>
      <div
        className={styles.tailSpacer}
        style={{ height: minHeight }}
        aria-hidden
      />
      <ProjectGallery topOffset={tops.gallery} />
      <ProjectCommunity topOffset={tops.community} />
      <Footer top={tops.footer} />
    </div>
  );
}
