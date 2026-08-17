"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/cms/ImageField";
import RichTextEditor from "@/components/cms/RichTextEditor";
import type { PageDef, PageField, RepeaterField } from "@/lib/cms/pages";

type SectionMap = Record<string, Record<string, unknown>>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function emptyItem(field: RepeaterField) {
  const item: Record<string, unknown> = {};
  for (const child of field.fields) {
    item[child.key] = "";
  }
  return item;
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: PageField;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageField
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
      />
    );
  }

  if (field.type === "repeater") {
    const items = asList(value);
    const min = field.min ?? 0;
    const max = field.max ?? 20;

    return (
      <div className="cmsRepeater">
        <span className="cmsRepeaterLabel">{field.label}</span>
        {items.map((item, index) => (
          <article className="cmsSubcard" key={`${field.key}-${index}`}>
            <div className="cmsSubcardHead">
              <h3>
                {field.itemLabel} {index + 1}
              </h3>
              {items.length > min ? (
                <button
                  className="cmsBtnGhost"
                  type="button"
                  onClick={() =>
                    onChange(items.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  Remove
                </button>
              ) : null}
            </div>
            {field.fields.map((child) => (
              <FieldEditor
                key={child.key}
                field={child}
                value={item[child.key]}
                onChange={(next) =>
                  onChange(
                    items.map((current, itemIndex) =>
                      itemIndex === index
                        ? { ...current, [child.key]: next }
                        : current,
                    ),
                  )
                }
              />
            ))}
          </article>
        ))}
        {items.length < max ? (
          <button
            className="cmsBtnForest"
            type="button"
            onClick={() => onChange([...items, emptyItem(field)])}
          >
            Add {field.itemLabel.toLowerCase()}
          </button>
        ) : null}
      </div>
    );
  }

  if (field.type === "text" && field.rich) {
    return (
      <RichTextEditor
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        minHeight={220}
      />
    );
  }

  return (
    <label className="cmsField">
      <span>{field.label}</span>
      {field.multiline ? (
        <textarea
          rows={4}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export default function PageForm({
  page,
  content,
}: {
  page: PageDef;
  content: SectionMap;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<SectionMap>(content);
  const [open, setOpen] = useState(page.sections[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const updateSection = (sectionId: string, key: string, value: unknown) => {
    setSaved(false);
    setDraft((current) => ({
      ...current,
      [sectionId]: {
        ...asRecord(current[sectionId]),
        [key]: value,
      },
    }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/cms/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not save page");
      }
      setSaved(true);
      window.dispatchEvent(new Event("acfo-cms-updated"));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="cmsForm" onSubmit={(event) => void onSubmit(event)}>
      {error ? <p className="cmsBanner cmsBannerError">{error}</p> : null}
      {saved ? <p className="cmsBanner cmsBannerOk">Page content updated.</p> : null}

      {page.sections.map((section) => {
        const values = asRecord(draft[section.id]);
        const expanded = open === section.id;

        return (
          <section className="cmsSection" key={section.id}>
            <button
              className="cmsSectionToggle"
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? "" : section.id)}
            >
              <span>
                <strong>{section.title}</strong>
                {section.description ? <small>{section.description}</small> : null}
              </span>
              <span>{expanded ? "Hide" : "Edit"}</span>
            </button>
            {expanded ? (
              <div className="cmsSectionBody">
                {section.fields.map((field) => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    onChange={(next) => updateSection(section.id, field.key, next)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}

      <div className="cmsActions">
        <button className="cmsBtnLime" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </button>
        <a className="cmsBtnGhost" href={page.href} target="_blank" rel="noreferrer">
          View page
        </a>
      </div>
    </form>
  );
}
