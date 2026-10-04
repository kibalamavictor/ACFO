import AdminShell from "@/components/cms/AdminShell";
import SettingsForm from "@/components/cms/SettingsForm";
import { getSettings, loadCms } from "@/lib/cms/store";

export default async function AdminSettingsPage() {
  await loadCms();
  const settings = getSettings();

  return (
    <AdminShell title="Settings">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
