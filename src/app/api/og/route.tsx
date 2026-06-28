import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? SITE.name).slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #1e40af 100%)",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            У
          </div>
          <div style={{ color: "#dbeafe", fontSize: "28px" }}>{SITE.name}</div>
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: "62px",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        <div style={{ color: "#bfdbfe", fontSize: "26px" }}>
          Країни · документи · податки · житло · сервіси
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
