import Link from "next/link";
import styles from "@/app/project.module.css";

const ACTIVITIES = [
  {
    title: "Education Sponsorship",
    body: "Providing scholarships and education sponsorship for vulnerable children and young people.",
    titleTop: 1133,
    bodyTop: 1172,
    titleWidth: 221,
  },
  {
    title: "Early Childhood Development",
    body: "Supporting Early Childhood Care and Development to give children a strong foundation for learning.",
    titleTop: 1252,
    bodyTop: 1291,
    titleWidth: 282,
  },
  {
    title: "Learning Materials",
    body: "Providing essential scholastic materials to help children participate effectively in school.",
    titleTop: 1361,
    bodyTop: 1400,
    titleWidth: 177,
  },
  {
    title: "Girls' Education",
    body: "Supporting girls' education, including the provision of dignity kits.",
    titleTop: 1476,
    bodyTop: 1515,
    titleWidth: 150,
  },
  {
    title: "Psychosocial & Peace Education",
    body: "Promoting wellbeing, peaceful learning environments, and positive relationships in schools.",
    titleTop: 1568,
    bodyTop: 1607,
    titleWidth: 308,
  },
  {
    title: "Community Engagement",
    body: "Working with parents and communities to strengthen participation and support for children's education.",
    titleTop: 1677,
    bodyTop: 1716,
    titleWidth: 239,
  },
] as const;

const SUPPORT_PHOTOS = [
  {
    src: "/images/community-1.jpg",
    left: 816,
    top: 908,
    size: 100,
    rotate: 30,
    zIndex: 3,
  },
  {
    src: "/images/community-3.jpg",
    left: 931,
    top: 942,
    size: 100,
    rotate: 0,
    zIndex: 4,
  },
  {
    src: "/images/community-2.jpg",
    left: 1046,
    top: 914,
    size: 100,
    rotate: -15,
    zIndex: 3,
  },
] as const;

export default function ProjectWhatWeDo() {
  return (
    <section className={styles.whatWeDo}>
      <div className={styles.whatWeDoCopy}>
        <img
          className={styles.sectionDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.sectionHeading}>What We Do</h2>

        <p className={styles.sectionIntro}>
          Our education programme supports children through practical
          interventions that address barriers to learning and encourage stronger
          participation from families and communities.
        </p>

        <div className={styles.sectionPhoto}>
          <img
            src="/images/about-photo.jpg"
            alt="Children supported through education"
            width={537}
            height={334}
          />
        </div>

        <div className={styles.activities}>
          {ACTIVITIES.map((item) => (
            <div key={item.title} className={styles.activity}>
              <h3
                className={styles.activityTitle}
                style={{ top: item.titleTop, width: item.titleWidth }}
              >
                {item.title}
              </h3>
              <p className={styles.activityBody} style={{ top: item.bodyTop }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.support}>
        <div className={styles.supportCard} />
        <div className={styles.supportWave}>
          <div className={styles.supportWaveInner} />
        </div>

        <div className={styles.supportHead}>
          <h3 className={styles.supportHeading}>Help Us Reach More Children</h3>
          <img
            className={styles.supportMap}
            src="/images/africa-map.svg"
            alt=""
            width={112}
            height={120}
          />
        </div>
        <p className={styles.supportBody}>
          Every child supported with education is given an opportunity to build a
          better future.
        </p>

        <div className={styles.supportPhotos}>
          {SUPPORT_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={styles.supportPhoto}
              style={{
                left: photo.left,
                top: photo.top,
                width: photo.size,
                height: photo.size,
                zIndex: photo.zIndex,
                transform: `rotate(${photo.rotate}deg)`,
              }}
            >
              <img src={photo.src} alt="" width={photo.size} height={photo.size} />
            </div>
          ))}
        </div>

        <Link href="/donate" className={styles.supportCta}>
          Support This Programme
        </Link>
      </div>
    </section>
  );
}
