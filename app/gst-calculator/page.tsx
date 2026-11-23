import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
export const metadata: Metadata = { title: "GST Calculator India — Calculate GST Amount and Total", description: "Calculate GST amount and total price using a selected GST rate. Free online GST calculator for quick estimates.", alternates: { canonical: "/gst-calculator" } };
export default function Page() { return <QuickTool kind="gst" />; }
