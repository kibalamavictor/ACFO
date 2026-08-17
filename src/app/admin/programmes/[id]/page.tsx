import { notFound } from "next/navigation";
import AdminShell from "@/components/cms/AdminShell";
import ProgrammeForm from "@/components/cms/ProgrammeForm";
import { getProgrammes } from "@/lib/cms/store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProgrammePage({ params }: PageProps) {
  const { id } = await params;
  const programme = getProgrammes().find((item) => item.id === id);

  if (!programme) {
    notFound();
  }

  return (
    <AdminShell title="Edit programme">
      <ProgrammeForm mode="edit" programme={programme} />
    </AdminShell>
  );
}
