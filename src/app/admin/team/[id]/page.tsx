import { notFound } from "next/navigation";
import AdminShell from "@/components/cms/AdminShell";
import TeamForm from "@/components/cms/TeamForm";
import { getTeam } from "@/lib/cms/store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTeamPage({ params }: PageProps) {
  const { id } = await params;
  const member = getTeam().find((item) => item.id === id);

  if (!member) {
    notFound();
  }

  return (
    <AdminShell title="Edit team member">
      <TeamForm mode="edit" member={member} />
    </AdminShell>
  );
}
