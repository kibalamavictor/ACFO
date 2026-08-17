import Link from "next/link";
import AdminShell from "@/components/cms/AdminShell";
import NewsTable from "@/components/cms/NewsTable";
import { getNews } from "@/lib/cms/store";

export default function AdminNewsPage() {
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
