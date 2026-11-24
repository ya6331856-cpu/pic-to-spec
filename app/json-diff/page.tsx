import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
export const metadata: Metadata = { title: "JSON Diff Tool — Compare Two JSON Files Online | PicToSpec", description: "Compare two JSON values and find added, removed and changed fields, including nested objects and arrays. Runs locally in your browser.", alternates: { canonical: "/json-diff" } };
export default function Page() { return <DataCompareTool mode="json-diff" />; }
