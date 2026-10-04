import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/cms/session";
import AdminLoginPage from "./LoginForm";

function LoginFallback() {
  return (
    <div className="cmsLogin">
      <header className="cmsLoginHeader">
        <Link href="/" className="cmsLogo" aria-label="ACFO home">
          <img src="/images/acfo-logo-header.png" alt="" width={116} height={37} />
        </Link>
      </header>
    </div>
  );
}

export default async function Page() {
  if (await getCurrentUser()) {
    redirect("/admin");
  }

  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginPage />
    </Suspense>
  );
}
