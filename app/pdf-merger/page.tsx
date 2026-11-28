import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
import PDFMergerGuide from "@/components/PDFMergerGuide";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Merge PDF Files Online Free – Combine PDFs in Order",
  description:
    "Combine 2 to 20 PDF files into one document in your browser. Choose the file order, merge PDFs locally, and download one combined PDF without uploading files.",
  alternates: { canonical: "/pdf-merger" },
  openGraph: {
    title: "Merge PDF Files Online Free | PicToSpec",
    description:
      "Combine multiple PDF documents in the order you select. Process files locally in your browser and download one merged PDF.",
    type: "website",
    url: "https://pictospec.com/pdf-merger",
  },
  twitter: {
    card: "summary",
    title: "Merge PDF Files Online Free | PicToSpec",
    description:
      "Combine multiple PDF files in order and download one document. Browser-based PDF merger.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-merger"
        name="Free PDF Merger"
        description="A browser-based PDF merger that combines 2 to 20 selected PDF files in file-selection order into one downloadable PDF."
        applicationCategory="UtilitiesApplication"
        features={[
          "Merge 2 to 20 PDF files",
          "Preserve selected file order",
          "Process files locally in the browser",
          "Support a combined input size up to 100 MB",
          "Limit merged output to 500 pages",
          "Download the combined PDF",
        ]}
      />
      <PDFTool kind="merge" />
      <PDFMergerGuide />
    </>
  );
}
