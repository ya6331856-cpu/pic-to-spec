import type { Metadata } from "next";
import ScheduleDeveloperTools from "@/components/ScheduleDeveloperTools";
export const metadata: Metadata = { title: "SQL Formatter — Format SQL Queries Online | PicToSpec", description: "Format SQL queries with readable indentation, uppercase keywords and clause breaks. Free browser-based SQL beautifier with copy and download.", alternates: { canonical: "/sql-formatter" } };
export default function Page() { return <ScheduleDeveloperTools mode="sql" />; }
