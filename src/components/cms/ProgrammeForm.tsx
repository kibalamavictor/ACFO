"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/cms/ImageField";
import RichTextEditor from "@/components/cms/RichTextEditor";
import { getProgrammeHref, slugify } from "@/lib/cms/public";
import type { CmsProgramme } from "@/lib/cms/types";

const CATEGORIES = [
  "Education",
  "Health",
  "Nutrition",
  "Community",
  "Environment",
] as const;

export default function ProgrammeForm({
  programme,
  mode,
}: {
  programme?: CmsProgramme;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(programme?.title ?? "");
  const [slug, setSlug] = useState(programme?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(programme?.id));
  const [category, setCategory] = useState(programme?.category ?? "Community");
  const [excerpt, setExcerpt] = useState(programme?.excerpt ?? "");
  const [summary, setSummary] = useState(programme?.body ?? "");
  const [photo, setPhoto] = useState(programme?.photo ?? "/images/community-1.jpg");
  const [photoAlt, setPhotoAlt] = useState(programme?.photoAlt ?? "");
  const [published, setPublished] = useState(programme?.published ?? true);
  const [target, setTarget] = useState(programme?.target ?? 100);
  const [targetLabel, setTargetLabel] = useState(programme?.targetLabel ?? "People");
  const [reach, setReach] = useState(programme?.reach ?? 0);
  const [heroCta, setHeroCta] = useState(programme?.heroCta ?? "Support This Programme");
  const [detailBody, setDetailBody] = useState(programme?.detailBody ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: CmsProgramme = {
      id: previewSlug,
      title: title.trim(),
      category,
      body: summary.trim() || excerpt.trim(),
      excerpt: excerpt.trim(),
      detailBody: detailBody.trim(),
      published,
      target: Number(target) || 0,
      targetLabel: targetLabel.trim() || "People",
      reach: Number(reach) || 0,
      href: getProgrammeHref(previewSlug),
      photo,
      photoAlt: photoAlt.trim() || title.trim(),
      heroCta: heroCta.trim() || "Support This Programme",
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/cms/programmes"
          : `/api/cms/programmes/${programme?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        programme?: CmsProgramme;
      };
      if (!response.ok) {
        throw new Error(result.error || "Could not save programme");
      }
      router.push("/admin/programmes");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save programme");
      setSaving(false);
    }
  };

  return (
    <form className="cmsForm" onSubmit={(event) => void onSubmit(event)}>
      {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}

      <label className="cmsField">
        <span>Title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Page slug</span>
          <input
            value={previewSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </label>
        <label className="cmsField">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="cmsCheck">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
        />
        Published on the website
      </label>

      <label className="cmsField">
        <span>Hero introduction</span>
        <textarea
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          required
        />
      </label>

      <RichTextEditor
        label="Card summary"
        value={summary}
        onChange={setSummary}
        features={["bold", "italic"]}
        minHeight={140}
      />

      <ImageField label="Cover photo" value={photo} onChange={setPhoto} />

      <label className="cmsField">
        <span>Photo description</span>
        <input
          value={photoAlt}
          onChange={(event) => setPhotoAlt(event.target.value)}
        />
      </label>

      <div className="cmsGrid3">
        <label className="cmsField">
          <span>People reached</span>
          <input
            type="number"
            min={0}
            value={reach}
            onChange={(event) => setReach(Number(event.target.value) || 0)}
          />
        </label>
        <label className="cmsField">
          <span>Target</span>
          <input
            type="number"
            min={0}
            value={target}
            onChange={(event) => setTarget(Number(event.target.value) || 0)}
          />
        </label>
        <label className="cmsField">
          <span>Target label</span>
          <input
            value={targetLabel}
            onChange={(event) => setTargetLabel(event.target.value)}
          />
        </label>
      </div>

      <label className="cmsField">
        <span>Hero button</span>
        <input value={heroCta} onChange={(event) => setHeroCta(event.target.value)} />
      </label>

      <RichTextEditor
        label="Programme page"
        value={detailBody}
        onChange={setDetailBody}
        minHeight={360}
      />

      <div className="cmsActions">
        <button className="cmsBtnLime" type="submit" disabled={saving}>
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Publish programme"
              : "Save changes"}
        </button>
        <button
          className="cmsBtnGhost"
          type="button"
          onClick={() => router.push("/admin/programmes")}
        >
          Cancel
        </button>
        {mode === "edit" && programme ? (
          <a
            className="cmsBtnGhost"
            href={getProgrammeHref(programme.id)}
            target="_blank"
            rel="noreferrer"
          >
            View page
          </a>
        ) : null}
      </div>
    </form>
  );
}
