import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";

export const metadata: Metadata = {
  title: "Random UUID Generator Online – Generate UUID v4 IDs",
  description:
    "Generate random UUID v4 identifiers online. Create and copy up to 100 unique-looking IDs in your browser using cryptographic randomness. Free, with no account.",
  alternates: { canonical: "/uuid-generator" },
  openGraph: {
    title: "Random UUID Generator Online – UUID v4 | PicToSpec",
    description:
      "Generate and copy up to 100 random UUID v4 identifiers directly in your browser.",
    type: "website",
  },
};

export default function Page() {
  return <DeveloperTool kind="uuid-generator" />;
}
