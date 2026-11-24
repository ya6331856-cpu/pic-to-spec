import type { Metadata } from "next";
import PDFToImageTool from "@/components/PDFToImageTool";

export const metadata: Metadata = {
  title: "PDF to JPG / PNG Converter – Convert PDF Pages to Images",
  description: "Convert PDF pages to JPG or PNG images online. Choose a page range and download individual images or a ZIP. Browser-based processing, no account required.",
  alternates: { canonical: "https://pictospec.com/pdf-to-jpg" }
};

export default function Page() {
  return <PDFToImageTool />;
}
