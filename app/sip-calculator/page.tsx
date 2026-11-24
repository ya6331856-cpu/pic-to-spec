import type { Metadata } from "next";
import FinanceCalculatorTool from "@/components/FinanceCalculatorTool";
export const metadata: Metadata = { title: "SIP Calculator — Estimate Mutual Fund Investment Returns", description: "Estimate SIP maturity value, invested amount and potential returns with a free monthly investment calculator. Returns are illustrative, not guaranteed.", alternates: { canonical: "/sip-calculator" } };
export default function Page() { return <FinanceCalculatorTool kind="sip" />; }
