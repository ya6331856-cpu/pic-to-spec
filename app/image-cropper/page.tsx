import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image Cropper Online – Crop Photos by Pixel Size",
  description:
    "Crop JPG, PNG and WebP images by entering pixel coordinates for the area to keep. Set left, top, width and height, preview the crop and download it in your browser.",
  alternates: { canonical: "/image-cropper" },
  openGraph: {
    title: "Free Online Image Cropper – Crop Images by Pixels | PicToSpec",
    description:
      "Choose an image and crop an exact rectangular area using pixel coordinates. Browser-based processing with JPG, PNG and WebP output.",
    type: "website",
    url: "https://pictospec.com/image-cropper",
  },
  twitter: {
    card: "summary",
    title: "Free Image Cropper Online | PicToSpec",
    description:
      "Crop JPG, PNG and WebP images using left, top, width and height pixel values.",
  },
};

const faqs = [
  [
    "How do I crop an image online with this tool?",
    "Choose a JPG, PNG or WebP image. Enter the Left and Top position and the Width and Height of the rectangular area you want to keep. Prepare the crop, inspect the result and download it.",
  ],
  [
    "Does this cropper use a drag-to-select crop box?",
    "No. This tool crops by numeric pixel coordinates. It does not provide a drag-to-select overlay. You enter the position and dimensions of the area to keep.",
  ],
  [
    "What do Left and Top mean when cropping?",
    "Left is the horizontal distance from the source image's left edge, and Top is the vertical distance from its top edge. Both values are measured in pixels. The top-left corner of the image is position 0, 0.",
  ],
  [
    "How do I crop an image into a square?",
    "Enter the same value for Width and Height, such as 500 × 500 pixels. Set Left and Top to position the square within the source image. The crop must remain fully inside the original image.",
  ],
  [
    "Can I crop JPG, PNG and WebP files?",
    "Yes. The workspace accepts JPG, PNG and WebP images and lets you choose JPG, PNG or WebP for the output. JPG does not preserve transparency; choose PNG when transparent areas matter.",
  ],
  [
    "Will cropping reduce the image dimensions?",
    "Yes. The output dimensions are the Width and Height values of the crop area. Cropping removes pixels outside that rectangle; it does not simply scale the entire original image down.",
  ],
  [
    "Can I crop a photo for an online form or profile picture?",
    "Yes. You can create a square or rectangular crop by entering the required pixel coordinates and dimensions. Check the destination's exact image dimensions, file-size limit and accepted formats before uploading.",
  ],
  [
    "Are my images uploaded to PicToSpec?",
    "Image cropping is performed locally in your browser in this version. The selected image is not sent to a PicToSpec image-processing server.",
  ],
  [
    "Why does the tool reject my crop values?",
    "Left, Top, Width and Height must be whole-pixel values. Left and Top cannot be negative, Width and Height must be at least one pixel, and the crop rectangle must fit inside the source image. The output is also subject to a 40-megapixel safety limit.",
  ],
];

