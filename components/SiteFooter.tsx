const categoryLinks = [
  { label: "Image tools", href: "/#image-tools" },
  { label: "PDF tools", href: "/#pdf-tools" },
  { label: "Calculators", href: "/#calculators" },
  { label: "Text tools", href: "/#text-tools" },
  { label: "Developer tools", href: "/#developer-tools" },
  { label: "SEO tools", href: "/#seo-tools" },
];

const popularLinks = [
  { label: "Image Compressor", href: "/image-compressor" },
  { label: "Merge PDF", href: "/pdf-merger" },
  { label: "GST Calculator", href: "/gst-calculator" },
  { label: "JSON Validator", href: "/json-validator" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <a className="site-brand" href="/">
            <span className="site-brand-mark" aria-hidden="true">P</span>
            <span className="site-brand-name">PicToSpec</span>
          </a>
          <p>Useful tools for everyday work. Free, straightforward and designed to run in your browser.</p>
          <span className="site-footer-trust"><span aria-hidden="true">✓</span> Your files stay on your device for browser-based tools.</span>
        </div>

        <div className="site-footer-column">
          <h2>Explore</h2>
          {categoryLinks.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>

        <div className="site-footer-column">
          <h2>Popular tools</h2>
          {popularLinks.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>

        <div className="site-footer-column">
          <h2>About</h2>
          <a href="/about">About PicToSpec</a>
          <a href="/resources/image-format-guide">Image format guide</a>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms of use</a>
          <a href="mailto:ya6331856@gmail.com">Contact</a>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} PicToSpec. All rights reserved.</span>
        <span>Made to make everyday tasks a little easier.</span>
      </div>
    </footer>
  );
}
