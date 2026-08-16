"use client";

import { FormEvent } from "react";
import styles from "@/app/news.module.css";

export default function NewsConnect() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className={styles.connect}>
      <div className={styles.connectPanel} />
      <div className={styles.connectWave} aria-hidden="true" />

      <h2 className={styles.connectHeading}>Stay Connected With Our Work</h2>

      <p className={styles.connectBody}>
        Get the latest stories, programme updates, and news from ACFO delivered
        to your inbox.
      </p>

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