export default function ImageCropperPage() {
  return (
    <>
      <ImageWorkspace
        initialTool="crop"
        initialFormat="image/jpeg"
        compact
        pageTitle="Crop images by exact pixel coordinates"
        pageDescription="Choose an image and enter the Left, Top, Width and Height of the area you want to keep. Prepare the crop, inspect the result and download it. Processing stays in your browser."
      />
      <main className="seo-page">
        <ToolStructuredData
          path="/image-cropper"
          name="Online Image Cropper by Pixel Coordinates"
          description="Crop JPG, PNG and WebP images by entering the left and top position and the width and height of a rectangular pixel area. Process images locally in the browser."
          applicationCategory="UtilitiesApplication"
          features={[
            "Crop JPG, PNG and WebP images",
            "Set the crop position with Left and Top pixel coordinates",
            "Set exact crop Width and Height in pixels",
            "Create square or rectangular crops",
            "Choose JPG, PNG or WebP output",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE ONLINE IMAGE CROPPER</p>
        <h2>Crop an image to a specific area</h2>
        <p className="lead">
          Use PicToSpec's online image cropper to keep a rectangular part of a photo, screenshot
          or graphic. Set the crop position and size in pixels, prepare the new image and download
          the result. Cropping runs in your browser, so the selected image is not sent to a
          PicToSpec image-processing server.
        </p>
        <a className="seo-cta" href="#tools">Open the image cropper →</a>

        <h2>How to crop an image</h2>
        <ol>
          <li>Choose the JPG, PNG or WebP image you want to crop.</li>
          <li>Check the source image dimensions so you know the available pixel area.</li>
          <li>Enter Left and Top to position the crop rectangle from the image's top-left corner.</li>
          <li>Enter the Width and Height of the area you want to keep.</li>
          <li>Choose an output format, prepare the crop, review the result and download it.</li>
        </ol>

        <h2>Understanding crop coordinates</h2>
        <p>
          This cropper uses pixel coordinates. The origin point (0, 0) is the top-left corner of
          the original image. Left moves the crop area to the right, while Top moves it down.
          Width and Height define the size of the rectangular area that remains in the output.
        </p>
        <p>
          For example, on a 1200 × 800 pixel image, Left 100, Top 50, Width 600 and Height 600
          selects a 600 × 600 square beginning 100 pixels from the left edge and 50 pixels from
          the top edge. The selected rectangle must fit entirely within the original image.
        </p>

        <h2>How to make a square crop</h2>
        <p>
          Use equal Width and Height values to create a square output, such as 500 × 500 pixels.
          Adjust Left and Top to choose which part of the original image stays inside the square.
          The cropper does not automatically detect or centre a face, so choose coordinates that
          keep the subject and any important details inside the selected area.
        </p>

        <h2>Crop versus resize: what is the difference?</h2>
        <p>
          Cropping removes the parts of an image outside the selected rectangle. Resizing changes
          the dimensions of the image while scaling its contents. If you need to remove unwanted
          edges or isolate a subject, crop the image. If you need to scale the whole image to a
          required width and height, use the <a href="/image-resizer">image resizer</a>.
        </p>

        <h2>Choose an output format</h2>
        <h3>JPG</h3>
        <p>
          JPG is widely supported for photographs. It does not preserve transparent backgrounds;
          transparent areas are filled with a solid background when saved as JPG.
        </p>
        <h3>PNG</h3>
        <p>
          PNG is useful for logos, screenshots and graphics where transparency or crisp edges
          matter. Its file size may be larger than a JPG or WebP output.
        </p>
        <h3>WebP</h3>
        <p>
          WebP is supported by many modern websites and can produce compact image files. Confirm
          that the destination website or form accepts WebP before choosing it.
        </p>

        <h2>Tips for a clean crop</h2>
        <ul>
          <li>Check the original width and height before entering crop coordinates.</li>
          <li>Keep the entire crop rectangle within the source image boundaries.</li>
          <li>Leave enough space around faces, signatures and text so important details are not cut off.</li>
          <li>Use equal width and height for a square crop, when a square is required.</li>
          <li>Keep the original image until you have checked the downloaded crop.</li>
          <li>Check the destination's pixel dimensions, file-size limit and accepted format before uploading.</li>
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
          <li><a href="/image-resizer">Resize an image to custom pixel dimensions</a></li>
          <li><a href="/image-compressor">Compress an image to a target KB size</a></li>
          <li><a href="/image-converter">Convert JPG, PNG and WebP images</a></li>
          <li><a href="/resize-photo-for-online-form">Prepare a photo for an online form</a></li>
          <li><a href="/signature-resizer">Resize a signature image</a></li>
        </ul>
        <p className="note">
          This tool uses numeric pixel coordinates rather than a visual drag-to-select crop box.
          Always check the output and follow the destination website's own image requirements.
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
