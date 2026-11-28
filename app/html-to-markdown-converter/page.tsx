import type { Metadata } from "next";
import HtmlMarkdownTool from "@/components/HtmlMarkdownTool";
import ToolSeoContent from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter – Convert HTML to MD Online",
  description:
    "Convert HTML markup into Markdown online. Keep headings, links, lists, tables, blockquotes and code blocks, then copy or download the .md result in your browser.",
  alternates: { canonical: "/html-to-markdown-converter" },
};

export default function Page() {
  return (
    <>
      <HtmlMarkdownTool />
      <ToolSeoContent
        path="/html-to-markdown-converter"
        title="HTML to Markdown Converter"
        intro="Turn HTML markup into Markdown for README files, documentation, notes and content workflows. The converter reads the supplied HTML structure in your browser and creates Markdown text; it does not execute scripts or reproduce the page's CSS layout."
        steps={[
          "Paste the HTML source into the HTML input area, or load the built-in example to see the supported output.",
          "Review the Markdown output as it updates. Check headings, list nesting, links, code blocks and tables.",
          "Copy the Markdown to your clipboard or download it as a .md file.",
          "Preview the result in the Markdown editor or documentation system where you plan to use it.",
        ]}
        example={
          <>
            <p>For example, this HTML:</p>
            <pre><code>{`<h1>Release notes</h1>
<p>New <strong>JSON tools</strong> are available.</p>
<ul>
  <li>JSON Diff</li>
  <li>JSON Formatter</li>
</ul>`}</code></pre>
            <p>Becomes Markdown similar to:</p>
            <pre><code>{`# Release notes

New **JSON tools** are available.

- JSON Diff
- JSON Formatter`}</code></pre>
          </>
        }
        limitations="The converter supports headings, paragraphs, emphasis, links, images, lists, blockquotes, code blocks, horizontal rules and basic tables. It removes scripts, styles, SVG and embedded active content rather than executing them. CSS styling, complex layouts, forms and interactive widgets are not converted into equivalent Markdown. Some relative links or complex tables may need manual review."
        faqs={[
          {
            question: "Can I convert HTML to Markdown for a README file?",
            answer:
              "Yes. Copy the generated Markdown or download the .md file, then review it in your repository or Markdown editor before committing it.",
          },
          {
            question: "Does the converter keep headings, lists and tables?",
            answer:
              "It converts common heading levels, paragraphs, ordered and unordered lists, basic tables, blockquotes, links and code blocks. Complex nested layouts may need cleanup.",
          },
          {
            question: "Will HTML scripts or CSS run during conversion?",
            answer:
              "No. The converter parses markup only. Script, style and embedded active elements are removed; JavaScript is not executed.",
          },
          {
            question: "Are my HTML documents uploaded?",
            answer:
              "No. The conversion runs in your browser. The tool does not send the pasted HTML to a PicToSpec processing server.",
          },
        ]}
        related={[
          { label: "Markdown Preview", href: "/markdown-preview" },
          { label: "HTML Formatter", href: "/html-formatter" },
          { label: "HTML Entity Encoder and Decoder", href: "/html-entity-encoder-decoder" },
        ]}
      />
    </>
  );
}
