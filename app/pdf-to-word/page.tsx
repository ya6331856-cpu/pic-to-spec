import type { Metadata } from "next";
import PDFToWordTool from "@/components/PDFToWordTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "PDF to Word Converter – Convert PDF to Editable DOCX",
  description:
    "Convert selectable PDF text into an editable Word DOCX online. Choose up to 100 pages, extract text in your browser, and download your document. Scanned PDFs require OCR.",
  alternates: { canonical: "/pdf-to-word" },
  openGraph: {
    title: "PDF to Word Converter | PicToSpec",
    description:
      "Extract selectable text from PDF pages into an editable DOCX file. Browser-based conversion with clear format limitations.",
    type: "website",
    url: "https://pictospec.com/pdf-to-word",
  },
  twitter: {
    card: "summary",
    title: "PDF to Word Converter | PicToSpec",
    description:
      "Convert selectable PDF text into an editable Word DOCX document in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-to-word"
        name="PDF to Word Converter"
        description="A browser-based PDF text extractor that creates an editable DOCX document from selectable PDF text and a chosen page range. Complex layouts and scanned pages may require separate processing."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert selectable PDF text into an editable DOCX file",
          "Choose a page range from a PDF",
          "Process PDFs up to 50 MB and 100 pages per conversion",
          "Separate extracted content by source page",
          "Process files locally in the browser",
          "Explain scanned PDF and complex-layout limitations",
        ]}
      />
      <PDFToWordTool />
    </>
  );
}
