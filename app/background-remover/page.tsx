import type { Metadata } from "next";
import BackgroundRemoverTool from "@/components/BackgroundRemoverTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "AI Background Remover Online – Transparent PNG Free",
  description:
    "Remove a photo background with AI and download a transparent PNG or choose a white, light grey or black background. Runs in your browser; first use downloads an AI model.",
  alternates: { canonical: "/background-remover" },
  openGraph: {
    title: "AI Background Remover Online – Transparent PNG | PicToSpec",
    description:
      "Remove photo backgrounds in your browser. Preview the cutout and download a transparent PNG or choose a solid background.",
    type: "website",
    url: "https://pictospec.com/background-remover",
  },
  twitter: {
    card: "summary",
    title: "AI Background Remover Online | PicToSpec",
    description:
      "Create a transparent PNG from a JPG, PNG or WebP photo with browser-based AI background removal.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/background-remover"
        name="AI Background Remover Online"
        description="Remove the background from a JPG, PNG or WebP image using an AI model in the browser. Preview and download a transparent PNG or place the cutout on a white, light grey or black background."
        applicationCategory="UtilitiesApplication"
        features={[
          "Remove backgrounds from JPG, PNG and WebP images",
          "Create a transparent PNG",
          "Choose white, light grey or black output backgrounds",
          "Preview the original image and processed result",
          "Process images locally in the browser",
          "Support images up to 25 MB, subject to device capability",
        ]}
      />
      <BackgroundRemoverTool />
    </>
  );
}
