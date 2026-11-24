import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
export const metadata: Metadata = { title: "Base64 to Image Converter — Image to Base64 Online", description: "Encode PNG, JPG and WebP images as Base64 data URLs or decode supported Base64 image data into a downloadable file. Local browser processing.", alternates: { canonical: "/base64-image-converter" } };
export default function Page() { return <ImageUtilityTool kind="base64" />; }
