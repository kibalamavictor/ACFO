"use client";

import { FormEvent } from "react";
import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/news.module.css";

export default function NewsConnect() {
  const connect = usePage("news").connect;
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className={styles.connect}>
      <div className={styles.connectPanel} />
      <div className={styles.connectWave} aria-hidden="true" />

      <h2 className={styles.connectHeading}>{text(connect.heading)}</h2>

      <p className={styles.connectBody}>{text(connect.body)}</p>

      <form className={styles.connectForm} onSubmit={onSubmit}>
        <input
          className={styles.connectEmail}
          type="email"
          name="email"
          placeholder="Enter Email Address"
          aria-label="Enter Email Address"
          autoComplete="email"
          required
        />
        <button className={styles.connectSubmit} type="submit">
          Subscribe
        </button>
      </form>
    </section>
  );
}
