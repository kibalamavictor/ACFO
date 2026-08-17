import AdminShell from "@/components/cms/AdminShell";
import TeamForm from "@/components/cms/TeamForm";

export default function NewTeamPage() {
  return (
    <AdminShell title="New team member">
      <TeamForm mode="create" />
    </AdminShell>
  );
}
