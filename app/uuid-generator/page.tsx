import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";

export const metadata: Metadata = {
  title: "Online UUID Generator – Generate Random UUID v4 IDs",
  description: "Generate random UUID v4 identifiers online. Create up to 100 IDs at once and copy them instantly in your browser using cryptographic random numbers.",
  alternates: { canonical: "/uuid-generator" },
  openGraph: {
    title: "Online UUID Generator – Random UUID v4 | PicToSpec",
    description: "Create up to 100 random UUID v4 identifiers online and copy them instantly.",
    type: "website"
  }
};

export default function Page() {
  return <DeveloperTool kind="uuid-generator" />;
}
