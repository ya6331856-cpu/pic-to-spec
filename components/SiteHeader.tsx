"use client";

import { useEffect, useState } from "react";

const navigation = [
  { label: "Image", href: "/#image-tools" },
  { label: "PDF", href: "/#pdf-tools" },
  { label: "Calculators", href: "/#calculators" },
  { label: "Text", href: "/#text-tools" },
  { label: "Developer", href: "/#developer-tools" },
  { label: "SEO tools", href: "/#seo-tools" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#page-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="site-brand" href="/" aria-label="PicToSpec home">
            <span className="site-brand-mark" aria-hidden="true">P</span>
            <span className="site-brand-name">PicToSpec</span>
          </a>

          <nav
            className={"site-nav " + (menuOpen ? "is-open" : "")}
            id="site-primary-navigation"
            aria-label="Tool categories"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header-actions">
            <a className="site-header-cta" href="/#tool-directory">Browse tools <span aria-hidden="true">↗</span></a>
            <button
              className="site-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="site-primary-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
