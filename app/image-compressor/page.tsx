import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image Compressor Online – Reduce JPG, PNG & WebP Size",
  description: "Compress JPG, PNG and WebP images online with a custom KB target. Reduce photo file size in your browser, check the result and download it privately.",
  alternates: { canonical: "/image-compressor" },
  openGraph: {
    title: "Image Compressor Online – Reduce JPG, PNG & WebP | PicToSpec",
    description: "Choose a maximum file size, compress an image in your browser and download the result. No image upload to PicToSpec.",
    type: "website",
    url: "https://pictospec.com/image-compressor",
  },
  twitter: {
    card: "summary",
    title: "Image Compressor Online | PicToSpec",
    description: "Reduce JPG, PNG and WebP file sizes with a custom KB target in your browser.",
  },
};

const faqs = [
  ["How do I compress an image online?", "Choose a JPG, PNG or WebP image, set a maximum target size in KB, select an output format and choose Prepare image. Review the resulting dimensions and file size, then download it."],
  ["Can I compress JPG, PNG and WebP images?", "Yes. The tool accepts JPG, PNG and WebP input images and lets you choose JPG, PNG or WebP output."],
  ["Can I choose a target size such as 100KB or 200KB?", "Yes. Enter a target from 5 KB to 5000 KB, or use one of the quick size presets. The target is a maximum, not a promise of an exact file size."],
  ["Will compression reduce image quality?", "JPG and WebP use lossy compression, so reducing file size can affect detail. Inspect the result before using it. PNG is re-encoded without the same lossy quality search and may not become much smaller."],
  ["Why is my compressed image still too large?", "Some images contain complex detail or large dimensions. Try a larger target, choose JPG or WebP when accepted, or reduce the image dimensions before compressing."],
  ["Does the compressor change image dimensions?", "It first tries to meet the target at the original dimensions for JPG and WebP. If needed, it reduces dimensions proportionally. Always check the output width and height."],
  ["Are my images uploaded to a server?", "No. In this version, image processing runs locally in your browser. The selected image is not sent to a PicToSpec image-processing server."],
  ["Is there a maximum image size?", "The upload control accepts images up to 20 MB. Processing also has a 40-megapixel safety limit to help avoid excessive browser memory use."],
];

export default function ImageCompressorPage() {
  return (
    <>
      <ImageWorkspace
        initialTool="compress"
        initialTarget="200"
        compact
        pageTitle="Compress images online"
        pageDescription="Reduce JPG, PNG and WebP file sizes with a custom KB target. Choose your image, check the compressed result and download it. Processing stays in your browser."
      />
      <main className="seo-page">
        <ToolStructuredData
          path="/image-compressor"
          name="Online Image Compressor for JPG, PNG and WebP"
          description="Compress JPG, PNG and WebP images to a chosen maximum file size in your browser. Review output quality, dimensions and file size before downloading."
          applicationCategory="UtilitiesApplication"
          features={[
            "Compress JPG, PNG and WebP images",
            "Choose a custom maximum target from 5 KB to 5000 KB",
            "Use quick 50 KB, 100 KB, 200 KB and 500 KB presets",
            "Review output file size and pixel dimensions",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE ONLINE IMAGE COMPRESSOR</p>
        <h2>Reduce image file size online</h2>
        <p className="lead">
          Large image files can be difficult to upload, email or use on a website. PicToSpec lets you
          choose a maximum size in KB and prepare a smaller JPG, PNG or WebP image in your browser.
          You can inspect the output size and pixel dimensions before downloading.
        </p>
        <a className="seo-cta" href="#tools">Open the image compressor →</a>

        <h2>How to compress an image</h2>
        <ol>
          <li>Choose a JPG, PNG or WebP image. The current upload limit is 20 MB.</li>
          <li>Enter your maximum target size in KB, such as 100, 200 or 500 KB.</li>
          <li>Choose an output format. JPG or WebP is usually more suitable when you need substantial size reduction; use PNG when transparency or lossless-style graphics matter.</li>
          <li>Select <b>Prepare image now</b> and wait for the browser to process it.</li>
          <li>Check the final file size and pixel dimensions, preview the image and download it.</li>
        </ol>

        <h2>Choose the right image format</h2>
        <h3>JPG</h3>
        <p>JPG is widely supported for photographs and is often a practical choice for smaller photo files. It does not preserve transparent backgrounds.</p>
        <h3>PNG</h3>
        <p>PNG is useful for screenshots, logos and graphics that need transparency or crisp edges. Re-encoding a PNG may not reduce its file size enough for a very small KB target.</p>
        <h3>WebP</h3>
        <p>WebP can provide compact images for modern websites. Check that the website, application or form where you plan to upload the file accepts WebP.</p>

        <h2>What does a target size in KB mean?</h2>
        <p>
          The target is a maximum file-size goal, not an instruction to create a file with an exact
          number of bytes. For example, a 200 KB target means the compressor tries to produce an
          output no larger than 200 KB. The actual result can be smaller and depends on image detail,
          dimensions, format and browser encoding.
        </p>

        <h2>How to get a smaller image</h2>
        <ul>
          <li>Start with the largest file size allowed by the destination instead of choosing an unnecessarily tiny target.</li>
          <li>Use JPG or WebP for photographs when the destination accepts the format.</li>
          <li>Reduce pixel dimensions if the image is much larger than the display or upload requires.</li>
          <li>Compare the output with the original, especially around text, edges and fine details.</li>
          <li>Keep the original file until you have confirmed that the compressed version is suitable.</li>
        </ul>

        <h2>File size and image dimensions are different</h2>
        <p>
          File size is measured in bytes, KB or MB. Image dimensions are measured in pixels, such as
          1200 × 800. A photo can have the correct pixel dimensions and still exceed an upload limit.
          If a form specifies both requirements, check both values after compression. You can use the
          <a href="/image-resizer"> image resizer</a> to change dimensions and the
          <a href="/compress-image-to-50kb"> 50KB image compressor guide</a> for a smaller target.
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
          <li><a href="/compress-image-to-50kb">Compress an image to 50KB or 100KB</a></li>
          <li><a href="/image-resizer">Resize an image to custom pixel dimensions</a></li>
          <li><a href="/image-cropper">Crop an image online</a></li>
          <li><a href="/image-converter">Convert JPG, PNG and WebP images</a></li>
          <li><a href="/resize-photo-for-online-form">Resize a photo for an online form</a></li>
        </ul>
        <p className="note">
          Always follow the destination website's own file-size, dimension and format requirements.
          Very aggressive compression can reduce visual quality. Keep a copy of the original image.
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
