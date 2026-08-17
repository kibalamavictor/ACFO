import { ImageResponse } from "next/og";

export const alt =
  "African Children's Foundation Organization — empowering children in South Sudan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#006838",
          color: "#ffffff",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#02b702",
          }}
        >
          ACFO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            Empowering Children. Strengthening Communities.
          </div>
          <div style={{ fontSize: 28, maxWidth: 820, color: "#e7f6e7" }}>
            African Children&apos;s Foundation Organization — Juba, South Sudan
          </div>
        </div>
      </div>
    ),
    size,
  );
}
