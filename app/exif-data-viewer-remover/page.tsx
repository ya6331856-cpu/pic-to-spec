import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "EXIF Data Viewer & Remover – View Photo Metadata Online",
  description:
    "View common camera and date EXIF fields in JPEG photos, or re-encode JPG, PNG and WebP images to remove supported metadata. Free browser-based tool.",
  alternates: { canonical: "/exif-data-viewer-remover" },
  openGraph: {
    title: "EXIF Data Viewer & Metadata Remover | PicToSpec",
    description:
      "Inspect common JPEG EXIF details and download a re-encoded image with supported metadata removed.",
    type: "website",
    url: "https://pictospec.com/exif-data-viewer-remover",
  },
  twitter: {
    card: "summary",
    title: "EXIF Data Viewer & Remover | PicToSpec",
    description:
      "View common JPEG EXIF fields or re-encode JPG, PNG and WebP images to remove supported metadata.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/exif-data-viewer-remover"
        name="EXIF Data Viewer and Metadata Remover"
        description="Inspect common camera and date EXIF fields in JPEG images and re-encode JPG, PNG and WebP images in the browser to remove metadata supported by browser canvas."
        applicationCategory="UtilitiesApplication"
        features={[
          "Inspect common EXIF camera and date fields in JPEG files",
          "Re-encode JPG, PNG and WebP images",
          "Download a processed copy with supported metadata removed",
          "Process images locally in the browser",
          "Support images up to 20 MB",
          "Apply a 40-megapixel processing safety limit",
        ]}
      />
      <ImageBatchTools mode="exif" />
    </>
  );
}
