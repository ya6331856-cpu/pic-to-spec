import type { Metadata } from "next";
import TextTool from "@/components/TextTool";
export const metadata: Metadata = { title: "Base64 Encoder & Decoder — Convert Text Online", description: "Encode text to Base64 or decode Base64 to readable text online. Free browser-based Base64 converter.", alternates: { canonical: "/base64-encoder-decoder" } };
export default function Page() { return <TextTool kind="base64-encoder-decoder" />; }
