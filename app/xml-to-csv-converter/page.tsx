import type { Metadata } from "next";
import XmlToCsvTool from "@/components/XmlToCsvTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "XML to CSV Converter – Convert XML Data to CSV Online",
  description:
    "Convert repeated XML records into CSV columns online. Flatten nested element paths, include attributes and download a spreadsheet-ready CSV in your browser.",
  alternates: { canonical: "/xml-to-csv-converter" },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/xml-to-csv-converter"
        name="XML to CSV Converter"
        description="Convert repeated XML records into CSV columns in your browser. Export XML attributes and nested element paths."
        applicationCategory="DeveloperApplication"
        features={[
          "Convert repeated XML records into CSV rows",
          "Map element names to columns",
          "Include XML attributes with @ prefixes",
          "Represent nested paths with dotted column names",
          "Copy or download CSV output",
        ]}
      />
      <XmlToCsvTool />
    </>
  );
}
