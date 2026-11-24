import type { Metadata } from "next";
import PDFToWordTool from "@/components/PDFToWordTool";

export const metadata: Metadata = {
  title: "PDF to Word Converter – Convert PDF to Editable DOCX",
  description: "Convert selectable PDF text into an editable Word DOCX online. Choose pages and process files in your browser. Free PDF to Word converter, no account needed.",
  alternates: { canonical: "https://pictospec.com/pdf-to-word" }
};

export default function Page() {
  return <PDFToWordTool />;
}
