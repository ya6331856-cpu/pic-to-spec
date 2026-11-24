import type { Metadata } from "next";
import PdfPageNumbersWatermarkTool from "@/components/PdfPageNumbersWatermarkTool";

export const metadata: Metadata = {
  title: "Add Page Numbers & Watermark to PDF Online",
  description: "Add page numbers, a diagonal text watermark, or both to selected PDF pages. Free browser-based PDF editor with no file upload.",
  alternates: { canonical: "https://pictospec.com/pdf-page-numbers-watermark" }
};

export default function Page() {
  return <PdfPageNumbersWatermarkTool />;
}
