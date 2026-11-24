import type { Metadata } from "next";
import XmlToCsvTool from "@/components/XmlToCsvTool";
export const metadata: Metadata = {title:"XML to CSV Converter — Convert XML to Spreadsheet Online",description:"Convert XML records, elements and attributes into CSV columns online. Preview, copy or download CSV in your browser with no upload.",alternates:{canonical:"/xml-to-csv-converter"}};
export default function Page(){return <XmlToCsvTool/>;}
