"use client";

import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import home from "@/app/home.module.css";
import styles from "@/app/programmes.module.css";

const PHOTO = 97;
const ORBIT_DURATION = 48;

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

const ORBITS = {
  left: { cx: 180, cy: 175, r: 100, direction: 1 },
  right: { cx: 500, cy: 160, r: 100, direction: -1 },
};

function OrbitingPortrait({
  src,
  alt,
  orbit,
  angle,
}: (typeof PORTRAITS)[number]) {
  const reduceMotion = useReducedMotion();
  const { cx, cy, r, direction } = ORBITS[orbit];
  const x = useMotionValue(cx + r * Math.cos(angle));
  const y = useMotionValue(cy + r * Math.sin(angle));

  useAnimationFrame((t) => {
    const turn =
      angle +
      (reduceMotion ? 0 : (direction * (t / 1000) * Math.PI * 2) / ORBIT_DURATION);
    x.set(cx + r * Math.cos(turn));
    y.set(cy + r * Math.sin(turn));
  });

  return (
    <motion.button
      type="button"
      className={home.communityPhoto}
      style={{ x, y }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.22, zIndex: 5 }}
      aria-label={alt}
    >
      <img src={src} alt="" width={PHOTO} height={PHOTO} />
    </motion.button>
  );
}

export default function ProgrammesCommunity({ top }: { top?: number }) {
  return (
    <div
      className={`${home.communityStage} ${styles.communityStage}`}
      style={{
        height: 531,
        ...(top !== undefined ? { top } : {}),
      }}
    >
      <div className={home.communityWash} />
      <div className={`${home.communityWave} ${styles.communityWave}`}>
        <div
          className={`${home.communityWaveInner} ${styles.communityWaveInner}`}
        />
      </div>

      <div className={styles.communityOrbit}>
        {PORTRAITS.map((portrait) => (
          <OrbitingPortrait key={portrait.src} {...portrait} />
        ))}
      </div>

      <div className={styles.communityCopy}>
        <div className={styles.communityBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Join Our Community
        </div>

        <h2 className={styles.communityHeading}>Be Part of the Change</h2>

        <p className={styles.communityBody}>
          Whether through partnership, funding, advocacy, or community
          participation, your support can help us expand opportunities and create
          lasting change for children and families.
        </p>

        <Link href="/donate" className={styles.communityCta}>
          Support Our Work
        </Link>
      </div>
    </div>
  );
}
