import type { Metadata } from "next";
import JsonStructureTool from "@/components/JsonStructureTool";
export const metadata: Metadata = { title: "JSON Schema Generator — Create Schema from JSON Online | PicToSpec", description: "Generate a JSON Schema Draft 2020-12 from sample JSON. Infer object properties, required fields, arrays and data types free in your browser.", alternates: { canonical: "/json-schema-generator" } };
export default function Page() { return <JsonStructureTool mode="schema" />; }
