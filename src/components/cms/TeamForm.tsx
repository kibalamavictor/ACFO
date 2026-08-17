"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/cms/ImageField";
import { teamCategories } from "@/data/team";
import { slugify } from "@/lib/cms/public";
import type { CmsTeamMember } from "@/lib/cms/types";

export default function TeamForm({
  member,
  mode,
}: {
  member?: CmsTeamMember;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [name, setName] = useState(member?.name ?? "");
  const [title, setTitle] = useState(member?.title ?? "");
  const [category, setCategory] = useState(member?.category ?? "leadership");
  const [id, setId] = useState(member?.id ?? "");
  const [idTouched, setIdTouched] = useState(Boolean(member?.id));
  const [photo, setPhoto] = useState(member?.photo ?? "/images/about-photo.jpg");
  const [photoAlt, setPhotoAlt] = useState(member?.photoAlt ?? "");
  const [linkedin, setLinkedin] = useState(member?.linkedin ?? "");
  const [instagram, setInstagram] = useState(member?.instagram ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewId = useMemo(
    () => (idTouched ? id : slugify(`${title}-${name}`)),
    [id, idTouched, name, title],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: CmsTeamMember = {
      id: previewId,
      name: name.trim(),
      title: title.trim(),
      category,
      photo,
      photoAlt: photoAlt.trim() || `Portrait of ${name.trim()}`,
      linkedin: linkedin.trim(),
      instagram: instagram.trim(),
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/cms/team" : `/api/cms/team/${member?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not save team member");
      }
      router.push("/admin/team");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save team member",
      );
      setSaving(false);
    }
  };

  return (
    <form className="cmsForm" onSubmit={(event) => void onSubmit(event)}>
      {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="cmsField">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
      </div>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as CmsTeamMember["category"])
            }
          >
            {teamCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="cmsField">
          <span>ID</span>
          <input
            value={previewId}
            onChange={(event) => {
              setIdTouched(true);
              setId(event.target.value);
            }}
          />
        </label>
      </div>

      <ImageField label="Photo" value={photo} onChange={setPhoto} />

      <label className="cmsField">
        <span>Photo description</span>
        <input
          value={photoAlt}
          onChange={(event) => setPhotoAlt(event.target.value)}
        />
      </label>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>LinkedIn URL</span>
          <input
            value={linkedin}
            onChange={(event) => setLinkedin(event.target.value)}
          />
        </label>
        <label className="cmsField">
          <span>Instagram URL</span>
          <input
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
          />
        </label>
      </div>

      <div className="cmsActions">
        <button className="cmsBtnLime" type="submit" disabled={saving}>
          {saving ? "Saving…" : mode === "create" ? "Add member" : "Save changes"}
        </button>
        <button
          className="cmsBtnGhost"
          type="button"
          onClick={() => router.push("/admin/team")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
