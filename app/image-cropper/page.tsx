import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
export const metadata: Metadata = { title: "Free Image Cropper — Crop Photos Online by Pixel Size", description: "Crop images by setting the left, top, width and height in pixels. Process photos privately in your browser.", alternates: { canonical: "/image-cropper" } };
export default function Page() { return <ImageWorkspace initialTool="crop" />; }
