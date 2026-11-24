export default function NotFound() {
  const popularTools = [
    { href: "/image-compressor", label: "Image compressor", detail: "Reduce JPG, PNG and WebP file size" },
    { href: "/image-resizer", label: "Image resizer", detail: "Change image width and height" },
    { href: "/image-cropper", label: "Image cropper", detail: "Crop an image by pixel values" },
    { href: "/compress-image-to-50kb", label: "Compress to 50KB", detail: "Prepare smaller upload images" },
    { href: "/pdf-merger", label: "PDF merger", detail: "Combine PDF documents" },
    { href: "/pdf-splitter", label: "PDF splitter", detail: "Extract pages from a PDF" },
    { href: "/jpg-to-pdf", label: "JPG to PDF", detail: "Turn images into an A4 PDF" },
    { href: "/qr-code-generator", label: "QR code generator", detail: "Create a QR code from text or a link" },
    { href: "/word-counter", label: "Word counter", detail: "Count words and characters" },
    { href: "/gst-calculator", label: "GST calculator", detail: "Calculate GST and tax amounts" },
    { href: "/password-generator", label: "Password generator", detail: "Generate a secure random password" },
    { href: "/json-formatter", label: "JSON formatter", detail: "Format and validate JSON data" }
  ];

  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <a className="not-found-brand" href="/">
        <span className="mark" aria-hidden="true">P</span>
        PicToSpec
      </a>
      <section className="not-found-panel">
        <p className="not-found-code">404 · PAGE NOT FOUND</p>
        <h1 id="not-found-title">This page took a wrong turn.</h1>
        <p className="not-found-copy">
          The address may be incorrect, or the page may have moved. Choose a tool below or return to the homepage to find what you need.
        </p>
        <div className="not-found-actions">
          <a className="not-found-primary" href="/">Explore all tools <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section aria-labelledby="not-found-tools-title" style={{ width: "100%", maxWidth: 900, margin: "28px auto 0" }}>
        <h2 id="not-found-tools-title" style={{ textAlign: "center", fontSize: "clamp(20px, 3vw, 26px)", marginBottom: 16 }}>Popular free online tools</h2>
        <nav aria-label="Popular tools" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
          {popularTools.map((tool) => (
            <a key={tool.href} href={tool.href} style={{ display: "block", padding: "16px", border: "1px solid #e1e9e4", borderRadius: 14, background: "rgba(255,255,255,.82)", color: "#17251e", textDecoration: "none" }}>
              <strong style={{ display: "block", marginBottom: 5 }}>{tool.label}</strong>
              <span style={{ color: "#718078", fontSize: 13, lineHeight: 1.5 }}>{tool.detail}</span>
            </a>
          ))}
        </nav>
      </section>
      <p className="not-found-footnote">Need help? <a href="mailto:ya6331856@gmail.com">Contact PicToSpec</a></p>
    </main>
  );
}
