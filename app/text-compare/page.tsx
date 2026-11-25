import type { Metadata } from "next";
import UtilityTool from "@/components/UtilityTool";
export const metadata: Metadata = { title: "Text Compare — Find Text Differences Online", description: "Compare two texts online and instantly highlight added, removed and unchanged lines. Free, private, browser-based text diff checker.", alternates: { canonical: "/text-compare" } };
export default function Page() { return <UtilityTool kind="text-compare" />; }
