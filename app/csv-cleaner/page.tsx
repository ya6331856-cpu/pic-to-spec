import type { Metadata } from "next";
import UtilityTool from "@/components/UtilityTool";
export const metadata: Metadata = { title: "CSV Cleaner Online — Remove Duplicates & Spaces", description: "Clean CSV files online. Trim cell spaces, remove blank rows and duplicate records, preview the cleaned data and download a safer CSV in your browser.", alternates: { canonical: "/csv-cleaner" } };
export default function Page() { return <UtilityTool kind="csv-cleaner" />; }
