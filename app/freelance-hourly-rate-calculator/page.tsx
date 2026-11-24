import type { Metadata } from "next";
import FinanceCalculatorTool from "@/components/FinanceCalculatorTool";
export const metadata: Metadata = { title: "Freelance Hourly Rate Calculator — Set Your Project Rate", description: "Estimate a freelance hourly rate from your target income, monthly expenses, billable hours and tax estimate with this free calculator.", alternates: { canonical: "/freelance-hourly-rate-calculator" } };
export default function Page() { return <FinanceCalculatorTool kind="freelance" />; }
