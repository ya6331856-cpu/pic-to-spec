import type { Metadata } from "next";
import HtmlMarkdownTool from "@/components/HtmlMarkdownTool";
export const metadata: Metadata = { title: "HTML to Markdown Converter — Convert HTML Online | PicToSpec", description: "Convert HTML into clean Markdown online. Supports headings, links, lists, tables, blockquotes and code blocks with local browser processing.", alternates: { canonical: "/html-to-markdown-converter" } };
export default function Page() { return <HtmlMarkdownTool />; }
