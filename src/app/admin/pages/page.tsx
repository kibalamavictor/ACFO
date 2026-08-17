import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import { PAGE_DEFS } from "@/lib/cms/pages";

export default function AdminPagesPage() {
  return (
    <AdminShell title="Pages">
      <div className="cmsGrid">
        {PAGE_DEFS.map((page) => (
          <Link className="cmsStat" href={`/admin/pages/${page.id}`} key={page.id}>
            <span>{page.title}</span>
            <strong>{page.sections.length}</strong>
            <p>
              {page.sections.length} section{page.sections.length === 1 ? "" : "s"} · {page.href}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
