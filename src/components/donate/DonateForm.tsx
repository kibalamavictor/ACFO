"use client";

import { useState } from "react";
import Link from "next/link";
import { ACFO_BANK, donationReference } from "@/lib/donate/bank";
import styles from "@/app/donate.module.css";

const AMOUNTS = ["$10", "$25", "$50", "$100", "$250"] as const;

const PHOTOS = [
  { src: "/images/community-1.webp", left: 99, top: 816 },
  { src: "/images/community-2.webp", left: 211, top: 945 },
  { src: "/images/community-3.webp", left: 989, top: 979 },
  { src: "/images/community-4.webp", left: 1097, top: 797 },
] as const;

const LOCAL_DETAILS = [
  ["Account name", ACFO_BANK.accountName],
  ["Account number", ACFO_BANK.accountNumber],
  ["Currency", ACFO_BANK.currency],
  ["Bank", ACFO_BANK.bank],
  ["Branch", ACFO_BANK.branch],
] as const;

const SWIFT_DETAILS = [
  ["Correspondent bank", ACFO_BANK.correspondent],
  ["Beneficiary bank", ACFO_BANK.beneficiaryBank],
  ["Bank branch and address", ACFO_BANK.branch],
  ["SWIFT code", ACFO_BANK.swift],
] as const;

type Step = "details" | "transfer";

