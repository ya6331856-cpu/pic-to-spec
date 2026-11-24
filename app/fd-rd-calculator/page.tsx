import type { Metadata } from "next";
import FinanceCalculatorTool from "@/components/FinanceCalculatorTool";
export const metadata: Metadata = { title: "FD & RD Calculator — Estimate Deposit Maturity Value", description: "Estimate fixed deposit maturity and recurring deposit value with transparent compounding assumptions using this free FD and RD calculator.", alternates: { canonical: "/fd-rd-calculator" } };
export default function Page() { return <FinanceCalculatorTool kind="fd-rd" />; }
