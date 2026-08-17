import { redirect } from "next/navigation";
import AdminShell from "@/components/cms/AdminShell";
import EditorsManager from "@/components/cms/EditorsManager";
import { getCurrentUser } from "@/lib/cms/session";
import { getUsers, toPublicUser } from "@/lib/cms/users";

export default async function AdminEditorsPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") {
    redirect("/admin");
  }

  return (
    <AdminShell title="Editors">
      <EditorsManager
        users={getUsers().map(toPublicUser)}
        currentUserId={me.id}
      />
    </AdminShell>
  );
}
