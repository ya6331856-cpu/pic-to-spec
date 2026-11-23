import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
export const metadata: Metadata = { title: "Free Image Cutter — Cut and Trim Image Online", description: "Cut or trim an image by selecting pixel coordinates and download the cropped result. Private browser-based image tool.", alternates: { canonical: "/image-cutter" } };
export default function Page() { return <ImageWorkspace initialTool="crop" />; }
