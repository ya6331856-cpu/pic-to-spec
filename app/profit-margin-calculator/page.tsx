import type { Metadata } from "next";
import FinanceCalculatorTool from "@/components/FinanceCalculatorTool";
export const metadata: Metadata = { title: "Profit Margin & Markup Calculator — Business Pricing Tool", description: "Calculate profit or loss, profit margin and markup from cost and selling price with this free online business calculator.", alternates: { canonical: "/profit-margin-calculator" } };
export default function Page() { return <FinanceCalculatorTool kind="profit" />; }
