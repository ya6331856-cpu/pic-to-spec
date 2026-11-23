import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
export const metadata: Metadata = { title: "Percentage Calculator — Calculate Percentages Online", description: "Calculate what percentage one number is of another with this free, simple online percentage calculator.", alternates: { canonical: "/percentage-calculator" } };
export default function Page() { return <QuickTool kind="percentage" />; }
