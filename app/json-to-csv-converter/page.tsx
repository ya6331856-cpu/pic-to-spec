import type { Metadata } from "next";
import DeveloperTool from "@/components/DeveloperTool";
export const metadata: Metadata = {title:"JSON to CSV Converter — Export JSON to Excel Online",description:"Convert JSON arrays to CSV for Excel and spreadsheets. Flatten nested objects, choose delimiters, protect formula-like values and download locally.",alternates:{canonical:"/json-to-csv-converter"}};
export default function Page(){return <DeveloperTool kind="csv-json-converter" initialMode="json-csv"/>;}
