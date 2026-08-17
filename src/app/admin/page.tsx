import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import { PAGE_DEFS } from "@/lib/cms/pages";
import { getCurrentUser } from "@/lib/cms/session";
import { getSiteContent } from "@/lib/cms/store";
import { getUsers } from "@/lib/cms/users";

export default async function AdminDashboardPage() {
  const content = getSiteContent();
  const published = content.news.filter((story) => story.published).length;
  const user = await getCurrentUser();
  const editors = user?.role === "admin" ? getUsers().length : 0;

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
        {user?.role === "admin" ? (
          <Link className="cmsStat" href="/admin/editors">
            <span>Editors</span>
            <strong>{editors}</strong>
            <p>People who can manage the CMS</p>
          </Link>
        ) : null}
      </div>
    </AdminShell>
  );
}
