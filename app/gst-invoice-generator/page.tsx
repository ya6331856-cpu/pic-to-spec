import type { Metadata } from "next";
import GSTInvoiceTool from "@/components/GSTInvoiceTool";
export const metadata: Metadata = {
 title: "GST Invoice Generator – Create Invoice PDF Online",
 description: "Create a simple GST invoice PDF with seller and buyer details, taxable value and CGST, SGST or IGST estimates. Review tax rules before issuing.",
 alternates: { canonical: "https://pictospec.com/gst-invoice-generator" }
};
export default function Page(){return <GSTInvoiceTool/>;}
