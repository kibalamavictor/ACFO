"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import { useInView } from "@/lib/useInView";
import styles from "@/app/home.module.css";

const PHOTO = 97;
const ORBIT_DURATION = 48;
const DESKTOP = { width: 1280, height: 501 };

const PORTRAITS = [
  {
    src: "/images/community-1.jpg",
    alt: "Community member",
    orbit: "left" as const,
    angle: 0.4,
  },
  {
    src: "/images/community-2.jpg",
    alt: "Community member",
    orbit: "left" as const,
    angle: 2.4,
  },
  {
    src: "/images/community-3.jpg",
    alt: "Community member",
    orbit: "left" as const,
    angle: 4.3,
  },
  {
    src: "/images/community-4.jpg",
    alt: "Community member",
    orbit: "right" as const,
    angle: 5.5,
  },
  {
    src: "/images/community-5.jpg",
    alt: "Community member",
    orbit: "right" as const,
    angle: 1.2,
  },
  {
    src: "/images/community-6.jpg",
    alt: "Community member",
    orbit: "right" as const,
    angle: 3.3,
  },
];

type OrbitLayout = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  direction: 1 | -1;
};

type CopyBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const DESKTOP_ORBITS = {
  left: { cx: 228, cy: 270, rx: 148, ry: 148, direction: 1 as const },
  right: { cx: 1052, cy: 270, rx: 148, ry: 148, direction: -1 as const },
};

function photoRadiusFor(width: number) {
  if (width <= 900) return 28;
  if (width <= 1279) return 40;
  return 48.5;
}

function fallbackCopy(width: number, height: number): CopyBox | null {
  if (width >= 1280) return null;
  const copyWidth = Math.min(340, width - (width <= 900 ? 32 : 200));
  const copyHeight = width <= 900 ? 260 : 280;
  const left = (width - copyWidth) / 2;
  const top = (height - copyHeight) / 2;
  return {
    left,
    top,
    right: left + copyWidth,
    bottom: top + copyHeight,
  };
}

function layoutFor(
  width: number,
  height: number,
  copy: CopyBox | null,
): { left: OrbitLayout; right: OrbitLayout } {
  const box = copy ?? fallbackCopy(width, height);

  if (!box || width >= 1280) {
    const sx = width / DESKTOP.width;
    const sy = height / DESKTOP.height;
    const scale = Math.min(sx, sy);
    return {
      left: {
        cx: DESKTOP_ORBITS.left.cx * sx,
        cy: DESKTOP_ORBITS.left.cy * sy,
        rx: DESKTOP_ORBITS.left.rx * scale,
        ry: DESKTOP_ORBITS.left.ry * scale,
        direction: 1,
      },
      right: {
        cx: DESKTOP_ORBITS.right.cx * sx,
        cy: DESKTOP_ORBITS.right.cy * sy,
        rx: DESKTOP_ORBITS.right.rx * scale,
        ry: DESKTOP_ORBITS.right.ry * scale,
        direction: -1,
      },
    };
  }

  const photo = photoRadiusFor(width);
  const pad = 6;
  const leftRoom = box.left - photo - pad;
  const rightRoom = width - box.right - photo - pad;

  if (leftRoom >= 56 && rightRoom >= 56) {
    const cy = height / 2;
    const ry = Math.max(36, Math.min(cy - photo - pad, height - cy - photo - pad));
    return {
      left: {
        cx: box.left / 2,
        cy,
        rx: Math.max(28, box.left / 2 - photo - pad),
        ry,
        direction: 1,
      },
      right: {
        cx: (box.right + width) / 2,
        cy,
        rx: Math.max(28, (width - box.right) / 2 - photo - pad),
        ry,
        direction: -1,
      },
    };
  }

  const topBand = box.top;
  const bottomBand = height - box.bottom;
  const cx = width / 2;
  const rx = Math.max(48, cx - photo - pad);

  return {
    left: {
      cx,
      cy: topBand / 2,
      rx,
      ry: Math.max(24, topBand / 2 - photo - pad),
      direction: 1,
    },
    right: {
      cx,
      cy: box.bottom + bottomBand / 2,
      rx,
      ry: Math.max(24, bottomBand / 2 - photo - pad),
      direction: -1,
    },
  };
}

