import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
export const metadata: Metadata = { title: "Free Image Compressor — Reduce Image Size to KB Online", description: "Compress JPG, PNG and WebP images to a target KB size in your browser. Private image compression with no server upload.", alternates: { canonical: "/image-compressor" } };
export default function Page() { return <ImageWorkspace initialTool="compress" compact />; }
