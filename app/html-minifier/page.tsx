import type { Metadata } from "next";
import MinifierTools from "@/components/MinifierTools";
export const metadata: Metadata = { title: "HTML Minifier — Compress HTML Online | PicToSpec", description: "Minify HTML online by removing comments and unnecessary whitespace between tags. Compare output size and copy or download compact HTML in your browser.", alternates: { canonical: "/html-minifier" } };
export default function Page() { return <MinifierTools mode="html" />; }
