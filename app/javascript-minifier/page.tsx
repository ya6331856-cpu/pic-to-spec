import type { Metadata } from "next";
import MinifierTools from "@/components/MinifierTools";
export const metadata: Metadata = { title: "JavaScript Minifier — Minify JS Online | PicToSpec", description: "Minify JavaScript online by removing comments and unnecessary whitespace. Preview output size and copy or download compact JS locally in your browser.", alternates: { canonical: "/javascript-minifier" } };
export default function Page() { return <MinifierTools mode="javascript" />; }
