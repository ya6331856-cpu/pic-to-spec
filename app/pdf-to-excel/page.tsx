import type { Metadata } from "next";
import PDFToExcelTool from "@/components/PDFToExcelTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "PDF to Excel Converter – Extract PDF Data to XLSX",
  description:
    "Extract selectable PDF text and table-like rows into an editable Excel XLSX file. Choose up to 40 pages, download your spreadsheet, and review column alignment. Scanned PDFs need OCR.",
  alternates: { canonical: "/pdf-to-excel" },
  openGraph: {
    title: "PDF to Excel Converter | PicToSpec",
    description:
      "Turn selectable PDF text into an editable XLSX spreadsheet with page-range selection and browser-based processing.",
    type: "website",
    url: "https://pictospec.com/pdf-to-excel",
  },
  twitter: {
    card: "summary",
    title: "PDF to Excel Converter | PicToSpec",
    description:
      "Extract text and approximate table rows from PDF pages into an editable Excel workbook.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/pdf-to-excel"
        name="PDF to Excel Converter"
        description="A browser-based PDF text extraction tool that groups selectable PDF text into approximate rows and columns and exports an editable XLSX workbook. It does not guarantee exact table reconstruction."
        applicationCategory="UtilitiesApplication"
        features={[
          "Extract selectable text and numbers from PDF pages",
          "Group text into approximate table-like rows and columns",
          "Choose a page range of up to 40 pages per conversion",
          "Export editable XLSX spreadsheet cells",
          "Process PDF files locally in the browser",
          "Support PDF files up to 40 MB and documents up to 200 pages",
        ]}
      />
      <PDFToExcelTool />
    </>
  );
}
