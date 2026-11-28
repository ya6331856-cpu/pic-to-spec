import type { Metadata } from "next";
import PDFToImageTool from "@/components/PDFToImageTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "PDF to JPG Converter – Convert PDF Pages to Images",
  description:
    "Convert selected PDF pages to JPG or PNG images online. Choose a page range and image quality format; download one image or a ZIP of up to 30 pages. Files stay in your browser.",
  alternates: { canonical: "/pdf-to-jpg" },
  openGraph: {
    title: "PDF to JPG / PNG Converter | PicToSpec",
    description:
      "Turn PDF pages into JPG or PNG images. Select pages, choose a format, and download images or a ZIP archive.",
    type: "website",
    url: "https://pictospec.com/pdf-to-jpg",
  },
  twitter: {
    card: "summary",
    title: "PDF to JPG / PNG Converter | PicToSpec",
    description:
      "Convert a selected PDF page range to JPG or PNG images in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-to-jpg"
        name="PDF to JPG and PNG Converter"
        description="A browser-based converter that renders selected PDF pages as JPG or PNG images. One page downloads as an image; multiple pages are packaged into a ZIP archive."
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
    </>
  );
}
