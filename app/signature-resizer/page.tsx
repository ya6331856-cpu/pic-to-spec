import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Resize Signature Online – Signature Image Resizer",
  description:
    "Resize a scanned signature image to custom pixel dimensions for an online form. Start with a 400 × 150 pixel canvas, then match the portal's exact requirements.",
  alternates: { canonical: "/signature-resizer" },
};

export default function SignatureGuide() {
  return (
    <>
      <ToolStructuredData
        path="/signature-resizer"
        name="Online Signature Image Resizer"
        description="Resize a scanned signature image to custom pixel dimensions for an online form. The 400 by 150 pixel canvas is a starting preset, not an official standard."
        applicationCategory="UtilitiesApplication"
        features={[
          "Resize signature images to custom pixel dimensions",
          "Start from a 400 by 150 pixel canvas",
          "Keep or change the aspect ratio",
          "Process and export the image in the browser",
        ]}
      />
      <ImageWorkspace
        initialTool="resize"
        initialWidth="400"
        initialHeight="150"
        initialRatio={false}
        compact
        pageTitle="Resize signature image online"
        pageDescription="Start with a 400 × 150 pixel signature canvas and adjust it to match the exact requirements of your application."
      />
      <main className="seo-page">
        <p className="kicker">SIGNATURE IMAGE GUIDE</p>
        <h2>Resize a signature image for an online application</h2>
        <p className="lead">
          A signature upload may have strict pixel dimensions, file-size limits and format rules.
          PicToSpec includes a 400 × 150 pixel preset as a starting point; always compare it with
          the instructions shown by the website where you are submitting the signature.
        </p>
        <a className="seo-cta" href="#tools">Open signature resize tool →</a>
        <h2>Prepare your signature</h2>
        <ol>
          <li>Scan or photograph your signature clearly on a plain background.</li>
          <li>Choose the image in PicToSpec.</li>
          <li>Select Resize dimensions and use the Signature preset as a starting point.</li>
          <li>Adjust width and height to match the exact pixel dimensions requested by your form.</li>
          <li>Download the edited copy and inspect it before uploading.</li>
        </ol>
        <h2>Keep the signature readable</h2>
        <p>
          A very small image can make pen strokes difficult to read. Avoid excessive compression,
          check the background and make sure the signature is not cropped. Some forms require JPG
          while others accept PNG.
        </p>
        <h2>Important: signature sizes are not universal</h2>
        <p>
          The 400 × 150 preset is a convenience, not an official government, exam, bank or recruitment
          standard. Requirements vary by portal and can change. Follow the dimensions, file-size
          range and file type specified by the destination form. Do not submit a preset without
          checking those instructions.
        </p>
        <h2>Frequently asked questions</h2>
        <details>
          <summary>Can I resize a signature to exact pixel dimensions?</summary>
          <p>
            Yes. Enter the width and height requested by the destination form. Keep the aspect ratio
            option disabled only when the portal requires exact dimensions and you understand how
            the image may be stretched.
          </p>
        </details>
        <details>
          <summary>Is 400 × 150 pixels an official signature size?</summary>
          <p>
            No. It is only a starting preset in PicToSpec. Check the current instructions for the
            specific application, recruitment portal or institution.
          </p>
        </details>
        <details>
          <summary>Can I compress the signature after resizing it?</summary>
          <p>
            Yes. Use the image compressor to reduce the file size if the portal also has a KB limit.
            Confirm that the final file still looks clear and uses an accepted format.
          </p>
        </details>
        <h2>Related image tools</h2>
        <p>
          Use the <a href="/image-resizer">image resizer</a> for general pixel dimensions, the{" "}
          <a href="/resize-photo-for-online-form">photo resizer for online forms</a> for application
          photos, or the <a href="/compress-image-to-50kb">50KB image compressor</a> when a portal
          specifies a file-size limit.
        </p>
      </main>
      <footer>
        <a className="brand" href="/"><span className="mark">P</span>PicToSpec</a>
        <span>Files stay on your device.</span>
        <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
