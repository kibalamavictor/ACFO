"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

function parseStat(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: value };
  }
  return { target: Number(match[1]), suffix: match[2] };
}

type CountStatProps = {
  value: string;
  className: string;
  delay?: number;
};

export default function CountStat({
  value,
  className,
  delay = 0,
}: CountStatProps) {
  const { target, suffix } = parseStat(value);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (reduceMotion) {
      setCount(target);
      return;
    }

    let frame = 0;
    const duration = 1400;
    let start = 0;

    const timeout = window.setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(eased * target));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, target, reduceMotion, delay]);

  return (
    <p ref={ref} className={className}>
      {count}
      {suffix}
    </p>
  );
}
