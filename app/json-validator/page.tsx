import type { Metadata } from "next";
import { JsonValidator } from "@/components/JsonMarkdownTools";
export const metadata: Metadata = { title: "JSON Validator Online — PicToSpec", description: "Validate JSON syntax online, find parsing errors and format valid JSON instantly with this free browser-based JSON validator.", alternates: { canonical: "/json-validator" } };
export default function Page() { return <JsonValidator />; }