export default function DonateForm() {
  const [step, setStep] = useState<Step>("details");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string>("custom");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [copied, setCopied] = useState<string>("");

  const isCustom = amount === "custom";
  const amountLabel = isCustom ? `$${customAmount || "0"}` : amount;
  const frequencyLabel = frequency === "once" ? "One-time" : "Monthly";

  const detailsValid =
    (!isCustom || Number(customAmount) > 0) &&
    fullName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email);

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("");
    }
  };

  const transferText = [
    `Donation reference: ${reference}`,
    `Amount: ${amountLabel} USD`,
    `Donor: ${fullName.trim()}`,
    ...LOCAL_DETAILS.map(([label, value]) => `${label}: ${value}`),
    ...SWIFT_DETAILS.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");

  return (
    <section className={styles.formSection}>
      <img
        className={styles.formMap}
        src="/images/contact-form-africa.svg"
        alt=""
        width={758}
        height={809}
      />

      <div className={styles.formBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        Make a Donation
      </div>

      <h2 className={styles.formHeading}>Support a Child Today</h2>
      <p className={styles.formBody}>
        Choose an amount, then send it by bank transfer to ACFO&apos;s Ecobank
        account in US dollars.
      </p>

      {PHOTOS.map((photo) => (
        <div
          key={photo.src}
          className={styles.formPhoto}
          style={{ left: photo.left, top: photo.top }}
        >
          <img src={photo.src} alt="" width={97} height={97} />
        </div>
      ))}

      <div className={styles.formCardWrap}>
        <div className={styles.formGlow} />

        {step === "details" ? (
          <form
            className={styles.formCard}
            onSubmit={(event) => {
              event.preventDefault();
              if (!detailsValid) return;
              setReference(donationReference());
              setCopied("");
              setStep("transfer");
            }}
          >
            <div className={styles.formFields}>
              <div className={styles.fieldWide}>
                <span className={styles.fieldLabel}>Donation type</span>
                <div className={styles.freqRow}>
                  <button
                    type="button"
                    className={
                      frequency === "once" ? styles.freqActive : styles.freq
                    }
                    onClick={() => setFrequency("once")}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    className={
                      frequency === "monthly" ? styles.freqActive : styles.freq
                    }
                    onClick={() => setFrequency("monthly")}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className={styles.fieldWide}>
                <span className={styles.fieldLabel}>Choose an amount</span>
                <div className={styles.amountRow}>
                  {AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        amount === value ? styles.amountActive : styles.amount
                      }
                      onClick={() => setAmount(value)}
                    >
                      {value}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={isCustom ? styles.amountActive : styles.amount}
                    onClick={() => setAmount("custom")}
                  >
                    Custom
                  </button>
                </div>
                {isCustom ? (
                  <span className={styles.inputWrap}>
                    <span className={styles.customPrefix}>$</span>
                    <input
                      className={styles.input}
                      type="number"
                      name="customAmount"
                      min={1}
                      step={1}
                      placeholder="Enter your preferred amount"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                    />
                  </span>
                ) : null}
              </div>

              <div className={styles.formRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Full name</span>
                  <span className={styles.inputWrap}>
                    <img
                      src="/images/contact-form-user.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    <input
                      className={styles.input}
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </span>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>E-mail</span>
                  <span className={styles.inputWrap}>
                    <img
                      src="/images/contact-form-mail.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </span>
                </label>
              </div>
            </div>

            <button
              className={
                detailsValid
                  ? styles.submit
                  : `${styles.submit} ${styles.submitDisabled}`
              }
              type="submit"
              disabled={!detailsValid}
            >
              CONTINUE
              <img
                src="/images/contact-form-arrow.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </form>
        ) : (
          <div className={styles.formCard}>
            <button
              type="button"
              className={styles.backLink}
              onClick={() => setStep("details")}
            >
              &larr; Back
            </button>

            <div className={styles.formFields}>
              <div className={styles.summary}>
                <span className={styles.summaryLabel}>
                  {frequencyLabel} donation
                </span>
                <span className={styles.summaryValue}>{amountLabel} USD</span>
              </div>

              <p className={styles.payNote}>
                {`Send the amount from your bank to the account below. Include the reference in the transfer description so ACFO can match your gift${fullName.trim() ? ` to ${fullName.trim()}` : ""}. Nothing is charged on this page.`}
              </p>

              {frequency === "monthly" ? (
                <p className={styles.payNote}>
                  Monthly is not an automatic debit. Send this amount again
                  each month and use the same reference.
                </p>
              ) : null}

              <div className={styles.bankBlock}>
                <div className={styles.bankRow}>
                  <span className={styles.bankLabel}>Your reference</span>
                  <span className={styles.bankValue}>{reference}</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => void copyValue("reference", reference)}
                  >
                    {copied === "reference" ? "Copied" : "Copy"}
                  </button>
                </div>
                {LOCAL_DETAILS.map(([label, value]) => (
                  <div className={styles.bankRow} key={label}>
                    <span className={styles.bankLabel}>{label}</span>
                    <span className={styles.bankValue}>{value}</span>
                    {label === "Account number" ? (
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => void copyValue(label, value)}
                      >
                        {copied === label ? "Copied" : "Copy"}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className={styles.fieldWide}>
                <span className={styles.fieldLabel}>
                  International transfer (SWIFT)
                </span>
                <div className={styles.bankBlock}>
                  {SWIFT_DETAILS.map(([label, value]) => (
                    <div className={styles.bankRow} key={label}>
                      <span className={styles.bankLabel}>{label}</span>
                      <span className={styles.bankValue}>{value}</span>
                      {label === "SWIFT code" ? (
                        <button
                          type="button"
                          className={styles.copyBtn}
                          onClick={() => void copyValue(label, value)}
                        >
                          {copied === label ? "Copied" : "Copy"}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <p className={styles.payNote}>
                After the transfer arrives, ACFO can confirm it by email at{" "}
                {email}. Card payments are not available yet.
              </p>
            </div>

            <div className={styles.doneActions}>
              <button
                className={styles.submit}
                type="button"
                onClick={() => void copyValue("all", transferText)}
              >
                {copied === "all" ? "DETAILS COPIED" : "COPY ALL DETAILS"}
              </button>
              <Link className={styles.doneSecondary} href="/">
                BACK TO HOME
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formWave} aria-hidden="true">
        <div className={styles.formWaveInner} />
      </div>
    </section>
  );
}
