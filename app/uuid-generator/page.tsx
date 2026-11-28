import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
import ToolStructuredData from "@/components/ToolStructuredData";
import UuidGeneratorGuide from "@/components/UuidGeneratorGuide";

export const metadata: Metadata = {
  title: "UUID Generator – Generate Random UUID v4 Online",
  description:
    "Generate 1–100 random UUID v4 IDs online. Copy all or download TXT/JSON, with uppercase, braces and no-hyphen options. Free in your browser.",
  alternates: { canonical: "/uuid-generator" },
  openGraph: {
    title: "Free UUID Generator – Random UUID v4 | PicToSpec",
    description:
      "Create up to 100 random UUID v4 identifiers. Format, copy all or download your batch as TXT or JSON.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UUID Generator – Random UUID v4 | PicToSpec",
    description:
      "Generate, format and download up to 100 random UUID v4 identifiers in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/uuid-generator"
        name="Random UUID v4 Generator"
        description="Generate 1 to 100 random UUID version 4 identifiers in your browser. Choose uppercase, no-hyphen or GUID-style brace formatting, copy the batch or download TXT and JSON files."
        applicationCategory="DeveloperApplication"
        features={[
          "Generate 1 to 100 random UUID v4 identifiers",
          "Use browser cryptographic randomness",
          "Format output as uppercase, no-hyphen or brace-wrapped values",
          "Copy the complete UUID batch",
          "Download generated UUIDs as TXT or JSON",
          "Generate identifiers locally in a modern browser",
        ]}
      />
      <DeveloperTool kind="uuid-generator" />
      <UuidGeneratorGuide />
    </>
  );
}
