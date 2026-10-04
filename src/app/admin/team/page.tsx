import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import TeamTable from "@/components/cms/TeamTable";
import { getTeam, loadCms } from "@/lib/cms/store";

export default async function AdminTeamPage() {
  await loadCms();
  const members = getTeam();

  return (
    <AdminShell
      title="Team"
      action={
        <Link className="cmsBtnLime" href="/admin/team/new">
          Add member
        </Link>
      }
    >
      <TeamTable members={members} />
    </AdminShell>
  );
}
