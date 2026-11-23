import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
export const metadata: Metadata = { title: "Discount Calculator — Sale Price and Savings", description: "Calculate the final price after discount and see how much money you save with this free discount calculator.", alternates: { canonical: "/discount-calculator" } };
export default function Page() { return <QuickTool kind="discount" />; }
