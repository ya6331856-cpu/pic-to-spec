import type { Metadata } from "next";
import ImageBatchTools from "@/components/ImageBatchTools";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Blur & Pixelate Image Online – Hide Parts of a Photo",
  description:
    "Blur or pixelate a rectangular area of a JPG, PNG or WebP image. Set the region with percentage coordinates and download the edited image in your browser.",
  alternates: { canonical: "/image-blur-pixelate-tool" },
  openGraph: {
    title: "Free Image Blur & Pixelate Tool | PicToSpec",
    description:
      "Apply blur or pixelation to a selected rectangular image region using percentage coordinates. Browser-based image editing.",
    type: "website",
    url: "https://pictospec.com/image-blur-pixelate-tool",
  },
  twitter: {
    card: "summary",
    title: "Image Blur & Pixelate Tool | PicToSpec",
    description:
      "Blur or pixelate a rectangular region of an image and download the edited result.",
  },
};

const faqs = [
  [
    "How do I blur part of an image?",
    "Choose a JPG, PNG or WebP image, select Blur as the effect, set the Left, Top, Width and Height percentages for the region, adjust blur strength and apply the effect. The edited image downloads to your device.",
  ],
  [
    "How do I pixelate a face or part of a photo?",
    "Choose Pixelate, set the rectangular region around the area you want to change using percentage coordinates, choose a pixel block size and apply the effect. Inspect the downloaded image at full size before sharing.",
  ],
  [
    "What do Left and Top percentages mean?",
    "Left is the horizontal starting position measured from the image's left edge, and Top is the vertical starting position measured from its top edge. Width and Height describe the region size as percentages of the original image.",
  ],
  [
    "Can I blur a license plate, face or address?",
    "The tool can blur or pixelate a rectangular region, but it is not a secure redaction tool. Blur and pixelation may leave details partly recognizable. For highly sensitive information, use a fully opaque solid cover and verify the exported file before sharing; this tool does not provide an opaque redaction mode.",
  ],
  [
    "Can I choose between blur and pixelation?",
    "Yes. The Effect selector offers Blur and Pixelate. Blur strength controls the blur radius, while Pixel block size controls how strongly the selected region is pixelated.",
  ],
  [
    "Which image formats are supported?",
    "The tool accepts JPG, PNG and WebP images. The edited image is exported in the same supported format as the selected source file.",
  ],
  [
    "Does the tool change the whole image?",
    "The effect is applied to the selected rectangular region. The rest of the image is retained. Coordinates are percentages of the original image dimensions.",
  ],
  [
    "Are my images uploaded to PicToSpec?",
    "The image effect is processed locally in your browser in this version. The selected image is not sent to a PicToSpec image-processing server.",
  ],
  [
    "What are the upload and processing limits?",
    "The tool accepts one JPG, PNG or WebP image up to 20 MB per operation and applies a 40-megapixel processing safety limit.",
  ],
];

