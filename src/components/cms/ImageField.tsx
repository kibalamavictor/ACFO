"use client";

import { useEffect, useState } from "react";

export default function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const onFile = async (file: File | undefined) => {
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
      onChange(payload.url);
      setPreview(payload.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="cmsField">
      <span>{label}</span>
      <div className="cmsImageRow">
        {preview ? (
          <img className="cmsImagePreview" src={preview} alt="" />
        ) : (
          <div className="cmsImagePreview cmsImageEmpty">No image</div>
        )}
        <div className="cmsImageControls">
          <input
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              setPreview(event.target.value);
            }}
            placeholder="/images/community-1.jpg"
          />
          <label className="cmsUpload">
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              hidden
              onChange={(event) => {
                void onFile(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {error ? <p className="cmsError">{error}</p> : null}
        </div>
      </div>
    </label>
  );
}
