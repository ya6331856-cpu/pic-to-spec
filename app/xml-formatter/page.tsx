import type { Metadata } from "next";
import FormatterTool from "@/components/FormatterTool";
export const metadata: Metadata = { title: "XML Formatter and Validator — PicToSpec", description: "Format and validate XML with readable indentation. Free XML beautifier that runs in your browser.", alternates: { canonical: "/xml-formatter" } };
export default function Page() { return <FormatterTool kind="xml" />; }
