import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
export const metadata: Metadata = { title: "SVG to PNG / JPG Converter — Free Online Tool", description: "Convert SVG markup to PNG or JPG in your browser. Safe local processing, no upload and instant download.", alternates: { canonical: "/svg-to-png-converter" } };
export default function Page() { return <ImageUtilityTool kind="svg" />; }
