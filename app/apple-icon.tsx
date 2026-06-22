import { ImageResponse } from "next/og";

// Home-screen / apple-touch icon (PNG, generated at build) — navy field with the
// gold WaveUp peak mark, matching app/icon.svg. iOS needs a raster icon, so this
// is rendered via ImageResponse rather than served as SVG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#111c33",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M9 47 L24 21 L33 33 L43 17 L55 47 Z" fill="#b8923e" />
        </svg>
      </div>
    ),
    size,
  );
}
