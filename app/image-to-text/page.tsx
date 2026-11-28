import type { Metadata } from "next";
import OCRTool from "@/components/OCRTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image to Text Converter (OCR) – Extract Text from Photo",
  description:
    "Extract editable English text from JPG, PNG and WebP photos or screenshots with free browser-based OCR. Copy the result or download a TXT file. Up to 12 MB.",
  alternates: { canonical: "/image-to-text" },
  openGraph: {
    title: "Image to Text OCR – Extract Text from Photos | PicToSpec",
    description:
      "Turn a JPG, PNG or WebP image into editable English text. Review, copy or download the OCR result.",
    type: "website",
    url: "https://pictospec.com/image-to-text",
  },
  twitter: {
    card: "summary",
    title: "Image to Text OCR | PicToSpec",
    description:
      "Extract editable English text from a photo or screenshot with browser-based OCR.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/image-to-text"
        name="Image to Text OCR Converter"
        description="Recognize printed English text in JPG, PNG and WebP images using browser-based OCR. Edit, copy or download the recognized text as a TXT file."
        applicationCategory="UtilitiesApplication"
        features={[
          "Extract printed English text from images",
          "Accept JPG, PNG and WebP files up to 12 MB",
          "Show OCR recognition progress",
          "Edit recognized text before using it",
          "Copy extracted text to the clipboard",
          "Download extracted text as a TXT file",
          "Process the selected image in the browser",
        ]}
      />
      <OCRTool />
    </>
  );
}
