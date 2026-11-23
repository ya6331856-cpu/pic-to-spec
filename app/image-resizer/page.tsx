import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
export const metadata: Metadata = { title: "Free Image Resizer — Resize Photos to Exact Pixels Online", description: "Resize images to custom pixel dimensions, keep aspect ratio and prepare photos for online forms directly in your browser.", alternates: { canonical: "/image-resizer" } };
export default function Page() { return <ImageWorkspace initialTool="resize" />; }
