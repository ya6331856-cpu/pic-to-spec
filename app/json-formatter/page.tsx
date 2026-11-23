import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
export const metadata: Metadata = { title: "JSON Formatter & Validator — Beautify or Minify JSON Online", description: "Format, beautify, minify and validate JSON online. Make JSON readable with indentation and check syntax errors in your browser.", alternates: { canonical: "/json-formatter" } };
export default function Page() { return <TextTool kind="json-formatter" />; }
