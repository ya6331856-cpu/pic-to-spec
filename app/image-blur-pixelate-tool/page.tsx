import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
export const metadata: Metadata = { title: "Image Blur & Pixelate Tool — Free Online Tool", description: "Blur or pixelate a selected rectangular image region to obscure private details. Process images locally in your browser.", alternates: { canonical: "/image-blur-pixelate-tool" } };
export default function Page() { return <ImageBatchTools mode="effect" />; }
