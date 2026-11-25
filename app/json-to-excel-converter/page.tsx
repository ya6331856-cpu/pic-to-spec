import type { Metadata } from "next";
import JsonToExcelTool from "@/components/JsonToExcelTool";
export const metadata: Metadata = { title: "JSON to Excel Converter — Export XLSX Online", description: "Convert JSON arrays to real Excel XLSX workbooks online. Flatten nested fields, preserve numbers and download securely in your browser.", alternates: { canonical: "/json-to-excel-converter" } };
export default function Page() { return <JsonToExcelTool />; }
