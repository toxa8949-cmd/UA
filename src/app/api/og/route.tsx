import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";

// Кольори бренду
const INK = "#0B1F3A";
const EMERALD = "#1B5E4A";
const GOLD = "#E8C547";
const SAND = "#F7F5F0";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? SITE.name).slice(0, 110);
  const eyebrow = searchParams.get("eyebrow")?.slice(0, 40) ?? "";
  const code = searchParams.get("code")?.slice(0, 3) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Верх: лого + назва */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "#ffffff",
              color: INK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 800,
            }}
          >
            З
          </div>
          <div style={{ color: SAND, fontSize: "28px", fontWeight: 600 }}>{SITE.name}</div>

          {/* Паспортний код країни, якщо є */}
          {code && (
            <div
              style={{
                marginLeft: "auto",
                fontSize: "40px",
                fontWeight: 800,
                color: GOLD,
                letterSpacing: "2px",
              }}
            >
              {code}
            </div>
          )}
        </div>

        {/* Центр: eyebrow + заголовок */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#7FD1B4",
                fontSize: "24px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: GOLD }} />
              {eyebrow}
            </div>
          )}
          <div
            style={{
              color: "#ffffff",
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Низ: смуга-акцент + теги */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "60px", height: "6px", background: EMERALD, borderRadius: "3px" }} />
            <div style={{ width: "20px", height: "6px", background: GOLD, borderRadius: "3px" }} />
          </div>
          <div style={{ color: "#9DB0C7", fontSize: "24px" }}>
            Країни · документи · податки · житло · сервіси
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
