import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image Resizer Online – Resize Photos to Exact Pixels",
  description:
    "Resize JPG, PNG and WebP images by pixel width and height. Keep the aspect ratio or set custom dimensions, preview the result and download it in your browser.",
  alternates: { canonical: "/image-resizer" },
  openGraph: {
    title: "Free Image Resizer – Change Photo Dimensions Online | PicToSpec",
    description:
      "Set image width and height in pixels, preserve proportions and download a resized image. Browser-based processing.",
    type: "website",
    url: "https://pictospec.com/image-resizer",
  },
  twitter: {
    card: "summary",
    title: "Free Image Resizer Online | PicToSpec",
    description:
      "Resize photos to custom pixel dimensions, keep the aspect ratio and download JPG, PNG or WebP.",
  },
};

const faqs = [
  [
    "How do I resize an image online?",
    "Choose an image, enter the required width and height in pixels, decide whether to keep the aspect ratio, select an output format and prepare the image. Check the resulting dimensions before downloading.",
  ],
  [
    "Can I resize an image to an exact width and height?",
    "Yes. Enter whole-number pixel dimensions. With the aspect ratio option enabled, the image is scaled proportionally to fit inside the requested width and height, so one output dimension may be smaller. Turn the option off only when the image may be stretched.",
  ],
  [
    "What does keep aspect ratio mean?",
    "The aspect ratio is the relationship between an image's width and height. Keeping it prevents the photo from looking stretched or squashed. For example, a landscape photo remains landscape when it is scaled down.",
  ],
  [
    "Can I resize a photo for an online form?",
    "Yes. Enter the pixel dimensions required by the form. If the form also specifies a file-size limit in KB or MB, resize the dimensions first and then use the image compressor to reduce the file size if needed.",
  ],
  [
    "Does resizing reduce image file size?",
    "It often does because fewer pixels usually require less image data, but the final file size also depends on the image content and output format. Check the downloaded file's size if the destination has a KB limit.",
  ],
  [
    "Which output formats are supported?",
    "The workspace lets you save the resized image as JPG, PNG or WebP. JPG does not preserve transparent backgrounds; choose PNG when transparency matters, or WebP when the destination accepts it.",
  ],
  [
    "Will resizing make a small image sharper?",
    "No. Enlarging an image cannot restore detail that was not present in the original. Large upscales can look soft or pixelated, so use a source image with enough resolution.",
  ],
  [
    "Are my images uploaded to PicToSpec?",
    "Image resizing is performed locally in your browser in this version. The selected image is not sent to a PicToSpec image-processing server.",
  ],
  [
    "What are the resizing limits?",
    "The tool accepts dimensions up to 6000 pixels per side and applies a 40-megapixel processing safety limit. Very large source images may be rejected to help avoid excessive browser memory use.",
  ],
];

