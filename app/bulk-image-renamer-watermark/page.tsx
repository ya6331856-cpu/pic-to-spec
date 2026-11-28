import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Bulk Image Renamer & Watermark Tool – Rename Images Online",
  description:
    "Rename up to 30 JPG, PNG and WebP images at once, add an optional text watermark and download the processed images in a ZIP. Free browser-based tool.",
  alternates: { canonical: "/bulk-image-renamer-watermark" },
  openGraph: {
    title: "Bulk Image Renamer & Watermark Tool | PicToSpec",
    description:
      "Batch rename up to 30 images, add optional text watermarks and download a ZIP without uploading your files.",
    type: "website",
    url: "https://pictospec.com/bulk-image-renamer-watermark",
  },
  twitter: {
    card: "summary",
    title: "Bulk Image Renamer & Watermark Tool | PicToSpec",
    description:
      "Rename multiple JPG, PNG and WebP images and optionally add a text watermark in your browser.",
  },
};

export default function Page() {
  return (
    <>
      <ToolStructuredData
        path="/bulk-image-renamer-watermark"
        name="Bulk Image Renamer and Watermark Tool"
        description="Rename up to 30 JPG, PNG and WebP images in one ZIP archive and optionally add a text watermark to each image locally in the browser."
        applicationCategory="UtilitiesApplication"
        features={[
          "Batch process up to 30 images",
          "Accept JPG, PNG and WebP files",
          "Set a filename prefix and starting number",
          "Choose the number of digits in filenames",
          "Add optional text watermarks",
          "Adjust watermark opacity and position",
          "Download processed images in a ZIP archive",
          "Process files locally in the browser",
          "Support images up to 20 MB each",
        ]}
      />
      <ImageBatchTools mode="batch" />
      <main className="seo-page">
        <p className="kicker">BULK IMAGE RENAMER & WATERMARK</p>
        <h2>Rename multiple images and add a text watermark</h2>
        <p className="lead">
          Give a group of images consistent filenames in one batch. Choose a filename prefix,
          starting number and number format, then optionally place a text watermark on each image.
          Download the processed copies together in one ZIP file.
        </p>
        <h2>How to rename images in bulk</h2>
        <ol>
          <li>Select up to 30 JPG, PNG or WebP images. Each file must be smaller than 20 MB.</li>
          <li>Enter a filename prefix such as product-photo or campaign.</li>
          <li>Choose the starting number and how many digits each number should use.</li>
          <li>Leave the watermark field empty if you only want to rename files.</li>
          <li>Choose “Rename images & download ZIP” and extract the downloaded archive.</li>
        </ol>
        <h2>How the filename pattern works</h2>
        <p>
          The tool adds a sequential number to your chosen prefix. For example, a prefix of
          <strong> product-photo</strong>, a starting number of 1 and three digits creates names
          such as product-photo-001, product-photo-002 and product-photo-003. The original file
          extensions are retained according to the actual exported image format.
        </p>
        <h2>Add an optional text watermark</h2>
        <p>
          Enter a short brand name, copyright notice or other text to apply it to each processed
          image. Adjust opacity and choose a corner or center position. The watermark is rendered
          into the downloaded image pixels, so it is not an editable layer and cannot be removed
          as a separate object afterward.
        </p>
        <h2>Supported images and processing limits</h2>
        <ul>
          <li>Formats: JPG/JPEG, PNG and WebP.</li>
          <li>Batch size: up to 30 images per selection.</li>
          <li>File size: less than 20 MB per image.</li>
          <li>Image dimensions: up to 40 megapixels per image.</li>
          <li>Output: a ZIP archive containing the renamed, processed copies.</li>
        </ul>
        <h2>Privacy and image quality</h2>
        <p>
          Images are processed locally in your browser; the tool does not upload them to PicToSpec.
          The original files are not modified. Canvas re-encoding can change file size or image
          encoding, and JPEG/WebP output may be recompressed. Keep a copy of your originals and
          inspect the ZIP before using the images elsewhere.
        </p>
        <h2>Frequently asked questions</h2>
        <div className="faq">
          <h3>Can I rename many images at once?</h3>
          <p>Yes. Select up to 30 supported images and download all renamed copies in one ZIP archive.</p>
        </div>
        <div className="faq">
          <h3>Do I have to add a watermark?</h3>
          <p>No. Leave the watermark text empty to rename and package the images without adding a watermark.</p>
        </div>
        <div className="faq">
          <h3>Can I choose where the watermark appears?</h3>
          <p>Yes. Choose a corner or the center, and adjust its opacity before processing.</p>
        </div>
        <div className="faq">
          <h3>Are the original images changed?</h3>
          <p>No. The tool creates processed copies in a ZIP file. Your selected original files remain unchanged.</p>
        </div>
        <h2>Related image tools</h2>
        <p><a href="/image-compressor">Image compressor</a> · <a href="/image-resizer">Image resizer</a> · <a href="/image-converter">Image converter</a> · <a href="/image-blur-pixelate-tool">Image blur and pixelate tool</a></p>
      </main>
    </>
  );
}
