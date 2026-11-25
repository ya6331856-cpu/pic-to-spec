import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "Text Line Sorter — Sort Text Lines Online", description: "Sort text lines alphabetically or numerically in ascending or descending order. Free online line sorter with case-sensitive options.", alternates: { canonical: "/text-line-sorter" } };
export default function Page() { return <QuickUtilityTool kind="line-sorter" />; }
