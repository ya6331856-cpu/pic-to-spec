"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f7f8ff", color: "#1d2947" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
          <section style={{ width: "min(100%, 620px)", padding: 32, border: "1px solid #e4e7f3", borderRadius: 20, background: "#fff", textAlign: "center", boxShadow: "0 20px 60px #29345a12" }}>
            <p style={{ color: "#6654ce", fontWeight: 700, letterSpacing: 2, fontSize: 11 }}>PICTOSPEC</p>
            <h1 style={{ fontSize: "clamp(30px, 7vw, 44px)" }}>We hit a temporary problem.</h1>
            <p style={{ color: "#65718a", lineHeight: 1.7 }}>Please try loading PicToSpec again. If the issue continues, come back in a little while.</p>
            <button type="button" onClick={() => reset()} style={{ border: 0, borderRadius: 10, padding: "14px 22px", background: "#6654ce", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Try again</button>
            <p><a href="/" style={{ color: "#6654ce" }}>Go to homepage</a></p>
          </section>
        </main>
      </body>
    </html>
  );
}
