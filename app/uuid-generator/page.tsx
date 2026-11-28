import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Random UUID Generator Online – Generate UUID v4 IDs",
  description:
    "Generate random UUID v4 identifiers online. Create and copy up to 100 IDs in your browser using cryptographic randomness. Free, with no account.",
  alternates: { canonical: "/uuid-generator" },
  openGraph: {
    title: "Random UUID Generator Online – UUID v4 | PicToSpec",
    description:
      "Generate and copy up to 100 random UUID v4 identifiers directly in your browser.",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/uuid-generator"
        name="Random UUID Generator"
        description="Generate random UUID version 4 identifiers in your browser. Create and copy up to 100 identifiers per batch."
        applicationCategory="DeveloperApplication"
        features={[
          "Generate 1 to 100 random UUID v4 identifiers",
          "Use browser cryptographic randomness",
          "Copy the generated UUID list",
          "Run locally in a modern browser",
        ]}
      />
      <DeveloperTool kind="uuid-generator" />
    </>
  );
}
