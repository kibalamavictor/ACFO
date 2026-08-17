"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/cms/ImageField";
import RichTextEditor from "@/components/cms/RichTextEditor";
import { chipWidthForLabel, formatNewsDate, slugify } from "@/lib/cms/public";
import type { CmsNewsStory } from "@/lib/cms/types";

const CATEGORIES = [
  "Education",
  "Child Protection",
  "Nutrition",
  "Community",
  "Environment",
  "Health",
];

export default function NewsForm({
  story,
  mode,
}: {
  story?: CmsNewsStory;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(story?.title ?? "");
  const [slug, setSlug] = useState(story?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(story?.slug));
  const [date, setDate] = useState(story?.date ?? formatNewsDate());
  const [chip, setChip] = useState(story?.chip ?? "Education");
  const [excerpt, setExcerpt] = useState(story?.excerpt ?? "");
  const [photo, setPhoto] = useState(story?.photo ?? "/images/community-1.jpg");
  const [photoAlt, setPhotoAlt] = useState(story?.photoAlt ?? "");
  const [published, setPublished] = useState(story?.published ?? true);
  const [body, setBody] = useState(story?.body ?? "");
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

    const payload: CmsNewsStory = {
      title: title.trim(),
      slug: previewSlug,
      date: date.trim(),
      chip,
      chipWidth: chipWidthForLabel(chip),
      excerpt: excerpt.trim(),
      photo,
      photoAlt: photoAlt.trim() || title.trim(),
      published,
      body: body.trim(),
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/cms/news" : `/api/cms/news/${story?.slug}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { error?: string; story?: CmsNewsStory };
      if (!response.ok) {
        throw new Error(result.error || "Could not save story");
      }
      router.push("/admin/news");
      window.dispatchEvent(new Event("acfo-cms-updated"));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save story");
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
          <span>Slug</span>
          <input
            value={previewSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </label>
        <label className="cmsField">
          <span>Date</span>
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>

      <div className="cmsGrid2">
        <label className="cmsField">
          <span>Category</span>
          <select value={chip} onChange={(event) => setChip(event.target.value)}>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="cmsCheck">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
          Published on the website
        </label>
      </div>

      <label className="cmsField">
        <span>Excerpt</span>
        <textarea
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          required
        />
      </label>

      <ImageField label="Photo" value={photo} onChange={setPhoto} />

      <label className="cmsField">
        <span>Photo description</span>
        <input
          value={photoAlt}
          onChange={(event) => setPhotoAlt(event.target.value)}
        />
      </label>

      <RichTextEditor
        label="Article body"
        value={body}
        onChange={setBody}
        minHeight={360}
      />

      <div className="cmsActions">
        <button className="cmsBtnLime" type="submit" disabled={saving}>
          {saving ? "Saving…" : mode === "create" ? "Publish story" : "Save changes"}
        </button>
        <button
          className="cmsBtnGhost"
          type="button"
          onClick={() => router.push("/admin/news")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
