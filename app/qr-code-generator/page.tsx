import type { Metadata } from "next";
import QRTool from "@/components/QRTool";
export const metadata: Metadata = { title: "QR Code Generator — Create and Download QR Codes Online", description: "Free QR code generator for website links and text. Customize size, preview, and download a PNG QR code directly in your browser.", alternates: { canonical: "/qr-code-generator" } };
export default function Page() { return <QRTool />; }
