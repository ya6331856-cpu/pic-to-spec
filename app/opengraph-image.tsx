import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PicToSpec - free online image, PDF, text, calculator and developer tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px 74px",
          color: "#17233b",
          background: "linear-gradient(125deg, #f7f5ff 0%, #f3fbfc 52%, #fff6f0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -100, top: -150, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle, #d4f5ed 0%, #d4f5ed00 70%)" }} />
        <div style={{ position: "absolute", left: -140, bottom: -260, width: 560, height: 560, borderRadius: 280, background: "radial-gradient(circle, #e3ddff 0%, #e3ddff00 70%)" }} />
        <div style={{ display: "flex", flexDirection: "column", width: 760, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52 }}>
            <div style={{ display: "flex", width: 58, height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: 34, fontWeight: 900, background: "linear-gradient(135deg, #7357e8, #19b6c5)" }}>P</div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>PicToSpec</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "fit-content", padding: "10px 16px", border: "1px solid #d9d7f4", borderRadius: 999, color: "#6650c9", fontSize: 16, fontWeight: 800, letterSpacing: 2, background: "#ffffffc9" }}>FREE ONLINE TOOLS</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 61, lineHeight: 1.06, fontWeight: 900, letterSpacing: -3 }}>
            <span>Get everyday tasks</span>
            <span style={{ color: "#7055df" }}>done in seconds.</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 22, color: "#596780" }}>Image · PDF · Calculators · Text · Developer · SEO</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 18, color: "#64748b" }}>Fast, private tools that work right in your browser.</div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ display: "flex", width: 330, height: 330, alignItems: "center", justifyContent: "center", borderRadius: 165, background: "linear-gradient(145deg, #ffffffdd, #eefaf8bb)", border: "1px solid #d9e8ed", boxShadow: "0 28px 70px #4e5ea01f" }}>
            <img src="https://pictospec.com/pixo.svg" width="280" height="280" />
          </div>
          <div style={{ display: "flex", position: "absolute", bottom: 50, right: 0, padding: "13px 20px", borderRadius: 16, background: "#ffffff", color: "#176b58", fontSize: 18, fontWeight: 800, border: "1px solid #dcece7" }}>Say hello to Pixo!</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
