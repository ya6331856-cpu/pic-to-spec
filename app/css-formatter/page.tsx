import type { Metadata } from "next";
import FormatterTool from "@/components/FormatterTool";
export const metadata: Metadata = { title: "CSS Formatter and Beautifier — PicToSpec", description: "Beautify CSS with consistent indentation and readable declarations using this free online CSS formatter.", alternates: { canonical: "/css-formatter" } };
export default function Page() { return <FormatterTool kind="css" />; }
