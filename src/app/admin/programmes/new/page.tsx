import AdminShell from "@/components/cms/AdminShell";
import ProgrammeForm from "@/components/cms/ProgrammeForm";

export default function NewProgrammePage() {
  return (
    <AdminShell title="New programme">
      <ProgrammeForm mode="create" />
    </AdminShell>
  );
}
