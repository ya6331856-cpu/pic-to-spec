import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
import ToolStructuredData from "@/components/ToolStructuredData";
import JpgToPdfGuide from "@/components/JpgToPdfGuide";

export const metadata: Metadata = {
  title: "JPG to PDF Converter – Convert JPG & PNG Images Online",
  description:
    "Convert multiple JPG or PNG images into one A4 PDF online. Keep image proportions, arrange pages in selection order and download your PDF. Free, private browser-based conversion.",
  alternates: { canonical: "/jpg-to-pdf" },
  openGraph: {
    title: "JPG to PDF Converter – JPG & PNG to PDF | PicToSpec",
    description:
      "Turn up to 20 JPG or PNG images into one A4 PDF. Images are processed locally in your browser.",
    type: "website",
    url: "https://pictospec.com/jpg-to-pdf",
  },
  twitter: {
    card: "summary",
    title: "JPG to PDF Converter | PicToSpec",
    description:
      "Convert JPG and PNG pictures into an A4 PDF with one image per page. Free browser-based tool.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/jpg-to-pdf"
        name="JPG to PDF Converter"
        description="Convert up to 20 JPG or PNG images into one A4 PDF document in the browser. Each image is placed on a separate page, scaled proportionally and centred."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert JPG and PNG images into a PDF",
          "Place each image on its own A4 page",
          "Preserve image aspect ratio while fitting it to the page",
          "Keep pages in the selected image order",
          "Process images locally in the browser",
          "Support up to 20 images and 100 MB combined input",
          "Reject images larger than 40 megapixels",
        ]}
      />
      <PDFTool kind="jpg" />
      <JpgToPdfGuide />
    </>
  );
}
