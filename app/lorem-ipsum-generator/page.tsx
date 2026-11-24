import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "Lorem Ipsum Generator Online | PicToSpec", description: "Generate Lorem Ipsum placeholder text by paragraph or word count. Free, instant text generator for layouts and mockups.", alternates: { canonical: "/lorem-ipsum-generator" } };
export default function Page() { return <QuickUtilityTool kind="lorem" />; }
