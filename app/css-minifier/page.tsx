import type { Metadata } from "next";
import CssMinifierTool from "@/components/CssMinifierTool";
export const metadata: Metadata = { title: "CSS Minifier — Compress CSS Online | PicToSpec", description: "Minify CSS online by removing comments and unnecessary whitespace. Compare output size and copy or download compact CSS in your browser.", alternates: { canonical: "/css-minifier" } };
export default function Page() { return <CssMinifierTool />; }
