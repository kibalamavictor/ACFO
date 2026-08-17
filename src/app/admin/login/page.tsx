import Link from "next/link";
import { Suspense } from "react";
import AdminLoginPage from "./LoginForm";

function LoginFallback() {
  return (
    <div className="cmsLogin">
      <header className="cmsLoginHeader">
        <Link href="/" className="cmsLogo" aria-label="ACFO home">
          <img src="/images/acfo-wordmark.svg" alt="" width={76} height={37} />
          <img src="/images/acfo-mark.svg" alt="" width={43} height={37} />
        </Link>
      </header>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginPage />
    </Suspense>
  );
}
