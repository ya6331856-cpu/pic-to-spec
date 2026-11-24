import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
export const metadata: Metadata = { title: "Bulk Image Renamer & Watermark Tool — Free Online Tool", description: "Rename up to 30 JPG, PNG and WebP images in your browser. Add optional text watermarks and download a ZIP. No upload required.", alternates: { canonical: "/bulk-image-renamer-watermark" } };
export default function Page() { return <ImageBatchTools mode="batch" />; }
