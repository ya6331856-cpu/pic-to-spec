import type { Metadata } from "next";
import CssGradientGenerator from "@/components/CssGradientGenerator";
export const metadata: Metadata = { title: "CSS Gradient Generator — PicToSpec", description: "Create linear and radial CSS gradients, customize color stops and copy CSS code with this free online gradient generator.", alternates: { canonical: "/css-gradient-generator" } };
export default function Page() { return <CssGradientGenerator />; }
