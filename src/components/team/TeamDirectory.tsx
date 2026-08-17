import { getTeamByCategory } from "@/lib/cms/public";
import { getTeam } from "@/lib/cms/store";
import styles from "@/app/team.module.css";

export default function TeamDirectory() {
  const groups = getTeamByCategory(getTeam());

  return (
    <div className={styles.directory}>
      {groups.map((group) => (
        <section
          key={group.id}
          className={styles.group}
          aria-labelledby={`team-${group.id}`}
        >
          <h2 id={`team-${group.id}`} className={styles.groupHeading}>
            {group.label}
          </h2>

          <div className={styles.grid}>
            {group.members.map((member) => (
              <article key={member.id} className={styles.card}>
                <div className={styles.photo}>
                  <img
                    src={member.photo}
                    alt={member.photoAlt}
                    width={294}
                    height={355}
                  />
                </div>
                <div className={styles.meta}>
                  <div className={styles.copy}>
                    <p className={styles.name}>{member.name}</p>
                    <p className={styles.title}>{member.title}</p>
                  </div>
                  <div
                    className={styles.social}
                    aria-label={`${member.name} social links`}
                  >
                    <a
                      className={styles.socialLink}
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      style={{
                        maskImage: 'url("/images/footer-linkedin.svg")',
                        WebkitMaskImage: 'url("/images/footer-linkedin.svg")',
                      }}
                    />
                    <a
                      className={styles.socialLink}
                      href={member.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Instagram`}
                      style={{
                        maskImage: 'url("/images/footer-instagram.svg")',
                        WebkitMaskImage: 'url("/images/footer-instagram.svg")',
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
