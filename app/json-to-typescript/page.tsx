import type { Metadata } from "next";
import JsonStructureTool from "@/components/JsonStructureTool";
export const metadata: Metadata = { title: "JSON to TypeScript Converter — Generate Types Online | PicToSpec", description: "Convert sample JSON into TypeScript types and interfaces. Infer nested objects, arrays and primitive types locally in your browser.", alternates: { canonical: "/json-to-typescript" } };
export default function Page() { return <JsonStructureTool mode="typescript" />; }
