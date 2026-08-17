import AdminShell from "@/components/cms/AdminShell";
import SettingsForm from "@/components/cms/SettingsForm";
import { getSettings } from "@/lib/cms/store";

export default function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <AdminShell title="Settings">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