export default function ImageBlurPixelatePage() {
  return (
    <>
      <ImageBatchTools mode="effect" />
      <main className="seo-page">
        <ToolStructuredData
          path="/image-blur-pixelate-tool"
          name="Online Image Blur and Pixelate Tool"
          description="Apply blur or pixelation to a rectangular region of a JPG, PNG or WebP image using percentage coordinates. Process the image locally in the browser."
          applicationCategory="UtilitiesApplication"
          features={[
            "Blur a selected rectangular image region",
            "Pixelate a selected rectangular image region",
            "Set Left, Top, Width and Height as percentages",
            "Adjust blur strength or pixel block size",
            "Accept JPG, PNG and WebP images",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE IMAGE PRIVACY & EFFECT TOOL</p>
        <h2>Blur or pixelate a selected part of an image</h2>
        <p className="lead">
          Hide or soften a rectangular area in a photo, screenshot or graphic with PicToSpec.
          Choose blur for a softened appearance or pixelation for a block-style effect. Set the
          region with percentage coordinates, apply the effect and download the edited image.
        </p>
        <a className="seo-cta" href="#tools">Open the blur and pixelate tool →</a>

        <h2>How to blur or pixelate an image area</h2>
        <ol>
          <li>Choose one JPG, PNG or WebP image (up to 20 MB).</li>
          <li>Select Blur or Pixelate from the Effect menu.</li>
          <li>Set Left and Top to position the rectangular region within the image.</li>
          <li>Set Width and Height to control the region's size.</li>
          <li>Adjust blur strength or pixel block size, then apply the effect.</li>
          <li>Open and inspect the downloaded image before sharing it.</li>
        </ol>

        <h2>Blur vs pixelate: what is the difference?</h2>
        <h3>Blur</h3>
        <p>
          Blur softens detail inside the selected rectangle. It can create a subtle visual effect
          or make a region less prominent, but it should not be treated as secure removal of
          private information.
        </p>
        <h3>Pixelate</h3>
        <p>
          Pixelation replaces detail with larger colour blocks. A larger pixel block size creates
          a stronger mosaic appearance. Pixelation can obscure visual detail, but it is not a
          guarantee that text, faces or other information cannot be recognized.
        </p>

        <h2>Understanding the region coordinates</h2>
        <p>
          The Left and Top values are percentages measured from the image's left and top edges.
          Width and Height are also percentages of the original image dimensions. For example,
          Left 10, Top 10, Width 80 and Height 80 selects a region beginning 10% from the left and
          10% from the top, covering 80% of the image width and height.
        </p>
        <p>
          The selected region is rectangular. If the area you want to edit is small, use smaller
          Width and Height values and adjust Left and Top so the rectangle covers the entire area.
          Inspect the exported image carefully because an incorrectly positioned rectangle can
          leave part of the detail visible.
        </p>

        <h2>Important privacy warning: blur is not secure redaction</h2>
        <p>
          Do not rely on blur or pixelation to permanently conceal highly sensitive information
          such as passwords, account numbers, identity numbers or private documents. These effects
          can leave clues or partially recognizable details. For strong redaction, cover the
          complete sensitive area with an opaque solid shape using a suitable editor. This tool
          currently offers blur and pixelation, not an opaque redaction feature.
        </p>

        <h2>Supported image formats</h2>
        <ul>
          <li><b>JPG:</b> Common for photographs and widely supported by websites.</li>
          <li><b>PNG:</b> Useful for screenshots and graphics; transparency can be retained by PNG output.</li>
          <li><b>WebP:</b> Supported by many modern browsers and websites.</li>
        </ul>

        <h2>Tips for a better result</h2>
        <ul>
          <li>Set the rectangle to cover the entire detail you intend to obscure.</li>
          <li>Use a stronger effect when a more visible blur or mosaic appearance is required.</li>
          <li>Check the result at full resolution, not only in a small preview.</li>
          <li>Keep the original image separately in case you need to make another edit.</li>
          <li>For confidential information, use an opaque redaction method instead of blur or pixelation.</li>
        </ul>

        <h2>Frequently asked questions</h2>
        {faqs.map(([question, answer]) => (
          <section className="faq" key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}

        <h2>Related PicToSpec tools</h2>
        <ul>
          <li><a href="/image-cropper">Crop an image by pixel coordinates</a></li>
          <li><a href="/image-resizer">Resize an image to custom pixel dimensions</a></li>
          <li><a href="/image-compressor">Compress an image to a target KB size</a></li>
          <li><a href="/image-converter">Convert JPG, PNG and WebP images</a></li>
          <li><a href="/exif-data-viewer-remover">View or remove image metadata</a></li>
        </ul>
        <p className="note">
          Blur and pixelation are visual effects, not guaranteed secure redaction. Always inspect
          the exported image before publishing or sending it.
        </p>
      </main>
    </>
  );
}
