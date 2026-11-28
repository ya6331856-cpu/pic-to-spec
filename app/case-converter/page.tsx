import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
import CaseConverterGuide from "@/components/CaseConverterGuide";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Caps Lock Converter – Uppercase, Lowercase & Text Case",
  description:
    "Fix text typed with Caps Lock on. Convert to uppercase, lowercase, Title Case, Sentence Case, camelCase and snake_case. Free browser-based tool.",
  alternates: { canonical: "/case-converter" },
  openGraph: {
    title: "Free Caps Lock Converter & Text Case Formatter | PicToSpec",
    description:
      "Change text to uppercase, lowercase, Title Case, Sentence Case and developer formats. Copy or download your result.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Caps Lock Converter – Text Case Formatter | PicToSpec",
    description:
      "Fix text typed with Caps Lock on and convert text into 13 useful case formats in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/case-converter"
        name="Caps Lock Converter and Text Case Formatter"
        description="Convert pasted text to uppercase, lowercase, Title Case, Sentence Case, toggle case, alternating case, camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE. Runs locally in a browser."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert text to uppercase and lowercase",
          "Format text as basic Title Case or Sentence case",
          "Capitalize each word, toggle case or alternate letter case",
          "Convert plain phrases to camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE",
          "Collapse repeated spaces while preserving line breaks",
          "Copy converted text or download a TXT file",
          "Count words, characters and lines",
          "Process text locally in the browser",
        ]}
      />
      <TextTool kind="case-converter" />
      <CaseConverterGuide />
    </>
  );
}
