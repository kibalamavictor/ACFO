import PartnerCards from "@/components/PartnerCards";
import styles from "@/app/home.module.css";

export default function Partner() {
  return (
    <section className={styles.partnerSection}>
      <div className={styles.partnerPanel} />

      <div className={styles.partnerLayout}>
        <div className={styles.partnerIntro}>
          <div className={styles.partnerBadge}>
            <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
            Why Partner With ACFO?
          </div>

          <div className={styles.partnerAccent}>
            <img src="/images/partner-accent.svg" alt="" width={40} height={5} />
          </div>

          <h2 className={styles.partnerHeading}>
            Together, We Create Lasting Impact
          </h2>

          <p className={styles.partnerBody}>
            We believe sustainable change happens through meaningful
            partnerships. By working together, we can expand opportunities for
            children and strengthen communities across South Sudan.
          </p>

          <div className={styles.partnerPhoto}>
            <img
              src="/images/partner-photo.jpg"
              alt="Four children smiling and raising their arms outdoors"
              width={413}
              height={416}
            />
          </div>
        </div>

        <PartnerCards />
      </div>

      <div className={styles.partnerWave}>
        <div className={styles.partnerWaveInner}>
          <img
            src="/images/partner-wave.svg"
            alt=""
            width={1236}
            height={240}
          />
        </div>
      </div>
    </section>
  );
}
