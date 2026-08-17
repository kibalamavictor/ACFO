"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/app/home.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/our-programmes", label: "Our Programmes" },
  { href: "/news", label: "News" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (open || y < 8) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      if (y > lastY.current + 6) {
        setHidden(true);
      } else if (y < lastY.current - 6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={`${styles.header} ${open ? styles.headerOpen : ""} ${
        hidden ? styles.headerHidden : ""
      }`}
    >
      <Link href="/" className={styles.logo} aria-label="ACFO home">
        <img
          className={styles.wordmark}
          src="/images/acfo-wordmark.svg"
          alt=""
          width={76.3145}
          height={37.1965}
        />
        <img
          className={styles.mark}
          src="/images/acfo-mark.svg"
          alt=""
          width={42.5174}
          height={37.1917}
        />
      </Link>

      <nav className={styles.links} aria-label="Primary">
        {NAV_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/contact-us" className={styles.contact}>
        Contact Us
      </Link>

      <Link href="/donate" className={styles.donate}>
        Donate
      </Link>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      <nav className={styles.mobileMenu} aria-label="Mobile">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact-us"
          className={styles.mobileContact}
          onClick={() => setOpen(false)}
        >
          Contact Us
        </Link>
        <Link
          href="/donate"
          className={styles.mobileDonate}
          onClick={() => setOpen(false)}
        >
          Donate
        </Link>
      </nav>
    </header>
  );
}
