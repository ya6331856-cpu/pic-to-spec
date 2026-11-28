import type { Metadata } from "next";
import QuickTool from "@/components/QuickTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "GST Calculator India – Calculate CGST, SGST & IGST",
  description:
    "Calculate GST on a pre-tax amount in India. See the CGST and SGST split for within-state supplies or IGST for interstate supplies with this free GST calculator.",
  alternates: { canonical: "/gst-calculator" },
  openGraph: {
    title: "GST Calculator India – CGST, SGST & IGST | PicToSpec",
    description:
      "Calculate GST on a taxable amount and view the CGST, SGST or IGST breakdown. Free India GST calculator.",
    type: "website",
    url: "https://pictospec.com/gst-calculator",
  },
  twitter: {
    card: "summary",
    title: "GST Calculator India | PicToSpec",
    description:
      "Calculate GST on a pre-tax amount and view the CGST, SGST or IGST breakdown.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/gst-calculator"
        name="GST Calculator India"
        description="A free online calculator that estimates GST on a pre-tax amount and displays CGST plus SGST for within-state supplies or IGST for interstate supplies."
        applicationCategory="FinanceApplication"
        features={[
          "Calculate GST on a pre-tax amount",
          "View CGST and SGST for within-state supplies",
          "View IGST for interstate supplies",
          "Choose a GST percentage rate",
          "Calculate locally in the browser",
        ]}
      />
      <QuickTool kind="gst" />
    </>
  );
}
