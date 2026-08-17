import { notFound } from "next/navigation";
import AdminShell from "@/components/cms/AdminShell";
import PageForm from "@/components/cms/PageForm";
import { getPageDef } from "@/lib/cms/pages";
import { getPages } from "@/lib/cms/store";

type PageProps = {
  params: Promise<{ pageId: string }>;
};

export default async function EditPageContentPage({ params }: PageProps) {
  const { pageId } = await params;
  const page = getPageDef(pageId);

  if (!page) {
    notFound();
  }

  const content = getPages()[page.id];

  return (
    <AdminShell
      title={page.title}
      action={
        <a className="cmsBtnGhost" href={page.href} target="_blank" rel="noreferrer">
          View page
        </a>
      }
    >
      <PageForm page={page} content={content} />
    </AdminShell>
  );
}
