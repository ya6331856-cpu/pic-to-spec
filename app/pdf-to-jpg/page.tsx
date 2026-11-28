import type { Metadata } from "next";
import PDFToImageTool from "@/components/PDFToImageTool";
import PDFToJpgGuide from "@/components/PDFToJpgGuide";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "PDF to JPG Converter Online – Convert PDF Pages to Images",
  description:
    "Convert PDF pages to JPG or PNG images online. Select up to 30 pages, download a single image or ZIP, and process files in your browser. Free PDF to image converter.",
  alternates: { canonical: "/pdf-to-jpg" },
  openGraph: {
    title: "PDF to JPG Converter Online – JPG & PNG | PicToSpec",
    description:
      "Turn selected PDF pages into JPG or PNG images. Choose a page range and download one image or a ZIP archive.",
    type: "website",
    url: "https://pictospec.com/pdf-to-jpg",
  },
  twitter: {
    card: "summary",
    title: "PDF to JPG Converter Online | PicToSpec",
    description:
      "Convert selected PDF pages to JPG or PNG in your browser. Download one image or a ZIP of multiple pages.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-to-jpg"
        name="PDF to JPG and PNG Converter"
        description="A browser-based PDF page converter that renders selected pages as JPG or PNG images. One page downloads as an image; multiple pages are packaged into a ZIP archive."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert selected PDF pages to JPG or PNG",
          "Choose a continuous page range",
          "Download one converted page as an image",
          "Download multiple converted pages in a ZIP archive",
          "Convert up to 30 pages per operation",
          "Process PDF files locally in the browser",
        ]}
      />
      <PDFToImageTool />
      <PDFToJpgGuide />
    </>
  );
}
