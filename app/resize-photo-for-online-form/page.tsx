import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Resize Photo for Online Forms – Custom Pixel Size Tool",
  description:
    "Resize a JPG, PNG or WebP photo for an online application. Set custom pixel dimensions, preserve proportions or use exact dimensions, then download the result free.",
  alternates: { canonical: "/resize-photo-for-online-form" },
  openGraph: {
    title: "Resize Photo for Online Forms | PicToSpec",
    description:
      "Set the pixel dimensions required by an online form and download a resized photo. Check aspect ratio and file-size rules before submitting.",
    type: "website",
    url: "https://pictospec.com/resize-photo-for-online-form",
  },
  twitter: {
    card: "summary",
    title: "Resize Photo for Online Forms | PicToSpec",
    description:
      "Resize JPG, PNG or WebP photos to custom pixel dimensions in your browser.",
  },
};

export default function ResizeGuide() {
  return (
    <>
      <ToolStructuredData
        path="/resize-photo-for-online-form"
        name="Resize Photo for Online Forms"
        description="Resize JPG, PNG and WebP images to custom pixel dimensions in the browser, with an option to preserve the original aspect ratio or use exact dimensions."
        applicationCategory="UtilitiesApplication"
        features={[
          "Resize JPG, PNG and WebP images",
          "Set custom width and height in pixels",
          "Preserve the original aspect ratio",
          "Use exact dimensions when required",
          "Preview the output dimensions and file size",
          "Download the resized image",
          "Process images in the browser",
          "Support images up to 20 MB and 40 megapixels",
        ]}
      />
      <ImageWorkspace
        initialTool="resize"
        initialWidth="600"
        initialHeight="400"
        compact
        pageTitle="Resize photo for online forms"
        pageDescription="Enter the pixel dimensions required by the form. Preserve the photo's proportions or use exact dimensions only when the destination requires them. Check the result before downloading."
      />
      <main className="seo-page">
        <p className="kicker">PHOTO RESIZING GUIDE</p>
        <h2>Resize a photo for an online form</h2>
        <p className="lead">
          When a form asks for a specific width and height in pixels, changing only the file size is not enough.
          Resize the image to the dimensions requested by the portal and check the final file before submitting it.
        </p>
        <a className="seo-cta" href="#tools">Open photo resize tool →</a>
        <h2>How to resize a photo using pixels</h2>
        <ol>
          <li>Choose a JPG, PNG or WebP image. The tool accepts files up to 20 MB.</li>
          <li>Enter the required width and height in pixels.</li>
          <li>Keep aspect ratio enabled to fit the image inside the requested dimensions without stretching it.</li>
          <li>Turn aspect ratio off only if the portal requires both exact dimensions and you accept possible image distortion.</li>
          <li>Prepare the image, check its output dimensions and file size, then download it.</li>
        </ol>
        <h2>Exact dimensions vs aspect ratio</h2>
        <p>
          Aspect ratio is the relationship between an image's width and height. Keeping it prevents faces and objects
          from looking stretched, but one output dimension may be smaller than the requested box. Disabling it uses
          the exact width and height but can distort the image. If the portal requires exact dimensions without distortion,
          check whether it accepts a cropped photo instead.
        </p>
        <h2>Pixel dimensions and file size are different</h2>
        <p>
          A photo can have the correct pixel dimensions and still exceed a portal's maximum KB limit. Check both
          requirements separately. If needed, use the <a href="/compress-image-to-50kb">image compressor for a target KB size</a>.
        </p>
        <h2>Before uploading your photo</h2>
        <ul>
          <li>Confirm the required width and height from the current official form instructions.</li>
          <li>Check the maximum file size and accepted image formats.</li>
          <li>Open the downloaded image and confirm that the subject is not stretched or unintentionally cut off.</li>
          <li>Do not assume one passport, profile or signature size works for every application.</li>
        </ul>
        <h2>Frequently asked questions</h2>
        <div className="faq">
          <h3>Will keeping the aspect ratio produce the exact width and height?</h3>
          <p>Not always. It fits the image inside the requested dimensions without stretching, so one dimension may be smaller.</p>
        </div>
        <div className="faq">
          <h3>How can I force an exact width and height?</h3>
          <p>Turn off Keep aspect ratio. This may stretch the image. If distortion is not acceptable, crop the image to the required ratio before resizing.</p>
        </div>
        <div className="faq">
          <h3>Does resizing also reduce the image's KB size?</h3>
          <p>Not necessarily. Pixel dimensions and file size are separate. Use a suitable compression target if the form also specifies a KB limit.</p>
        </div>
        <div className="faq">
          <h3>Does PicToSpec guarantee that a form will accept my photo?</h3>
          <p>No. Portals can have additional rules for photo ratio, background, file size, format and content. Always follow the latest official instructions.</p>
        </div>
        <h2>Related tools</h2>
        <p><a href="/image-resizer">General image resizer</a> · <a href="/compress-image-to-50kb">Compress image to 50KB</a> · <a href="/signature-resizer">Signature resizer</a> · <a href="/passport-photo-maker">Passport photo maker</a></p>
      </main>
      <footer>
        <a className="brand" href="/"><span className="mark">P</span>PicToSpec</a>
        <span>Files stay on your device.</span>
        <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
