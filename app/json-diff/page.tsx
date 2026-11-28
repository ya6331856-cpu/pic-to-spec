import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
import JsonDiffGuide from "@/components/JsonDiffGuide";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "JSON Diff Tool Online – Compare JSON & Find Differences",
  description:
    "Compare two JSON files or pasted values online. Find added, removed, changed and type-changed values with exact paths, filters and a downloadable report.",
  alternates: { canonical: "/json-diff" },
  openGraph: {
    title: "JSON Diff Tool – Compare Two JSON Documents | PicToSpec",
    description:
      "Compare JSON values structurally, filter differences, copy JSON Pointer paths and download a full diff report in your browser.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Diff Tool Online | PicToSpec",
    description:
      "Find added, removed, changed and type-changed JSON values with readable paths and JSON Pointer.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/json-diff"
        name="Online JSON Diff and Compare Tool"
        description="Compare two valid JSON values structurally in your browser. Find added, removed, changed and type-changed values, inspect readable paths and JSON Pointer paths, filter results and download a JSON comparison report."
        applicationCategory="DeveloperApplication"
        features={[
          "Compare nested JSON objects and arrays recursively",
          "Ignore object property order and formatting whitespace",
          "Identify added, removed, changed and type-changed values",
          "Show readable property paths and RFC 6901 JSON Pointer paths",
          "Filter differences by type or path",
          "Format both input values and swap comparison sides",
          "Copy individual JSON Pointer paths",
          "Copy or download a complete JSON difference report",
          "Open local JSON files up to 1 MiB per side without uploading them",
          "Process both JSON inputs locally in the browser",
        ]}
      />
      <DataCompareTool mode="json-diff" />
      <JsonDiffGuide />
    </>
  );
}
