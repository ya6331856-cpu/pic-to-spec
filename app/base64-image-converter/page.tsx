import type { Metadata } from "next";
import ImageUtilityTool from "@/components/ImageUtilityTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Base64 to Image Converter – Image to Base64 Online",
  description:
    "Convert PNG, JPG, WebP, GIF or BMP images to Base64 data URLs, or decode a Base64 image data URL and download the image. Free browser-based converter.",
  alternates: { canonical: "/base64-image-converter" },
  openGraph: {
    title: "Base64 to Image Converter | PicToSpec",
    description:
      "Encode an image as a Base64 data URL or decode supported Base64 image data into a downloadable file in your browser.",
    type: "website",
    url: "https://pictospec.com/base64-image-converter",
  },
  twitter: {
    card: "summary",
    title: "Base64 to Image Converter | PicToSpec",
    description:
      "Convert PNG, JPG, WebP, GIF and BMP images to Base64 or decode an image data URL.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/base64-image-converter"
        name="Base64 to Image and Image to Base64 Converter"
        description="Encode PNG, JPEG, WebP, GIF and BMP image files as Base64 data URLs or decode supported Base64 image data URLs into downloadable files locally in the browser."
        applicationCategory="UtilitiesApplication"
        features={[
          "Convert PNG, JPG, WebP, GIF and BMP images to Base64 data URLs",
          "Decode supported Base64 image data URLs into downloadable files",
          "Copy the generated Base64 data URL",
          "Validate supported image MIME types and Base64 input",
          "Process files locally in the browser",
          "Support image files up to 25 MB",
        ]}
      />
      <ImageUtilityTool kind="base64" />
      <main className="seo-page">
        <p className="kicker">BASE64 IMAGE CONVERTER</p>
        <h2>Convert an image to Base64 or Base64 back to an image</h2>
        <p className="lead">
          This two-way converter creates a Base64 data URL from an image file or decodes a supported
          image data URL into a downloadable file. Processing takes place in your browser.
        </p>
        <h2>Image to Base64: how it works</h2>
        <ol>
          <li>Choose a PNG, JPG, WebP, GIF or BMP image smaller than 25 MB.</li>
          <li>Select “Image → Base64” to read the file and create its data URL.</li>
          <li>Use “Copy data URL” to copy the result, or select the text to copy part of it.</li>
          <li>Paste the data URL into a project or application that accepts Base64 image data.</li>
        </ol>
        <h2>Base64 to image: how to decode</h2>
        <ol>
          <li>Paste a complete image data URL beginning with a supported type, such as data:image/png;base64,.</li>
          <li>Select “Base64 → Download image”.</li>
          <li>The browser decodes the data and downloads a file using the MIME type in the data URL.</li>
        </ol>
        <h2>What is an image Base64 data URL?</h2>
        <p>
          A data URL contains a media type, an encoding declaration and Base64-encoded file data.
          It can be useful for embedding small images in HTML, CSS, prototypes or data fields that
          accept data URLs. Base64 is an encoding format, not image compression or encryption.
        </p>
        <h2>Supported formats and size</h2>
        <p>
          The upload accepts PNG, JPG/JPEG, WebP, GIF and BMP files up to 25 MB. The decoder accepts
          image data URLs for those same MIME types. A Base64 string is larger than the original
          binary file, so the text output can be lengthy—especially for large images.
        </p>
        <h2>Privacy and practical tips</h2>
        <ul>
          <li>Files are read in your browser and are not uploaded to PicToSpec.</li>
          <li>Base64 does not reduce file size; it typically increases the encoded data length by about one third.</li>
          <li>A very large data URL can make a web page or application slower and use more memory.</li>
          <li>Only decode data URLs from sources you trust, and avoid pasting private image data into public websites.</li>
        </ul>
        <h2>Frequently asked questions</h2>
        <div className="faq">
          <h3>Does Base64 make an image smaller?</h3>
          <p>No. Base64 is an encoding method, not a compression method. The encoded text is usually larger than the original image file.</p>
        </div>
        <div className="faq">
          <h3>Can I convert Base64 back to an image?</h3>
          <p>Yes. Paste a supported Base64 image data URL and use the download action to decode it into a file.</p>
        </div>
        <div className="faq">
          <h3>Which formats can I use?</h3>
          <p>PNG, JPG/JPEG, WebP, GIF and BMP are supported for upload and decoding.</p>
        </div>
        <div className="faq">
          <h3>Is my image uploaded?</h3>
          <p>No. The browser reads and encodes the selected file locally.</p>
        </div>
        <h2>Related tools</h2>
        <p><a href="/image-converter">Image converter</a> · <a href="/image-compressor">Image compressor</a> · <a href="/image-color-picker">Image color picker</a> · <a href="/image-resizer">Image resizer</a></p>
      </main>
    </>
  );
}
