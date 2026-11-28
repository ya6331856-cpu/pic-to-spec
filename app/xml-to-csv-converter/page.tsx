import type { Metadata } from "next";
import XmlToCsvTool from "@/components/XmlToCsvTool";
import ToolStructuredData from "@/components/ToolStructuredData";

const pageTitle = "XML to CSV Converter Online – Convert XML File to CSV";
const pageDescription =
  "Convert XML files or pasted XML data to CSV online. Export repeated records, XML attributes and nested element paths, then copy or download a spreadsheet-ready CSV in your browser.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/xml-to-csv-converter" },
  openGraph: {
    title: "Free XML to CSV Converter Online | PicToSpec",
    description:
      "Convert XML files and XML data into CSV rows and columns. Include attributes, review nested paths and download CSV locally.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML to CSV Converter Online | PicToSpec",
    description:
      "Upload an XML file or paste XML data, convert records to CSV and download the result in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/xml-to-csv-converter"
        name="Free XML to CSV Converter Online"
        description={pageDescription}
        applicationCategory="DeveloperApplication"
        features={[
          "Upload an XML file up to 2 MB or paste XML data",
          "Convert repeated XML records into CSV rows",
          "Include XML attributes as columns with @ prefixes",
          "Represent nested element paths with dotted column names",
          "Copy CSV output or download a UTF-8 CSV file",
          "Process XML locally in the browser without uploading it",
        ]}
      />
      <XmlToCsvTool />
    </>
  );
}
