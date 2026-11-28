import type { Metadata } from "next";
import PdfPageNumbersWatermarkTool from "@/components/PdfPageNumbersWatermarkTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Add Page Numbers & Watermark to PDF Online",
  description:
    "Add page numbers, a diagonal text watermark, or both to selected PDF pages. Customize number style, color, watermark text, size and opacity. Free browser-based PDF tool.",
  alternates: { canonical: "/pdf-page-numbers-watermark" },
  openGraph: {
    title: "Add Page Numbers & Watermark to PDF | PicToSpec",
    description:
      "Number selected PDF pages or add a customizable diagonal text watermark. Process files locally and download a separate PDF.",
    type: "website",
    url: "https://pictospec.com/pdf-page-numbers-watermark",
  },
  twitter: {
    card: "summary",
    title: "Add Page Numbers & Watermark to PDF | PicToSpec",
    description:
      "Customize page numbering and diagonal text watermarks on selected PDF pages in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-page-numbers-watermark"
        name="PDF Page Number and Watermark Tool"
        description="A browser-based PDF editor that adds page numbers, a diagonal text watermark, or both to a selected page range and exports a separate PDF."
        applicationCategory="UtilitiesApplication"
        features={[
          "Add page numbers to a selected PDF page range",
          "Choose number formats including Page 1 of 5 and 1 / 5",
          "Customize page-number color",
          "Add a diagonal text watermark",
          "Customize watermark text, color, font size and opacity",
          "Process PDF files locally in the browser",
          "Support PDF files up to 100 MB and 500 pages",
        ]}
      />
      <PdfPageNumbersWatermarkTool />
    </>
  );
}
