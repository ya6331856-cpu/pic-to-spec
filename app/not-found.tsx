export default function NotFound() {
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
          The link may be outdated, or the page may have moved. Try one of these popular tools instead.
        </p>
        <div className="not-found-actions">
          <a className="not-found-primary" href="/">Go to homepage <span aria-hidden="true">→</span></a>
          <a className="not-found-secondary" href="/image-compressor">Image compressor</a>
          <a className="not-found-secondary" href="/pdf-merger">Merge PDF</a>
          <a className="not-found-secondary" href="/qr-code-generator">QR code generator</a>
        </div>
      </section>
      <p className="not-found-footnote">Need help? <a href="mailto:ya6331856@gmail.com">Contact PicToSpec</a></p>
    </main>
  );
}
