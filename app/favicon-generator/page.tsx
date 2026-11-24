import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
export const metadata: Metadata = { title: "ICO & Favicon Generator — Create favicon.ico Online", description: "Create a downloadable PNG-backed ICO favicon from your image in your browser. Free, private and no upload required.", alternates: { canonical: "/favicon-generator" } };
export default function Page() { return <ImageUtilityTool kind="favicon" />; }
