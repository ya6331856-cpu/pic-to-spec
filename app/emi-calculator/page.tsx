import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
export const metadata: Metadata = { title: "EMI Calculator — Calculate Monthly Loan EMI Online", description: "Estimate monthly loan EMI, total payment and interest using loan amount, annual interest rate and tenure.", alternates: { canonical: "/emi-calculator" } };
export default function Page() { return <QuickTool kind="emi" />; }
