"use client";

import { useEffect, useState } from "react";

async function prepareUpload(file: File) {
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    !file.type.startsWith("image/")
  ) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) {
      return file;
    }
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

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
    const prepared = await prepareUpload(file);
    const data = new FormData();
    data.append("file", prepared);

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
