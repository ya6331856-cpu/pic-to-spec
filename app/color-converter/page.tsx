import type { Metadata } from "next";
import DeveloperUtilityTool from "@/components/DeveloperUtilityTool";
export const metadata: Metadata = { title: "HEX to RGB and HSL Color Converter — PicToSpec", description: "Convert HEX color codes to RGB and HSL values with a live color preview. Free browser-based color converter.", alternates: { canonical: "/color-converter" } };
export default function Page() { return <DeveloperUtilityTool kind="color" />; }
