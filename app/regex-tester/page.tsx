import type { Metadata } from "next";
import RegexTesterTool from "@/components/RegexTesterTool";
export const metadata: Metadata = { title: "Online Regex Tester — PicToSpec", description: "Test JavaScript regular expressions online. Find matches, inspect capture groups and preview replacements with this free browser-based regex tester.", alternates: { canonical: "/regex-tester" } };
export default function Page() { return <RegexTesterTool />; }
