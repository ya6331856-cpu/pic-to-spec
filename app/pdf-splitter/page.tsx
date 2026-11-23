import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
export const metadata: Metadata = { title: "Split PDF Pages Online Free | PicToSpec", description: "Extract a page range from a PDF and save it as a new PDF file. Private browser-based PDF splitter.", alternates: { canonical: "https://pictospec.com/pdf-splitter" } };
export default function Page(){return <PDFTool kind="split"/>;}
