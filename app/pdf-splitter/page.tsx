import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Split PDF Pages Online Free – Extract PDF Page Range",
  description:
    "Extract a selected page range from one PDF and save it as a separate file. Choose the first and last page, process locally in your browser, and download the new PDF.",
  alternates: { canonical: "/pdf-splitter" },
  openGraph: {
    title: "Split PDF Pages Online Free | PicToSpec",
    description:
      "Extract the pages you need from a PDF. Select an inclusive page range and create a separate PDF in your browser.",
    type: "website",
    url: "https://pictospec.com/pdf-splitter",
  },
  twitter: {
    card: "summary",
    title: "Split PDF Pages Online Free | PicToSpec",
    description:
      "Extract a continuous page range from a PDF and download it as a separate document.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-splitter"
        name="Free PDF Splitter"
        description="A browser-based PDF splitter that extracts one continuous, inclusive page range from a selected PDF and creates a separate downloadable document."
        applicationCategory="UtilitiesApplication"
        features={[
          "Extract a continuous page range from one PDF",
          "Include both the first and last selected pages",
          "Process the PDF locally in the browser",
          "Support output ranges up to 500 pages",
          "Download extracted pages as a new PDF",
        ]}
      />
      <PDFTool kind="split" />
    </>
  );
}
