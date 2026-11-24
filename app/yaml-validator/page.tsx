import type { Metadata } from "next";
import ValidationConversionTool from "@/components/ValidationConversionTool";
export const metadata: Metadata = { title: "YAML Validator — Check YAML Syntax Online | PicToSpec", description: "Check common YAML syntax issues online, including indentation, tabs, unclosed quotes and duplicate keys. Runs locally in your browser.", alternates: { canonical: "/yaml-validator" } };
export default function Page() { return <ValidationConversionTool mode="yaml" />; }