function OrbitingPortrait({
  src,
  alt,
  angle,
  layout,
  active,
}: (typeof PORTRAITS)[number] & { layout: OrbitLayout; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const x = useMotionValue(layout.cx + layout.rx * Math.cos(angle));
  const y = useMotionValue(layout.cy + layout.ry * Math.sin(angle));

  useAnimationFrame((t) => {
    if (!active || reduceMotion) return;
    const { cx, cy, rx, ry, direction } = layoutRef.current;
    const turn =
      angle + (direction * (t / 1000) * Math.PI * 2) / ORBIT_DURATION;
    x.set(cx + rx * Math.cos(turn));
    y.set(cy + ry * Math.sin(turn));
  });

  return (
    <motion.button
      type="button"
      className={styles.communityPhoto}
      style={{ x, y }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.22, zIndex: 5 }}
      aria-label={alt}
    >
      <img src={src} alt="" width={PHOTO} height={PHOTO} loading="lazy" decoding="async" />
    </motion.button>
  );
}

type CommunityProps = {
  top?: number;
};

export default function Community({ top = 3317 }: CommunityProps) {
  const section = usePage("home").community;
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(DESKTOP);
  const [copy, setCopy] = useState<CopyBox | null>(null);
  const orbits = layoutFor(size.width, size.height, copy);
  const inView = useInView(stageRef);

  useEffect(() => {
    const stage = stageRef.current;
    const copyEl = copyRef.current;
    if (!stage) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const stageBox = stage.getBoundingClientRect();
        if (stageBox.width > 0 && stageBox.height > 0) {
          setSize((current) =>
            current.width === stageBox.width && current.height === stageBox.height
              ? current
              : { width: stageBox.width, height: stageBox.height },
          );
        }

        if (!copyEl) return;
        const copyBox = copyEl.getBoundingClientRect();
        if (copyBox.width < 8 || copyBox.height < 8) {
          setCopy(null);
          return;
        }

        const next = {
          left: copyBox.left - stageBox.left,
          top: copyBox.top - stageBox.top,
          right: copyBox.right - stageBox.left,
          bottom: copyBox.bottom - stageBox.top,
        };
        setCopy((current) =>
          current &&
          current.left === next.left &&
          current.top === next.top &&
          current.right === next.right &&
          current.bottom === next.bottom
            ? current
            : next,
        );
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    if (copyEl) observer.observe(copyEl);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.communityStage} style={{ top }} ref={stageRef}>
      <div className={styles.communityWash} />
      <div className={styles.communityWave}>
        <div className={styles.communityWaveInner} />
      </div>

      <div className={styles.communityOrbit}>
        {PORTRAITS.map((portrait) => (
          <OrbitingPortrait
            key={portrait.src}
            {...portrait}
            layout={orbits[portrait.orbit]}
            active={inView}
          />
        ))}
      </div>

      <div className={styles.communityCopy} ref={copyRef}>
        <div className={styles.communityBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(section.badge, "Join Our Community")}
        </div>

        <h2 className={styles.communityHeading}>{text(section.heading)}</h2>

        <div className={styles.communityStatRow}>
          <p className={styles.communityStat}>{text(section.stat, "1000+")}</p>
          <p className={styles.communityStatLabel}>
            {text(section.statLabel, "Children\nSaved")
              .split("\n")
              .map((line, index) => (
                <span key={`${line}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
          </p>
        </div>

        <p className={styles.communitySub}>{text(section.sub, "Every action matters")}</p>

        <Link href="/contact-us" className={styles.communityCta}>
          {text(section.cta, "Join Our Community")}
        </Link>
      </div>
    </div>
  );
}
