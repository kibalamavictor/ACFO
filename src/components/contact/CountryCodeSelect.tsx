"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  DEFAULT_COUNTRY,
  filterCountries,
  flagEmoji,
  type Country,
} from "@/lib/countries";
import styles from "@/app/contact.module.css";

type CountryCodeSelectProps = {
  value?: Country;
  onChange?: (country: Country) => void;
};

function Flag({ iso, name }: { iso: string; name: string }) {
  if (iso === "ss") {
    return <img src="/images/flag-ss.svg" alt="" width={29} height={20} />;
  }

  return (
    <span className={styles.flagEmoji} role="img" aria-label={name}>
      {flagEmoji(iso)}
    </span>
  );
}

export default function CountryCodeSelect({
  value = DEFAULT_COUNTRY,
  onChange,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const countries = useMemo(() => filterCountries(query), [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    searchRef.current?.focus();

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.phoneSelect} ref={rootRef}>
      <button
        type="button"
        className={styles.phonePrefix}
        aria-label={`Country code ${value.name} ${value.dial}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setQuery("");
          setOpen((current) => !current);
        }}
      >
        <Flag iso={value.iso} name={value.name} />
        <span className={styles.phoneDial}>{value.dial}</span>
        <img src="/images/contact-form-caret.svg" alt="" width={16} height={16} />
      </button>

      <input type="hidden" name="phoneCountry" value={value.iso.toUpperCase()} />
      <input type="hidden" name="phoneCode" value={value.dial} />

      {open ? (
        <div className={styles.countryMenu} id={listId} role="listbox">
          <input
            ref={searchRef}
            className={styles.countrySearch}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country"
            aria-label="Search country"
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }
              event.preventDefault();
              const first = countries[0];
              if (first) {
                onChange?.(first);
                setOpen(false);
                setQuery("");
              }
            }}
          />
          <div className={styles.countryList}>
            {countries.length === 0 ? (
              <p className={styles.countryEmpty}>No countries match that search.</p>
            ) : (
              countries.map((country) => (
                <button
                  key={country.iso}
                  type="button"
                  role="option"
                  aria-selected={country.iso === value.iso}
                  className={
                    country.iso === value.iso
                      ? styles.countryOptionActive
                      : styles.countryOption
                  }
                  onClick={() => {
                    onChange?.(country);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <Flag iso={country.iso} name={country.name} />
                  <span className={styles.countryName}>{country.name}</span>
                  <span className={styles.countryCode}>{country.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
