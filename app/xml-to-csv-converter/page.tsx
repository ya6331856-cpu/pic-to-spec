import type { Metadata } from "next";
import XmlToCsvTool from "@/components/XmlToCsvTool";

export const metadata: Metadata = {
  title: "XML to CSV Converter – Convert XML Data to CSV Online",
  description:
    "Convert repeated XML records into CSV columns online. Flatten nested element paths, include attributes and download a spreadsheet-ready CSV in your browser.",
  alternates: { canonical: "/xml-to-csv-converter" },
};

export default function Page() {
  return <XmlToCsvTool />;
}
