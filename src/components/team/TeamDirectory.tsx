import { teamMembers } from "@/data/team";
import styles from "@/app/team.module.css";

export default function TeamDirectory() {
  return (
    <section className={styles.directory} aria-label="All team members">
      {teamMembers.map((member) => (
        <article key={member.id} className={styles.card}>
          <div className={styles.photo}>
            <img
              src={member.photo}
              alt={member.photoAlt}
              width={294}
              height={355}
            />
          </div>
          <p className={styles.name}>{member.name}</p>
          <p className={styles.title}>{member.title}</p>
        </article>
      ))}
    </section>
  );
}
