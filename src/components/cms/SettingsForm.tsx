"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/cms/types";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<SiteSettings>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not save settings");
      }
      setSaved(true);
      window.dispatchEvent(new Event("acfo-cms-updated"));
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save settings",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="cmsForm" onSubmit={(event) => void onSubmit(event)}>
      {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}
      {saved ? (
        <p className="cmsBanner cmsBannerOk">Contact details updated.</p>
      ) : null}

      <label className="cmsField">
        <span>Organisation name</span>
        <input
          value={draft.orgName}
          onChange={(event) => update({ orgName: event.target.value })}
        />
      </label>

      <label className="cmsField">
        <span>Footer description</span>
        <textarea
          rows={4}
          value={draft.blurb}
          onChange={(event) => update({ blurb: event.target.value })}
        />
      </label>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Phone</span>
          <input
            value={draft.phone}
            onChange={(event) => update({ phone: event.target.value })}
          />
        </label>
        <label className="cmsField">
          <span>Email</span>
          <input
            type="email"
            value={draft.email}
            onChange={(event) => update({ email: event.target.value })}
          />
        </label>
      </div>

      <label className="cmsField">
        <span>Address</span>
        <input
          value={draft.address}
          onChange={(event) => update({ address: event.target.value })}
        />
      </label>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Maps URL</span>
          <input
            value={draft.mapsUrl}
            onChange={(event) => update({ mapsUrl: event.target.value })}
          />
        </label>
        <label className="cmsField">
          <span>WhatsApp URL</span>
          <input
            value={draft.whatsapp}
            onChange={(event) => update({ whatsapp: event.target.value })}
          />
        </label>
      </div>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Instagram</span>
          <input
            value={draft.instagram}
            onChange={(event) => update({ instagram: event.target.value })}
          />
        </label>
        <label className="cmsField">
          <span>X</span>
          <input
            value={draft.x}
            onChange={(event) => update({ x: event.target.value })}
          />
        </label>
      </div>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>LinkedIn</span>
          <input
            value={draft.linkedin}
            onChange={(event) => update({ linkedin: event.target.value })}
          />
        </label>
        <label className="cmsField">
          <span>Facebook</span>
          <input
            value={draft.facebook}
            onChange={(event) => update({ facebook: event.target.value })}
          />
        </label>
      </div>

      <div className="cmsActions">
        <button className="cmsBtnLime" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
