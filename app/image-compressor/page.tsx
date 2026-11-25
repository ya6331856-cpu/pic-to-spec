import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";

export const metadata: Metadata = {
  title: "Online Image Compressor for JPG, PNG & WebP",
  description: "Reduce JPG, PNG and WebP file sizes with a custom KB target. Compress images privately in your browser, check the result and download it.",
  alternates: { canonical: "/image-compressor" },
  openGraph: {
    title: "Online Image Compressor for JPG, PNG & WebP | PicToSpec",
    description: "Choose a target file size, compress an image in your browser and download the result privately.",
    type: "website"
  }
};

export default function Page() {
  return <ImageWorkspace initialTool="compress" compact />;
}
