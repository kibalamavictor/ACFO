"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCmsSession } from "@/components/cms/CmsSession";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/programmes", label: "Programmes" },
  { href: "/admin/editors", label: "Editors", adminOnly: true },
  { href: "/admin/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCmsSession();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const links = LINKS.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  const logout = async () => {
    setLeaving(true);
    await fetch("/api/cms/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="cmsShell">
      <header className="cmsTopbar">
        <Link href="/admin" className="cmsLogo" aria-label="ACFO CMS home">
          <img src="/images/acfo-wordmark.svg" alt="" width={76} height={37} />
          <img src="/images/acfo-mark.svg" alt="" width={43} height={37} />
        </Link>

        <span className="cmsBadge">
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Website CMS
        </span>

        <nav className="cmsTopLinks" aria-label="CMS">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "isActive" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="cmsTopGhost" target="_blank">
          View site
        </Link>
        <button
          className="cmsTopLime"
          type="button"
          onClick={() => void logout()}
          disabled={leaving}
        >
          {leaving ? "Signing out…" : "Sign out"}
        </button>

        <button
          className="cmsMenu"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {open ? (
        <nav className="cmsMobileNav" aria-label="CMS mobile">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" onClick={() => setOpen(false)}>
            View site
          </Link>
          <button type="button" onClick={() => void logout()}>
            Sign out
          </button>
        </nav>
      ) : null}

      <div className="cmsBody">
        <aside className="cmsSidebar">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "isActive" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main className="cmsMain">
          <div className="cmsPageHead">
            <h1>{title}</h1>
            {action}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
