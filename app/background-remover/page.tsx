import type { Metadata } from "next";
import BackgroundRemoverTool from "@/components/BackgroundRemoverTool";

export const metadata: Metadata = {
  title: "Free AI Background Remover – Make Image Background Transparent",
  description: "Remove photo backgrounds online with AI. Create transparent PNG images in your browser for product photos, portraits and profile pictures. Free, no sign-up.",
  alternates: { canonical: "https://pictospec.com/background-remover" }
};

export default function Page() {
  return <BackgroundRemoverTool />;
}
