"use client";

import { useEffect, useRef, useState } from "react";

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

function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

async function postUpload(data: FormData) {
  const response = await fetch("/api/cms/upload", {
    method: "POST",
    body: data,
  });
  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error || "Upload failed");
  }
  return payload.url;
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
  const lastImported = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    const url = value.trim();
    if (!isRemoteUrl(url) || url === lastImported.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      void (async () => {
        lastImported.current = url;
        setUploading(true);
        setError("");
        try {
          const data = new FormData();
          data.append("url", url);
          const imported = await postUpload(data);
          lastImported.current = imported;
          onChangeRef.current(imported);
          setPreview(imported);
        } catch (caught) {
          lastImported.current = "";
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not import that image URL",
          );
        } finally {
          setUploading(false);
        }
      })();
    }, 700);

    return () => window.clearTimeout(timer);
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
      const url = await postUpload(data);
      lastImported.current = url;
      onChange(url);
      setPreview(url);
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
          <img
            className="cmsImagePreview"
            src={preview}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => {
              if (!uploading) {
                setError("This image could not be previewed. Upload the file or use a direct image URL.");
              }
            }}
          />
        ) : (
          <div className="cmsImagePreview cmsImageEmpty">No image</div>
        )}
        <div className="cmsImageControls">
          <input
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              setPreview(event.target.value);
              setError("");
            }}
            placeholder="Paste an image URL or upload a file"
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
