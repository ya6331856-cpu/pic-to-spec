import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "Text Line Reverser Online | PicToSpec", description: "Reverse the order of lines in any text instantly. Free browser-based text line reverser; your text stays on your device.", alternates: { canonical: "/text-line-reverser" } };
export default function Page() { return <QuickUtilityTool kind="line-reverser" />; }