export default function ImageResizerPage() {
  return (
    <>
      <ImageWorkspace
        initialTool="resize"
        initialWidth="600"
        initialHeight="600"
        initialRatio
        initialFormat="image/jpeg"
        compact
        pageTitle="Resize images to custom pixel dimensions"
        pageDescription="Set the width and height in pixels, keep the original proportions or choose custom dimensions, then prepare and download your resized image. Processing stays in your browser."
      />
      <main className="seo-page">
        <ToolStructuredData
          path="/image-resizer"
          name="Online Image Resizer for JPG, PNG and WebP"
          description="Resize images to custom pixel dimensions in a browser. Preserve the aspect ratio or use custom width and height, then download the result."
          applicationCategory="UtilitiesApplication"
          features={[
            "Resize JPG, PNG and WebP images",
            "Enter custom width and height in pixels",
            "Preserve the original aspect ratio when resizing",
            "Choose JPG, PNG or WebP output",
            "Preview the resulting image dimensions before downloading",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE ONLINE IMAGE RESIZER</p>
        <h2>Resize an image by width and height in pixels</h2>
        <p className="lead">
          Change the pixel dimensions of a photo, screenshot or graphic with PicToSpec's free
          browser-based image resizer. Enter a target width and height, keep the aspect ratio to
          avoid distortion, or use custom dimensions when the destination specifically requires
          them. Review the output before downloading.
        </p>
        <a className="seo-cta" href="#tools">Open the image resizer →</a>

        <h2>How to resize an image</h2>
        <ol>
          <li>Choose the JPG, PNG or WebP image you want to resize.</li>
          <li>Enter the target width and height in pixels.</li>
          <li>Keep the aspect ratio enabled to scale the image proportionally inside the requested dimensions.</li>
          <li>Choose JPG, PNG or WebP as the output format.</li>
          <li>Select the prepare action, review the resulting pixel dimensions and download the resized image.</li>
        </ol>

        <h2>Pixels, dimensions and aspect ratio explained</h2>
        <p>
          Image dimensions describe how many pixels an image contains across its width and height.
          A 1200 × 800 image is 1200 pixels wide and 800 pixels tall. Its aspect ratio is 3:2.
          Keeping that ratio means the width and height change together, preserving the original
          shape of the image.
        </p>
        <p>
          When aspect ratio is enabled, this resizer fits the image inside the requested width and
          height. For example, a 1200 × 800 photo resized to fit within 600 × 600 becomes 600 × 400,
          rather than being stretched into a square.
        </p>

        <h2>When should you keep the aspect ratio?</h2>
        <p>
          Keep it enabled for ordinary photographs, product images, screenshots and graphics when
          you want to preserve their shape. Disable it only if a destination requires exact width
          and height values and you accept that the image may look stretched or compressed.
        </p>

        <h2>Common image dimension examples</h2>
        <p>
          These are example dimensions, not universal requirements. Always use the pixel dimensions
          specified by the website, application or form where the image will be used.
        </p>
        <ul>
          <li><b>Square image:</b> 500 × 500 pixels is a common square test size.</li>
          <li><b>Landscape image:</b> 1200 × 800 pixels has a 3:2 aspect ratio.</li>
          <li><b>Wide banner:</b> 1600 × 600 pixels is a wide layout example.</li>
          <li><b>Portrait image:</b> 600 × 900 pixels has a 2:3 aspect ratio.</li>
        </ul>

        <h2>Image dimensions are not the same as file size</h2>
        <p>
          Pixel dimensions describe the image's width and height. File size describes how much
          storage the image uses and is measured in bytes, KB or MB. A resized photo may become
          smaller, but its final file size also depends on format, image detail and encoding.
          If an upload form specifies both pixel dimensions and a maximum KB size, check both.
        </p>
        <p>
          Use the <a href="/image-compressor">image compressor</a> to target a maximum file size,
          or see the <a href="/compress-image-to-50kb">50KB image compression guide</a> when a form
          has a small file-size limit.
        </p>

        <h2>Choose an output image format</h2>
        <h3>JPG</h3>
        <p>
          JPG is widely supported and is a practical choice for photographs. It does not preserve
          transparent backgrounds, so transparent areas are filled with a solid background.
        </p>
        <h3>PNG</h3>
        <p>
          PNG is useful for logos, screenshots and graphics that need transparency or crisp edges.
          PNG files can be larger than JPG or WebP files.
        </p>
        <h3>WebP</h3>
        <p>
          WebP is supported by many modern websites and can provide compact image files. Check that
          the destination portal or application accepts WebP before choosing it.
        </p>

        <h2>Tips for better resizing results</h2>
        <ul>
          <li>Start with a source image that has enough pixels for the intended display size.</li>
          <li>Keep the aspect ratio enabled unless exact, potentially distorted dimensions are required.</li>
          <li>Avoid enlarging a small image excessively because resizing cannot recreate missing detail.</li>
          <li>Check both the output dimensions and file size against the destination's instructions.</li>
          <li>Keep the original image until you have confirmed that the resized copy is suitable.</li>
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
          <li><a href="/image-compressor">Compress an image to a target KB size</a></li>
          <li><a href="/compress-image-to-50kb">Compress an image to 50KB or 100KB</a></li>
          <li><a href="/image-cropper">Crop an image online</a></li>
          <li><a href="/image-converter">Convert JPG, PNG and WebP images</a></li>
          <li><a href="/resize-photo-for-online-form">Prepare a photo for an online form</a></li>
          <li><a href="/signature-resizer">Resize a signature image</a></li>
        </ul>
        <p className="note">
          Follow the destination website's own image requirements. Resizing changes pixel
          dimensions but does not guarantee a specific file size or improve the detail of a
          low-resolution source image.
        </p>
      </main>
      <footer>
        <a className="brand" href="/"><span className="mark">P</span>PicToSpec</a>
        <span>Image processing stays in your browser.</span>
        <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
