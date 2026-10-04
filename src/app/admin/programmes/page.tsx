import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import ProgrammeTable from "@/components/cms/ProgrammeTable";
import { getProgrammes, loadCms } from "@/lib/cms/store";

export default async function AdminProgrammesPage() {
  await loadCms();
  const programmes = getProgrammes();

  return (
    <AdminShell
      title="Programmes"
      action={
        <Link className="cmsBtnLime" href="/admin/programmes/new">
          Add programme
        </Link>
      }
    >
      <ProgrammeTable programmes={programmes} />
    </AdminShell>
  );
}
