import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";

export const metadata: Metadata = {
  title: "GST Calculator India – Calculate CGST, SGST & IGST",
  description: "Calculate GST on a pre-tax amount with CGST and SGST for intra-state supplies or IGST for inter-state supplies. Free online GST calculator.",
  alternates: { canonical: "/gst-calculator" },
  openGraph: {
    title: "GST Calculator India – CGST, SGST & IGST | PicToSpec",
    description: "Work out GST on a taxable amount and view the CGST, SGST or IGST breakdown.",
    type: "website"
  }
};

export default function Page() {
  return <QuickTool kind="gst" />;
}
