import type { Metadata } from "next";
import PassportPhotoTool from "@/components/PassportPhotoTool";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Passport Photo Maker Online – Create 4×6 & A4 Photo Sheets",
  description: "Make a passport-style photo sheet online. Set custom photo dimensions, choose a background colour and arrange copies on a 4×6 or A4 sheet. Free browser-based tool.",
  alternates: { canonical: "/passport-photo-maker" },
  openGraph: {
    title: "Passport Photo Maker Online – 4×6 & A4 Print Sheet | PicToSpec",
    description: "Prepare passport-style photo copies with custom pixel dimensions and a printable 4×6 or A4 sheet. Process your image in your browser.",
    type: "website",
    url: "https://pictospec.com/passport-photo-maker",
  },
  twitter: {
    card: "summary",
    title: "Passport Photo Maker Online | PicToSpec",
    description: "Create a photo print sheet with custom dimensions, background colour and multiple copies.",
  },
};

const faqs = [
  ["How do I make a passport photo sheet online?", "Choose a JPG, PNG or WebP image, set the required width and height in pixels, choose the number of copies and select a 4×6 or A4 sheet. Create the sheet, inspect the preview and download the JPG."],
  ["Can I create a 35 × 45 mm photo?", "The tool includes a 413 × 531 pixel example preset, which is an approximate 35 × 45 mm size at 300 pixels per inch. Confirm the exact pixel or physical dimensions required by your application before using it."],
  ["Does this tool support US 2 × 2 inch photos?", "There is a 600 × 600 pixel example preset for a square photo. It is not a guarantee of compliance with US passport or visa photo rules; check the current official instructions."],
  ["Can I print multiple copies on one page?", "Yes. Choose the number of copies and either a 4×6 inch-style sheet or A4. The tool checks whether the selected photos fit at the exact pixel dimensions and reports an error rather than silently shrinking them."],
  ["Does the tool remove or replace the photo background?", "No. It fills the photo canvas with the selected colour but does not detect or cut out the person. If the original background is unsuitable, edit it with a suitable background-removal tool before creating the sheet."],
  ["Are my photos uploaded to a server?", "Image processing is performed in your browser. The tool creates the photo and print sheet locally rather than uploading the selected photo to a PicToSpec image-processing server."],
  ["Which image formats can I use?", "The upload accepts JPG, PNG and WebP images up to 20 MB. Images above the 40-megapixel processing safety limit cannot be processed."],
  ["Will the photo be accepted by a passport office or embassy?", "Acceptance is not guaranteed. Photo size, head position, expression, background, lighting and print requirements vary by country, authority and visa type. Always check the official instructions for your application."],
  ["How should I print the downloaded sheet?", "The generated sheet is prepared at 300 pixels per inch. In the print dialog, choose actual size or 100% scale and avoid fit-to-page scaling when exact physical dimensions matter. Printer and paper settings can still affect the final print."],
];

export default function PassportPhotoMakerPage() {
  return (
    <>
      <PassportPhotoTool />
      <main className="seo-page">
        <ToolStructuredData
          path="/passport-photo-maker"
          name="Free Online Passport Photo Maker and Print Sheet"
          description="Create a passport-style photo sheet with custom pixel dimensions, a selectable canvas background and multiple copies on a 4×6 or A4 layout. Image processing runs in the browser."
          applicationCategory="UtilitiesApplication"
          features={[
            "Accept JPG, PNG and WebP images up to 20 MB",
            "Set custom photo width and height from 50 to 2000 pixels",
            "Use example 35 × 45 mm and square photo presets",
            "Choose white, light blue or light grey canvas backgrounds",
            "Arrange multiple copies on a 4×6 or A4 print sheet",
            "Preview and download a JPEG print sheet",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE ONLINE PHOTO PRINT TOOL</p>
        <h2>Make a passport-style photo print sheet</h2>
        <p className="lead">
          Prepare multiple copies of a photo on one printable page. Set the output width and height
          in pixels, choose a background colour, select a 4×6 inch-style or A4 sheet, and download
          the finished JPEG. The tool uses a centre crop and keeps the selected photo dimensions
          instead of silently resizing copies to make them fit.
        </p>
        <h2>How to use the passport photo maker</h2>
        <ol>
          <li>Choose a clear JPG, PNG or WebP photo. The upload limit is 20 MB.</li>
          <li>Choose a preset only if it matches your application, or enter the exact required width and height in pixels.</li>
          <li>Set the number of copies, choose the 4×6 or A4 sheet, and select a background canvas colour.</li>
          <li>Create the print sheet and inspect the preview to make sure the face and crop look right.</li>
          <li>Download the JPEG and print at actual size or 100% scale if exact physical dimensions are required.</li>
        </ol>
        <h2>Photo size examples</h2>
        <p>
          The built-in 413 × 531 pixel preset is an approximate 35 × 45 mm photo at 300 pixels per
          inch. The 600 × 600 pixel preset is a square example commonly associated with a 2 × 2 inch
          canvas at 300 pixels per inch. These are starting points, not universal passport standards.
          Some authorities specify different dimensions, head size, eye position, background and
          image quality rules.
        </p>
        <h2>How the print sheet works</h2>
        <p>
          The 4×6 layout is generated at 1200 × 1800 pixels and the A4 layout at 2480 × 3508 pixels,
          both corresponding to a 300 pixels-per-inch canvas. The tool places copies at their chosen
          pixel dimensions with margins and gaps. If the requested number of copies does not fit at
          that size, it asks you to reduce the count or dimensions rather than shrinking the photos
          without telling you.
        </p>
        <h2>Important: check official photo requirements</h2>
        <p>
          A correctly sized print sheet does not automatically make a compliant passport or visa
          photograph. Rules can cover the person's pose, facial expression, head height, eye
          position, lighting, shadows, glasses, clothing, background colour, recency and print
          quality. Requirements differ between countries and applications. Check the official
          government or embassy instructions before submitting or printing your photo.
        </p>
        <h2>Background and cropping limitations</h2>
        <p>
          The background setting fills the photo canvas; it does not remove the background from the
          original photograph. Cropping is centred, so a face positioned near an edge may be cut off.
          Adjust the original photo or use an appropriate editor first if you need precise positioning
          or background removal. The tool does not certify face placement or official photo compliance.
        </p>
        <h2>Frequently asked questions</h2>
        {faqs.map(([question, answer]) => (
          <section className="faq" key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}
        <h2>Related PicToSpec tools</h2>
        <ul>
          <li><a href="/image-resizer">Resize an image to exact pixel dimensions</a></li>
          <li><a href="/image-cropper">Crop an image with pixel coordinates</a></li>
          <li><a href="/image-compressor">Compress an image to a smaller file size</a></li>
          <li><a href="/background-remover">Explore the background remover</a></li>
          <li><a href="/resize-photo-for-online-form">Resize a photo for an online form</a></li>
          <li><a href="/signature-resizer">Resize a signature image</a></li>
        </ul>
        <p className="note">
          Always follow the exact file, photo and print specifications published by the authority
          handling your passport, visa or application. Keep the original photo until your final
          printed or uploaded copy has been checked.
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
