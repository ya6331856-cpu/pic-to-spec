import type { Metadata } from "next";
import TextTool from "@/components/TextTool";

export const metadata: Metadata = {
  title: "Text Case Converter – Uppercase, Lowercase & Title Case",
  description:
    "Convert text to uppercase, lowercase, title case or sentence case. Clean extra spaces with this free online text and caps lock converter.",
  alternates: { canonical: "/case-converter" },
};

export default function Page() {
  return <TextTool kind="case-converter" />;
}
