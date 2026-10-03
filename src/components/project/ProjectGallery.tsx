import styles from "@/app/project.module.css";

const BASE_TOP = 3043;

const TILES = [
  { src: "/images/programme-education.webp", alt: "Children in a classroom", left: 22, top: 3104, width: 598, height: 362 },
  { src: "/images/community-1.webp", alt: "", left: 640, top: 3104, width: 199, height: 178 },
  { src: "/images/programme-protection.webp", alt: "Children outdoors", left: 859, top: 3104, width: 399, height: 362 },
  { src: "/images/community-2.webp", alt: "", left: 639, top: 3297, width: 199, height: 169 },
  { src: "/images/about-photo.webp", alt: "", left: 22, top: 3484, width: 194, height: 195 },
  { src: "/images/community-3.webp", alt: "", left: 228, top: 3484, width: 194, height: 195 },
  { src: "/images/partner-photo.webp", alt: "", left: 438, top: 3483, width: 194, height: 195 },
  { src: "/images/community-4.webp", alt: "", left: 648, top: 3483, width: 194, height: 195 },
  { src: "/images/programme-livelihoods.webp", alt: "", left: 854, top: 3483, width: 194, height: 195 },
  { src: "/images/community-5.webp", alt: "", left: 1064, top: 3483, width: 194, height: 195 },
] as const;

export default function ProjectGallery({ topOffset }: { topOffset?: number }) {
  const shift = topOffset != null ? topOffset - BASE_TOP : 0;

  return (
    <section className={styles.gallery}>
      <div className={styles.galleryHeader}>
        <img
          className={styles.galleryDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
          style={shift ? { top: 3060 + shift } : undefined}
        />
        <h2
          className={styles.galleryHeading}
          style={shift ? { top: BASE_TOP + shift } : undefined}
        >
          Gallery
        </h2>
      </div>

      <div className={styles.galleryGrid}>
        {TILES.map((tile) => (
          <div
            key={`${tile.left}-${tile.top}`}
            className={styles.galleryTile}
            style={{
              left: tile.left,
              top: tile.top + shift,
              width: tile.width,
              height: tile.height,
            }}
          >
            <img
              src={tile.src}
              alt={tile.alt}
              width={tile.width}
              height={tile.height}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
