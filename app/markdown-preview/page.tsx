import type { Metadata } from "next";
import { MarkdownPreviewer } from "@/components/JsonMarkdownTools";
export const metadata: Metadata = { title: "Markdown Previewer Online — PicToSpec", description: "Write Markdown and preview headings, lists, links, blockquotes and code blocks live with this free browser-based Markdown previewer.", alternates: { canonical: "/markdown-preview" } };
export default function Page() { return <MarkdownPreviewer />; }
