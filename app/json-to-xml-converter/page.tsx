import type { Metadata } from "next";
import FormatterTool from "@/components/FormatterTool";
export const metadata: Metadata = { title: "JSON to XML Converter — PicToSpec", description: "Convert JSON objects and arrays to XML online. Free browser-based JSON to XML converter with a customizable root element.", alternates: { canonical: "/json-to-xml-converter" } };
export default function Page() { return <FormatterTool kind="json-xml" />; }
