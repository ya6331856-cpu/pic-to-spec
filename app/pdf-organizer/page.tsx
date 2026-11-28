import type { Metadata } from "next";
import PDFOrganizerTool from "@/components/PDFOrganizerTool";
import PDFOrganizerGuide from "@/components/PDFOrganizerGuide";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Organize PDF Pages Online – Reorder, Delete & Rotate",
  description:
    "Reorder PDF pages, remove unwanted pages, and rotate pages before downloading an organized PDF. Make page changes locally in your browser without uploading your file.",
  alternates: { canonical: "/pdf-organizer" },
  openGraph: {
    title: "Organize PDF Pages Online | PicToSpec",
    description:
      "Rearrange PDF page order, remove pages you do not need, and rotate pages in your browser. Download the updated PDF.",
    type: "website",
    url: "https://pictospec.com/pdf-organizer",
  },
  twitter: {
    card: "summary",
    title: "PDF Page Organizer – PicToSpec",
    description:
      "Reorder, remove, and rotate PDF pages, then download your organized document.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-organizer"
        name="PDF Page Organizer"
        description="A browser-based PDF page organizer for rearranging page order, removing unwanted pages, and rotating pages before downloading an updated PDF."
        applicationCategory="UtilitiesApplication"
        features={[
          "Reorder PDF pages",
          "Remove unwanted PDF pages",
          "Rotate selected PDF pages",
          "Process files locally in the browser",
          "Download the organized PDF",
        ]}
      />
      <PDFOrganizerTool />
      <PDFOrganizerGuide />
    </>
  );
}
