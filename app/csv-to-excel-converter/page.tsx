import type { Metadata } from "next";
import CsvToExcelTool from "@/components/CsvToExcelTool";
export const metadata: Metadata = { title: "CSV to Excel Converter — Create XLSX Online", description: "Convert CSV data to a real Excel XLSX workbook online. Choose comma, semicolon or tab delimiters and preserve leading zeros. Free browser-based tool.", alternates: { canonical: "/csv-to-excel-converter" } };
export default function Page() { return <CsvToExcelTool />; }
