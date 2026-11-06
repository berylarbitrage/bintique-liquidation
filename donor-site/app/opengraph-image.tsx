import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";

export const alt = `${SITE.brand} — Become an egg or sperm donor`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#FBF8F4",
        padding: 80,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 140,
          width: 300,
          height: 300,
          borderRadius: 300,
          background: "#1F5F5B",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 240,
          width: 260,
          height: 260,
          borderRadius: 260,
          background: "#E8846B",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 680,
        }}
      >
        <div style={{ fontSize: 36, color: "#1F5F5B", fontWeight: 700 }}>{SITE.brand}</div>
        <div
          style={{
            fontSize: 72,
            color: "#1E2422",
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          Help someone become a parent.
        </div>
        <div style={{ fontSize: 30, color: "#5F6864", marginTop: 24 }}>
          Egg & sperm donor programs · Compensated for your time
        </div>
      </div>
    </div>,
    size,
  );
}
