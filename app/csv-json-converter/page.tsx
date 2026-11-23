import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
export const metadata: Metadata = {title:"CSV to JSON Converter — Convert CSV and JSON Online | PicToSpec",description:"Convert CSV data to JSON objects or JSON arrays to CSV online. Handles quoted commas, quotes and line breaks in your browser.",alternates:{canonical:"/csv-json-converter"}};
export default function Page(){return <DeveloperTool kind="csv-json-converter"/>;}
