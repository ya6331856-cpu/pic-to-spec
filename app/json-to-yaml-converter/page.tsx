import type { Metadata } from "next";
import JsonYamlTool from "@/components/JsonYamlTool";
export const metadata: Metadata = { title: "JSON to YAML Converter — Convert JSON Online | PicToSpec", description: "Convert JSON objects and arrays to readable YAML online. Validate JSON and copy or download the result locally in your browser.", alternates: { canonical: "/json-to-yaml-converter" } };
export default function Page() { return <JsonYamlTool />; }
