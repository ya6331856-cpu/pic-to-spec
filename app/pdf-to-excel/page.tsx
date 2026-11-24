import type { Metadata } from "next";
import PDFToExcelTool from "@/components/PDFToExcelTool";

export const metadata: Metadata = {
  title: "PDF to Excel Converter – Extract PDF Tables to XLSX",
  description: "Extract text and table-like rows from PDF files into an editable Excel XLSX spreadsheet. Choose pages and convert in your browser for free.",
  alternates: { canonical: "https://pictospec.com/pdf-to-excel" }
};

export default function Page() {
  return <PDFToExcelTool />;
}
