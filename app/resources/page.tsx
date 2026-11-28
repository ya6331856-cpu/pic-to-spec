import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Guides & References for Images and Data | PicToSpec",
  description:
    "Practical reference guides from PicToSpec. Compare image formats and learn how JSON, CSV and XML differ before choosing a tool or converting files.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "PicToSpec Resources: Practical Image and Data Guides",
    description: "Clear reference guides for image formats and common data formats.",
    type: "website",
    url: "https://pictospec.com/resources",
  },
};

const resources = [
  {
    href: "/resources/image-format-guide",
    title: "JPG vs PNG vs WebP: Image Format Guide",
    description: "Compare JPG, PNG, WebP, GIF and SVG, including transparency, animation, image quality and common uses.",
    category: "Images",
  },
  {
    href: "/resources/json-csv-xml-guide",
    title: "JSON vs CSV vs XML: Data Format Guide",
    description: "Understand nested data, tables, XML elements and the trade-offs involved when converting between formats.",
    category: "Developer reference",
  },
];

export default function ResourcesPage() {
  return (
    <main className="legal">
      <a href="/" className="back">← Back to PicToSpec</a>
      <p className="kicker">PIC TOSPEC RESOURCES</p>
      <h1>Practical guides and references</h1>
      <p>
        Short, practical explanations to help you choose the right file format, understand common
        data structures and use online tools with fewer surprises. Each guide includes examples,
        limitations and links to relevant tools.
      </p>
      <h2>Browse the guides</h2>
      <ul>
        {resources.map((item) => (
          <li key={item.href}>
            <p><strong><a href={item.href}>{item.title}</a></strong></p>
            <p>{item.description}</p>
            <p><small>{item.category}</small></p>
          </li>
        ))}
      </ul>
      <p>Have a suggestion for a practical reference? <a href="mailto:ya6331856@gmail.com">Contact PicToSpec</a>.</p>
      <p><a href="/about">About PicToSpec</a> · <a href="/">Browse all free tools</a></p>
    </main>
  );
}
