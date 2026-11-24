import type { Metadata } from "next";
import DataCompareTool from "@/components/DataCompareTool";
export const metadata: Metadata = { title: "SQL to JSON Converter — Convert INSERT Statements | PicToSpec", description: "Convert SQL INSERT statements into JSON records online. Supports multiple rows, quoted strings, numbers, NULL and boolean values in your browser.", alternates: { canonical: "/sql-to-json-converter" } };
export default function Page() { return <DataCompareTool mode="sql-json" />; }
