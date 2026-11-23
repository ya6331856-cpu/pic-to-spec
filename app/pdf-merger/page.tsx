import type { Metadata } from "next";
import PDFTool from "@/components/PDFTool";
export const metadata: Metadata = { title: "Merge PDF Files Online Free", description: "Combine multiple PDF files into one document online. Merge PDFs in your browser without uploading files.", alternates: { canonical: "https://pictospec.com/pdf-merger" } };
export default function Page(){return <PDFTool kind="merge"/>;}
