import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
export const metadata: Metadata = { title: "Image Color Picker — Get HEX, RGB & HSL Codes", description: "Upload an image and click any pixel to get its HEX, RGB and HSL color values. Free browser-based color picker.", alternates: { canonical: "/image-color-picker" } };
export default function Page() { return <ImageUtilityTool kind="color" />; }
