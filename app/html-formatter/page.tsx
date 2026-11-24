import type { Metadata } from "next";
import FormatterTool from "@/components/FormatterTool";
export const metadata: Metadata = { title: "HTML Formatter and Beautifier — PicToSpec", description: "Format HTML markup into a readable indented structure with this free browser-based HTML formatter.", alternates: { canonical: "/html-formatter" } };
export default function Page() { return <FormatterTool kind="html" />; }
