import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
export const metadata: Metadata = { title: "JPG to PDF Converter Online Free", description: "Convert JPG and PNG images into an A4 PDF document online. Create a PDF from images in your browser.", alternates: { canonical: "https://pictospec.com/jpg-to-pdf" } };
export default function Page(){return <PDFTool kind="jpg"/>;}
