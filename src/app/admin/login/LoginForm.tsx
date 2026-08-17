"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(result?.error || "Email or password is not correct.");
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
      setSaving(false);
    }
  };

  return (
    <div className="cmsLogin">
      <header className="cmsLoginHeader">
        <Link href="/" className="cmsLogo" aria-label="ACFO home">
          <img src="/images/acfo-wordmark.svg" alt="" width={76} height={37} />
          <img src="/images/acfo-mark.svg" alt="" width={43} height={37} />
        </Link>
        <Link href="/" className="cmsBtnWhite">
          Back to website
        </Link>
      </header>

      <section className="cmsLoginPanel">
        <div className="cmsBadge">
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Website CMS
        </div>
        <h1>Sign in to manage ACFO</h1>
        <p>
          Update news, team, programmes, and contact details using the same
          language and colours as the public website.
        </p>

        <form onSubmit={(event) => void onSubmit(event)}>
          {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="cmsBtnLime" type="submit" disabled={saving}>
            {saving ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
