import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
import ToolSeoContent from "@/components/ToolSeoContent";

export const metadata: Metadata = {
  title: "JSON Diff Tool – Compare JSON Objects & Arrays Online",
  description:
    "Compare two JSON documents online and find added, removed and changed values. Inspect nested object paths and array differences in your browser.",
  alternates: { canonical: "/json-diff" },
  openGraph: {
    title: "JSON Diff Tool – Compare JSON Objects & Arrays",
    description:
      "Find added, removed and changed JSON values with a browser-based JSON comparison tool.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <DataCompareTool mode="json-diff" />
      <ToolSeoContent
        path="/json-diff"
        title="JSON Diff Tool"
        intro="Use this JSON comparison tool to inspect the structural differences between an original JSON value and an updated one. It reports added, removed and changed values with their paths, including values inside nested objects and arrays. The comparison runs in your browser."
        steps={[
          "Paste the original JSON into the left editor and the updated JSON into the right editor.",
          "Check that both inputs are valid JSON. The tool reports a parsing error if either input is malformed.",
          "Review the difference count and each result path. Added, removed and changed values are labelled separately.",
          "Use Copy diff to copy the structured difference list when you need to review it or share it with a teammate.",
        ]}
        example={
          <>
            <p>For example, compare these two values:</p>
            <pre><code>{`Original
{
  "name": "PicToSpec",
  "tools": ["JSON", "CSS"],
  "version": 1
}

Updated
{
  "name": "PicToSpec",
  "tools": ["JSON", "XML"],
  "version": 2,
  "active": true
}`}</code></pre>
            <p>The comparison identifies the changed array value at its index, the changed version number and the newly added <code>active</code> property.</p>
          </>
        }
        limitations="The comparison works on parsed JSON values, not raw text formatting. Object key order is ignored, while array order matters because items are compared by their index. A reorder can therefore appear as changed values at multiple indexes. This tool does not compare comments, JavaScript object literals, trailing commas or application-specific schemas; use standard valid JSON for both inputs."
        faqs={[
          {
            question: "What does a JSON diff show?",
            answer:
              "It shows values that were added, removed or changed between two valid JSON documents, with a path identifying where each difference occurs.",
          },
          {
            question: "Can it compare nested JSON objects and arrays?",
            answer:
              "Yes. The comparison walks nested objects and arrays and reports paths such as $.user.name or $.items[0].price.",
          },
          {
            question: "Does the order of JSON object keys matter?",
            answer:
              "No. Object key order is ignored after parsing. Array order does matter, so moving an item to a different index can produce differences.",
          },
          {
            question: "Are my JSON values uploaded?",
            answer:
              "No. This version parses and compares the values in your browser. Avoid using a shared device for confidential data.",
          },
        ]}
        related={[
          { label: "JSON Formatter and Validator", href: "/json-formatter" },
          { label: "JSON Validator", href: "/json-validator" },
          { label: "JSON to CSV Converter", href: "/json-to-csv-converter" },
        ]}
      />
    </>
  );
}
