import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Text Case Converter – Uppercase, Lowercase & Title Case",
  description:
    "Convert text to uppercase, lowercase, title case or sentence case. Clean extra spaces with this free online text and caps lock converter.",
  alternates: { canonical: "/case-converter" },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/case-converter"
        name="Online Text Case Converter"
        description="Convert text to uppercase, lowercase, title case, sentence case or remove extra spaces in your browser."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert text to uppercase and lowercase",
          "Apply basic English title and sentence case",
          "Remove repeated whitespace",
          "Process text in the browser",
        ]}
      />
      <TextTool kind="case-converter" />
    </>
  );
}
