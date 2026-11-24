import type { Metadata } from "next";
import ValidationConversionTool from "@/components/ValidationConversionTool";
export const metadata: Metadata = { title: "XML to JSON Converter — Convert XML Online | PicToSpec", description: "Convert XML to formatted JSON online. Preserve attributes, nested elements and repeated tags with local browser processing.", alternates: { canonical: "/xml-to-json-converter" } };
export default function Page() { return <ValidationConversionTool mode="xml" />; }
