"use client";

import { useEffect, useRef, useState } from "react";
import { htmlToMarkdown, markdownToHtml } from "@/lib/cms/article";

export type EditorFeature =
  | "bold"
  | "italic"
  | "heading"
  | "subheading"
  | "quote"
  | "list"
  | "image";

const ALL_FEATURES: EditorFeature[] = [
  "bold",
  "italic",
  "heading",
  "subheading",
  "quote",
  "list",
  "image",
];

function run(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  features = ALL_FEATURES,
  minHeight = 280,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  features?: EditorFeature[];
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastValue = useRef(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    if (value === lastValue.current && editor.innerHTML) {
      return;
    }
    editor.innerHTML = markdownToHtml(value);
    lastValue.current = value;
  }, [value]);

  const sync = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const next = htmlToMarkdown(editor);
    lastValue.current = next;
    onChange(next);
  };

  const apply = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    if (command === "formatBlock" && commandValue) {
      const tag = commandValue.replace(/[<>]/g, "");
      run("formatBlock", `<${tag}>`);
    } else {
      run(command, commandValue);
    }
    sync();
  };

  const insertImage = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await fetch("/api/cms/upload", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload failed");
      }
      editorRef.current?.focus();
      run(
        "insertHTML",
        `<p><img src="${payload.url}" alt="${file.name.replace(/\.[^.]+$/, "")}"></p>`,
      );
      sync();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const enabled = (feature: EditorFeature) => features.includes(feature);

  return (
    <div className="cmsField">
      <span>{label}</span>
      <div className="cmsEditor">
        <div className="cmsToolbar" role="toolbar" aria-label="Writing tools">
          {enabled("bold") ? (
            <button type="button" onClick={() => apply("bold")} title="Bold">
              <strong>B</strong>
            </button>
          ) : null}
          {enabled("italic") ? (
            <button type="button" onClick={() => apply("italic")} title="Italic">
              <em>I</em>
            </button>
          ) : null}
          {enabled("heading") ? (
            <button
              type="button"
              onClick={() => apply("formatBlock", "h2")}
              title="Heading"
            >
              H
            </button>
          ) : null}
          {enabled("subheading") ? (
            <button
              type="button"
              onClick={() => apply("formatBlock", "h3")}
              title="Subheading"
            >
              H3
            </button>
          ) : null}
          {enabled("quote") ? (
            <button
              type="button"
              onClick={() => apply("formatBlock", "blockquote")}
              title="Quote"
            >
              “ ”
            </button>
          ) : null}
          {enabled("list") ? (
            <button
              type="button"
              onClick={() => apply("insertUnorderedList")}
              title="List"
            >
              • List
            </button>
          ) : null}
          {enabled("image") ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Add image"
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Image"}
            </button>
          ) : null}
        </div>
        <div
          ref={editorRef}
          className="cmsEditorSurface"
          contentEditable
          role="textbox"
          aria-label={label}
          style={{ minHeight }}
          onInput={sync}
          onBlur={sync}
          suppressContentEditableWarning
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          hidden
          onChange={(event) => {
            void insertImage(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>
      {error ? <p className="cmsError">{error}</p> : null}
    </div>
  );
}
