import { notFound } from "next/navigation";
import AdminShell from "@/components/cms/AdminShell";
import NewsForm from "@/components/cms/NewsForm";
import { getNews } from "@/lib/cms/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditNewsPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getNews().find((item) => item.slug === slug);

  if (!story) {
    notFound();
  }

  return (
    <AdminShell title="Edit story">
      <NewsForm mode="edit" story={story} />
    </AdminShell>
  );
}
