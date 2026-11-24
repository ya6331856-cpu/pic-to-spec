import type { Metadata } from "next";
import FinanceCalculatorTool from "@/components/FinanceCalculatorTool";
export const metadata: Metadata = { title: "Simple & Compound Interest Calculator — Compare Returns", description: "Calculate simple interest and compound interest side by side with selectable compounding frequency using this free online calculator.", alternates: { canonical: "/simple-compound-interest-calculator" } };
export default function Page() { return <FinanceCalculatorTool kind="interest" />; }
