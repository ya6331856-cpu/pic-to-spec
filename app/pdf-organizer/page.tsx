import type { Metadata } from "next";
import PDFOrganizerTool from "@/components/PDFOrganizerTool";
export const metadata: Metadata = {
 title: "PDF Page Organizer – Reorder, Remove & Rotate Pages",
 description: "Reorder PDF pages, remove unwanted pages and rotate included pages online. Process PDFs locally in your browser and download the organized file.",
 alternates: { canonical: "https://pictospec.com/pdf-organizer" }
};
export default function Page(){return <PDFOrganizerTool/>;}
