"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/donate.module.css";

const AMOUNTS = ["$10", "$25", "$50", "$100", "$250"] as const;

const PHOTOS = [
  { src: "/images/community-1.jpg", left: 99, top: 816 },
  { src: "/images/community-2.jpg", left: 211, top: 945 },
  { src: "/images/community-3.jpg", left: 989, top: 979 },
  { src: "/images/community-4.jpg", left: 1097, top: 797 },
] as const;

const PAY_METHODS = [
  {
    id: "momo",
    name: "Mobile Money",
    desc: "MTN MoMo, m-Gurush and other local wallets",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="7"
          y="2.5"
          width="10"
          height="19"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <line
          x1="10.5"
          y1="18.5"
          x2="13.5"
          y2="18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    desc: "Visa, Mastercard and other major cards",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="2.5"
          y="5"
          width="19"
          height="14"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <line
          x1="2.5"
          y1="9.5"
          x2="21.5"
          y2="9.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <line
          x1="6"
          y1="14.5"
          x2="10"
          y2="14.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "Donate securely with your PayPal account",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 21L9.5 3h6a4.5 4.5 0 0 1 0 9H11l-1.5 9H7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

type Step = "details" | "payment" | "payDetails" | "done";

export default function DonateForm() {
  const [step, setStep] = useState<Step>("details");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string>("custom");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("momo");
  const [momoProvider, setMomoProvider] = useState<"mtn" | "mgurush">("mtn");
  const [momoNumber, setMomoNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardZip, setCardZip] = useState<string>("");
  const [paypalEmail, setPaypalEmail] = useState<string>("");

  const isCustom = amount === "custom";
  const amountLabel = isCustom ? `$${customAmount || "0"}` : amount;
  const frequencyLabel = frequency === "once" ? "One-time" : "Monthly";

  const detailsValid =
    (!isCustom || Number(customAmount) > 0) &&
    fullName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email);

  const payDetailsValid =
    payMethod === "momo"
      ? momoNumber.trim().length > 0
      : payMethod === "card"
        ? cardName.trim().length > 0 &&
          cardNumber.trim().length > 0 &&
          cardExpiry.trim().length > 0 &&
          cardCvv.trim().length > 0 &&
          cardZip.trim().length > 0
        : /\S+@\S+\.\S+/.test(paypalEmail);

  const payMethodName =
    PAY_METHODS.find((method) => method.id === payMethod)?.name ?? "";

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
        Choose an amount and help us reach more children across South Sudan.
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
              if (detailsValid) setStep("payment");
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
              DONATE NOW
              <img
                src="/images/contact-form-arrow.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </form>
        ) : null}

        {step === "payment" ? (
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
                <span className={styles.summaryValue}>{amountLabel}</span>
              </div>

              <div className={styles.fieldWide}>
                <span className={styles.fieldLabel}>
                  Choose a payment method
                </span>
                <div className={styles.payList}>
                  {PAY_METHODS.map((method) => {
                    const active = payMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        className={
                          active ? styles.payOptionActive : styles.payOption
                        }
                        onClick={() => setPayMethod(method.id)}
                      >
                        <span className={styles.payIcon}>{method.icon}</span>
                        <span className={styles.payText}>
                          <span className={styles.payName}>{method.name}</span>
                          <span className={styles.payDesc}>{method.desc}</span>
                        </span>
                        <span
                          className={
                            active ? styles.payRadioActive : styles.payRadio
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              className={styles.submit}
              type="button"
              onClick={() => setStep("payDetails")}
            >
              CONTINUE TO PAYMENT
              <img
                src="/images/contact-form-arrow.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
        ) : null}

        {step === "payDetails" ? (
          <form
            className={styles.formCard}
            onSubmit={(event) => {
              event.preventDefault();
              if (payDetailsValid) setStep("done");
            }}
          >
            <button
              type="button"
              className={styles.backLink}
              onClick={() => setStep("payment")}
            >
              &larr; Back
            </button>

            <div className={styles.formFields}>
              <div className={styles.summary}>
                <span className={styles.summaryLabel}>
                  {frequencyLabel} donation &middot; {payMethodName}
                </span>
                <span className={styles.summaryValue}>{amountLabel}</span>
              </div>

              {payMethod === "momo" ? (
                <>
                  <div className={styles.fieldWide}>
                    <span className={styles.fieldLabel}>
                      Choose your provider
                    </span>
                    <div className={styles.freqRow}>
                      <button
                        type="button"
                        className={
                          momoProvider === "mtn"
                            ? styles.freqActive
                            : styles.freq
                        }
                        onClick={() => setMomoProvider("mtn")}
                      >
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        className={
                          momoProvider === "mgurush"
                            ? styles.freqActive
                            : styles.freq
                        }
                        onClick={() => setMomoProvider("mgurush")}
                      >
                        m-Gurush
                      </button>
                    </div>
                  </div>

                  <label className={styles.fieldWide}>
                    <span className={styles.fieldLabel}>
                      Mobile money number
                    </span>
                    <span className={styles.inputWrap}>
                      <span className={styles.phonePrefix}>
                        <img
                          src="/images/flag-ss.svg"
                          alt=""
                          width={29}
                          height={20}
                        />
                        <img
                          src="/images/contact-form-caret.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                      </span>
                      <input
                        className={styles.input}
                        type="tel"
                        name="momoNumber"
                        placeholder="+211 9X XXX XXXX"
                        autoComplete="tel"
                        value={momoNumber}
                        onChange={(event) => setMomoNumber(event.target.value)}
                      />
                    </span>
                  </label>

                  <p className={styles.payNote}>
                    You will receive a prompt on your phone to approve the
                    payment of {amountLabel}.
                  </p>
                </>
              ) : null}

              {payMethod === "card" ? (
                <>
                  <label className={styles.fieldWide}>
                    <span className={styles.fieldLabel}>Name on card</span>
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
                        name="cardName"
                        placeholder="Enter name on card"
                        autoComplete="cc-name"
                        value={cardName}
                        onChange={(event) => setCardName(event.target.value)}
                      />
                    </span>
                  </label>

                  <label className={styles.fieldWide}>
                    <span className={styles.fieldLabel}>Card number</span>
                    <span className={styles.inputWrap}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={styles.payFieldIcon}
                      >
                        <rect
                          x="2.5"
                          y="5"
                          width="19"
                          height="14"
                          rx="2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <line
                          x1="2.5"
                          y1="9.5"
                          x2="21.5"
                          y2="9.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                      <input
                        className={styles.input}
                        type="text"
                        inputMode="numeric"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(event) => setCardNumber(event.target.value)}
                      />
                    </span>
                  </label>

                  <div className={styles.formRow}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Expiry date</span>
                      <span className={styles.inputWrap}>
                        <input
                          className={styles.input}
                          type="text"
                          inputMode="numeric"
                          name="cardExpiry"
                          placeholder="MM / YY"
                          autoComplete="cc-exp"
                          maxLength={7}
                          value={cardExpiry}
                          onChange={(event) =>
                            setCardExpiry(event.target.value)
                          }
                        />
                      </span>
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>CVV</span>
                      <span className={styles.inputWrap}>
                        <input
                          className={styles.input}
                          type="password"
                          inputMode="numeric"
                          name="cardCvv"
                          placeholder="123"
                          autoComplete="cc-csc"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(event) => setCardCvv(event.target.value)}
                        />
                      </span>
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>
                        Billing zip code
                      </span>
                      <span className={styles.inputWrap}>
                        <input
                          className={styles.input}
                          type="text"
                          inputMode="numeric"
                          name="cardZip"
                          placeholder="Enter zip code"
                          autoComplete="postal-code"
                          maxLength={10}
                          value={cardZip}
                          onChange={(event) => setCardZip(event.target.value)}
                        />
                      </span>
                    </label>
                  </div>
                </>
              ) : null}

              {payMethod === "paypal" ? (
                <>
                  <label className={styles.fieldWide}>
                    <span className={styles.fieldLabel}>PayPal email</span>
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
                        name="paypalEmail"
                        placeholder="Enter your PayPal email"
                        autoComplete="email"
                        value={paypalEmail}
                        onChange={(event) => setPaypalEmail(event.target.value)}
                      />
                    </span>
                  </label>

                  <p className={styles.payNote}>
                    You will be redirected to PayPal to complete your donation
                    of {amountLabel} securely.
                  </p>
                </>
              ) : null}
            </div>

            <button
              className={
                payDetailsValid
                  ? styles.submit
                  : `${styles.submit} ${styles.submitDisabled}`
              }
              type="submit"
              disabled={!payDetailsValid}
            >
              CONFIRM DONATION
              <img
                src="/images/contact-form-arrow.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </form>
        ) : null}

        {step === "done" ? (
          <div className={styles.formCard}>
            <svg
              className={styles.doneIcon}
              viewBox="0 0 88 88"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="44" cy="44" r="44" fill="#02B702" />
              <path
                d="M28 45.5L39 56.5L60 34"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h3 className={styles.doneHeading}>
              Thank You for Your Generosity!
            </h3>
            <p className={styles.doneBody}>
              We&apos;ve received your {frequencyLabel.toLowerCase()} donation
              pledge of {amountLabel}. A confirmation and receipt will be sent
              to {email} once the payment is completed.
            </p>

            <div className={styles.doneActions}>
              <button
                className={styles.submit}
                type="button"
                onClick={() => {
                  setStep("details");
                  setAmount("custom");
                  setCustomAmount("");
                }}
              >
                DONATE AGAIN
              </button>
              <Link className={styles.doneSecondary} href="/">
                BACK TO HOME
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.formWave} aria-hidden="true">
        <div className={styles.formWaveInner} />
      </div>
    </section>
  );
}
