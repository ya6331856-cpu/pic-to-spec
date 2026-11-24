import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
export const metadata: Metadata = { title: "EXIF Data Viewer & Remover — Free Online Tool", description: "View common JPEG EXIF camera and date fields, or re-encode JPG, PNG and WebP images to remove embedded metadata in your browser.", alternates: { canonical: "/exif-data-viewer-remover" } };
export default function Page() { return <ImageBatchTools mode="exif" />; }
