import AdminShell from "@/components/cms/AdminShell";
import NewsForm from "@/components/cms/NewsForm";

export default function NewNewsPage() {
  return (
    <AdminShell title="New story">
      <NewsForm mode="create" />
    </AdminShell>
  );
}
