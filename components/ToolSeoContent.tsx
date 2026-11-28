import type { ReactNode } from "react";

type ToolLink = { label: string; href: string };
type ToolFaq = { question: string; answer: string };

type ToolSeoContentProps = {
  path: string;
  title: string;
  intro: string;
  steps: string[];
  example?: ReactNode;
  exampleTitle?: string;
  limitations: string;
  faqs: ToolFaq[];
  related?: ToolLink[];
};

export default function ToolSeoContent({
  path,
  title,
  intro,
  steps,
  example,
  exampleTitle = "Example",
  limitations,
  faqs,
  related = [],
}: ToolSeoContentProps) {
  const url = `https://pictospec.com${path}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pictospec.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
      },
    ],
  };

  return (
    <section className="seo-page tool-seo-content" aria-label={`Guide to ${title}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" style={{ fontSize: 12, marginBottom: 22, color: "#718078" }}>
        <a href="/">Home</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">{title}</span>
      </nav>
      <p className="kicker">PRACTICAL TOOL GUIDE</p>
      <h2>{title}: how it works</h2>
      <p className="lead">{intro}</p>

      <h2>How to use this tool</h2>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {example ? (
        <>
          <h2>{exampleTitle}</h2>
          <div className="tool-seo-example">{example}</div>
        </>
      ) : null}

      <h2>What to check before using the result</h2>
      <p>{limitations}</p>

      {faqs.length > 0 ? (
        <>
          <h2>Frequently asked questions</h2>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </>
      ) : null}

      {related.length > 0 ? (
        <>
          <h2>Related PicToSpec tools</h2>
          <ul>
            {related.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="note">
        Your input is processed in your browser for this tool. Review the result before using it in
        another application, and do not paste passwords, API keys or confidential information into
        a shared device.
      </p>
    </section>
  );
}
