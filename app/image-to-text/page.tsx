import type { Metadata } from "next";
import OCRTool from "@/components/OCRTool";
export const metadata: Metadata = {
 title: "Image to Text OCR – Extract Text from Photo Online",
 description: "Extract editable English text from JPG, PNG and WebP images with browser-based OCR. Copy or download recognized text and review it for accuracy.",
 alternates: { canonical: "https://pictospec.com/image-to-text" }
};
export default function Page(){return <OCRTool/>;}
