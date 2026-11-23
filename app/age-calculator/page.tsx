import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
export const metadata: Metadata = { title: "Age Calculator — Calculate Age in Years, Months and Days", description: "Calculate exact age from date of birth in years, months and days using this free online age calculator.", alternates: { canonical: "/age-calculator" } };
export default function Page() { return <QuickTool kind="age" />; }
