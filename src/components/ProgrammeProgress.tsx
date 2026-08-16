"use client";

import { useEffect, useRef } from "react";
import { getProgrammeImpact, type ProgrammeId } from "@/data/projects";
import styles from "@/app/home.module.css";

type ProgrammeProgressProps = {
  programmeId: ProgrammeId;
  className: string;
  style?: React.CSSProperties;
};

const TRACK_WIDTH = 399;
const DURATION = 2000;

function easeOutQuint(t: number) {
  return 1 - (1 - t) ** 5;
}

export default function ProgrammeProgress({
  programmeId,
  className,
  style,
}: ProgrammeProgressProps) {
  const { reach, target, title } = getProgrammeImpact(programmeId);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    const counter = counterRef.current;
    if (!root || !fill || !counter) return;

    let started = false;
    const maxProgress = target > 0 ? Math.min(1, reach / target) : 0;

    const paint = (t: number) => {
      const progress = maxProgress * t;
      const trackWidth = fill.parentElement?.clientWidth ?? TRACK_WIDTH;
      fill.style.transform = `scaleX(${progress})`;
      counter.style.transform = `translate3d(${progress * trackWidth}px, 0, 0) translateX(-50%)`;
      counter.textContent = Math.round(reach * t).toLocaleString();
      root.setAttribute("aria-valuenow", String(Math.round(reach * t)));
    };

    paint(0);

    const run = () => {
      if (started) return;
      started = true;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced || reach <= 0) {
        paint(1);
        return;
      }

      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        paint(easeOutQuint(t));
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          paint(1);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [reach, target]);

  return (
    <div
      ref={rootRef}
      className={`${styles.programmeProgress} ${className}`}
      style={style}
      role="progressbar"
      aria-label={`${title} reach`}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={0}
      aria-valuetext={`${reach.toLocaleString()} of ${target.toLocaleString()}`}
    >
      <div className={styles.programmeTrack}>
        <div ref={fillRef} className={styles.programmeFill} />
      </div>
      <div ref={counterRef} className={styles.programmeCounter}>
        0
      </div>
    </div>
  );
}
