import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
export const metadata: Metadata = { title: "Free Image Converter — Convert JPG, PNG and WebP Online", description: "Convert images between JPG, PNG and WebP formats in your browser. No server upload required.", alternates: { canonical: "/image-converter" } };
export default function Page() { return <ImageWorkspace initialTool="convert" />; }
