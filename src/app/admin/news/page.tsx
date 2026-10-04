import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import NewsTable from "@/components/cms/NewsTable";
import { getNews, loadCms } from "@/lib/cms/store";

export default async function AdminNewsPage() {
  await loadCms();
  const stories = getNews();

  return (
    <AdminShell
      title="News"
      action={
        <Link className="cmsBtnLime" href="/admin/news/new">
          Add story
        </Link>
      }
    >
      <NewsTable stories={stories} />
    </AdminShell>
  );
}
