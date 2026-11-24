import type { Metadata } from "next";
import FormRuleTool from "@/components/FormRuleTool";

export const metadata: Metadata = {
  title: "FormRule AI – Photo & Signature Size Checker",
  description: "Read photo and signature upload rules from a PDF or screenshot, confirm the requirements, and prepare a ready-to-upload ZIP pack in your browser.",
  alternates: { canonical: "https://pictospec.com/formrule-ai" }
};

export default function Page() { return <FormRuleTool />; }
