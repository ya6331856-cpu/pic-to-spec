import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pictospec.com"),
  title: { default: "PicToSpec — Resize, Compress & Convert Images Online", template: "%s | PicToSpec" },
  description: "Prepare photos and signatures for online forms. Compress images to a target KB size, resize pixels and convert JPG, PNG and WebP — privately in your browser.",
  applicationName: "PicToSpec",
  keywords: ["compress image to 50kb", "photo resize for online form", "signature resize", "image compressor", "JPG to WebP"],
  openGraph: { title: "PicToSpec — Images prepared to exact specifications", description: "Resize, compress and convert images in your browser. Your files stay on your device.", type: "website", siteName: "PicToSpec" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}