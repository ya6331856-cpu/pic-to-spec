import type { Metadata } from "next";
import QuickUtilityTool from "@/components/QuickUtilityTool";
export const metadata: Metadata = { title: "HTML Entity Encoder & Decoder Online | PicToSpec", description: "Encode HTML special characters into entities or decode HTML entities into readable text. Free browser-based HTML entity converter.", alternates: { canonical: "/html-entity-encoder-decoder" } };
export default function Page() { return <QuickUtilityTool kind="html-entities" />; }
