import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "Duplicate Line Remover Online | PicToSpec", description: "Remove duplicate lines from text with optional case-insensitive matching, whitespace trimming and blank-line removal.", alternates: { canonical: "/duplicate-line-remover" } };
export default function Page() { return <QuickUtilityTool kind="duplicate-lines" />; }
