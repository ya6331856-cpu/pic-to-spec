import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image Color Picker – Get HEX, RGB & HSL from a Photo",
  description:
    "Upload a JPG, PNG or WebP image and click a pixel to read its HEX, RGB and HSL color codes. Copy color values with this free browser-based image color picker.",
  alternates: { canonical: "/image-color-picker" },
  openGraph: {
    title: "Image Color Picker – HEX, RGB & HSL | PicToSpec",
    description:
      "Sample a pixel from a JPG, PNG or WebP image and copy its HEX, RGB or HSL color value.",
    type: "website",
    url: "https://pictospec.com/image-color-picker",
  },
  twitter: {
    card: "summary",
    title: "Image Color Picker | PicToSpec",
    description:
      "Pick a pixel from an image and get its HEX, RGB and HSL color codes.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/image-color-picker"
        name="Image Color Picker"
        description="Sample pixels from JPG, PNG and WebP images in the browser and read their HEX, RGB and HSL color values."
        applicationCategory="UtilitiesApplication"
        features={[
          "Upload JPG, PNG and WebP images",
          "Sample a pixel by clicking or tapping the image",
          "Read HEX color values",
          "Read RGB color values",
          "Read HSL color values",
          "Copy HEX and RGB values",
          "Process the image locally in the browser",
          "Support image files up to 25 MB",
        ]}
      />
      <ImageUtilityTool kind="color" />
      <main className="seo-page">
        <p className="kicker">IMAGE COLOR PICKER</p>
        <h2>Pick a color from an image</h2>
        <p className="lead">
          Upload a photo, screenshot, logo or design image, load it into the picker, then click or tap
          the pixel whose color you want to inspect. PicToSpec displays the sampled color as HEX, RGB and HSL.
        </p>
        <h2>How to use the image color picker</h2>
        <ol>
          <li>Choose a JPG, PNG or WebP image smaller than 25 MB.</li>
          <li>Press “Load image for color picking” to display the image on the sampling canvas.</li>
          <li>Click or tap the exact pixel you want to sample.</li>
          <li>Read the HEX, RGB and HSL values shown beside the color preview.</li>
          <li>Use Copy HEX or Copy RGB to copy a value for your design or code.</li>
        </ol>
        <h2>HEX, RGB and HSL color formats</h2>
        <ul>
          <li><strong>HEX:</strong> a six-digit hexadecimal color code such as #2F8A65, commonly used in CSS and design tools.</li>
          <li><strong>RGB:</strong> red, green and blue channel values from 0 to 255, for example rgb(47, 138, 101).</li>
          <li><strong>HSL:</strong> hue, saturation and lightness, useful when adjusting a color's tone or intensity.</li>
        </ul>
        <h2>Color sampling tips</h2>
        <ul>
          <li>Zoom in on the source image before choosing a pixel if you need a precise point.</li>
          <li>Photos contain lighting, shadows and compression, so nearby pixels may have different values.</li>
          <li>Transparent pixels are sampled from the image's stored RGB channels; this picker does not report alpha transparency.</li>
          <li>For a brand palette, sample several pixels and compare the results instead of relying on one point.</li>
        </ul>
        <h2>Frequently asked questions</h2>
        <div className="faq">
          <h3>Which image formats are supported?</h3>
          <p>The picker accepts JPG, PNG and WebP images up to 25 MB.</p>
        </div>
        <div className="faq">
          <h3>Can I use this color picker on a phone?</h3>
          <p>Yes. Upload an image and tap the pixel you want to sample. Accuracy depends on the screen and the selected point.</p>
        </div>
        <div className="faq">
          <h3>Does it show HEX, RGB and HSL?</h3>
          <p>Yes. It displays all three formats and provides copy buttons for HEX and RGB values.</p>
        </div>
        <div className="faq">
          <h3>Are my images uploaded to a server?</h3>
          <p>No. The image is loaded and sampled in your browser.</p>
        </div>
        <h2>Related image tools</h2>
        <p><a href="/image-converter">Image converter</a> · <a href="/image-cropper">Image cropper</a> · <a href="/image-compressor">Image compressor</a> · <a href="/base64-image-converter">Base64 image converter</a></p>
      </main>
    </>
  );
}
