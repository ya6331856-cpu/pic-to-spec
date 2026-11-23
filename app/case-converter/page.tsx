import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
export const metadata: Metadata = { title: "Case Converter — Uppercase, Lowercase and Title Case", description: "Convert text to uppercase, lowercase, title case, sentence case or remove extra spaces with this free online case converter.", alternates: { canonical: "/case-converter" } };
export default function Page() { return <TextTool kind="case-converter" />; }
