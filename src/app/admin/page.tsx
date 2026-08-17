import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import { PAGE_DEFS } from "@/lib/cms/pages";
import { getSiteContent } from "@/lib/cms/store";

export default function AdminDashboardPage() {
  const content = getSiteContent();
  const published = content.news.filter((story) => story.published).length;

  return (
    <AdminShell title="Dashboard">
      <div className="cmsGrid">
        <Link className="cmsStat" href="/admin/pages">
          <span>Website pages</span>
          <strong>{PAGE_DEFS.length}</strong>
          <p>Edit copy section by section</p>
        </Link>
        <Link className="cmsStat" href="/admin/news">
          <span>News stories</span>
          <strong>{content.news.length}</strong>
          <p>{published} published</p>
        </Link>
        <Link className="cmsStat" href="/admin/team">
          <span>Team members</span>
          <strong>{content.team.length}</strong>
        </Link>
        <Link className="cmsStat" href="/admin/programmes">
          <span>Programmes</span>
          <strong>{content.programmes.length}</strong>
        </Link>
        <Link className="cmsStat" href="/admin/settings">
          <span>Contact</span>
          <strong>{content.settings.email}</strong>
        </Link>
      </div>

      <p className="cmsNote">
        Changes are saved as JSON files in this project and appear on the
        website immediately in local development. On serverless hosts such as
        Vercel, file writes do not persist across deploys — keep a local copy
        of `content/*.json` or connect a database if you need production
        editing.
      </p>
    </AdminShell>
  );
}
