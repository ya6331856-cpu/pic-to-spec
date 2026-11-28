import type { Metadata } from "next";
import ImageWorkspace from "@/components/ImageWorkspace";
import ToolStructuredData from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "Image Converter Online – Convert JPG, PNG & WebP",
  description:
    "Convert JPG, PNG and WebP images online. Choose the output format, prepare your image and download it in your browser without sending it to a PicToSpec processing server.",
  alternates: { canonical: "/image-converter" },
  openGraph: {
    title: "Free Image Converter – JPG, PNG and WebP | PicToSpec",
    description:
      "Change an image between JPG, PNG and WebP formats in your browser. Choose an output format and download the converted image.",
    type: "website",
    url: "https://pictospec.com/image-converter",
  },
  twitter: {
    card: "summary",
    title: "Free Online Image Converter | PicToSpec",
    description:
      "Convert JPG, PNG and WebP images in your browser and download the chosen format.",
  },
};

const faqs = [
  [
    "How do I convert an image online?",
    "Choose a JPG, PNG or WebP image, select the output format you need, prepare the converted image and download the result. Open the downloaded file to check that it displays correctly.",
  ],
  [
    "Which image formats does this converter support?",
    "The tool accepts JPG, PNG and WebP input images and can create JPG, PNG or WebP output files.",
  ],
  [
    "How do I convert JPG to PNG?",
    "Choose your JPG image, select PNG as the output format, prepare the conversion and download the resulting PNG file.",
  ],
  [
    "How do I convert PNG to JPG?",
    "Choose the PNG image and select JPG as the output format. JPG does not support transparency, so transparent areas are filled with a solid white background.",
  ],
  [
    "Can I convert JPG to WebP?",
    "Yes. Select the JPG image, choose WebP as the output format and prepare the conversion. Check that the website or app where you plan to use the file supports WebP.",
  ],
  [
    "Does converting an image reduce its file size?",
    "Not always. The result depends on the source format, image content and output encoding. WebP may be smaller for some images, but conversion alone does not guarantee a smaller file. Use the image compressor when you need to target a maximum size in KB.",
  ],
  [
    "Will conversion change my image dimensions?",
    "No. Format conversion keeps the original image dimensions in this tool. Use the image resizer if you need to change width or height in pixels.",
  ],
  [
    "Will converting JPG to PNG restore image quality?",
    "No. PNG output cannot restore detail that was already lost when the source JPG was compressed. Converting a lossy image to another format does not recreate the original pixels.",
  ],
  [
    "Are my images uploaded to PicToSpec?",
    "Image conversion runs locally in your browser in this version. The selected image is not sent to a PicToSpec image-processing server.",
  ],
  [
    "What are the image processing limits?",
    "The upload control accepts images up to 20 MB. Processing also has a 40-megapixel safety limit to help avoid excessive browser memory use.",
  ],
];

export default function ImageConverterPage() {
  return (
    <>
      <ImageWorkspace
        initialTool="convert"
        initialFormat="image/jpeg"
        compact
        pageTitle="Convert images between JPG, PNG and WebP"
        pageDescription="Choose a JPG, PNG or WebP image, select the output format and prepare the converted file. Check the result and download it. Processing stays in your browser."
      />
      <main className="seo-page">
        <ToolStructuredData
          path="/image-converter"
          name="Online Image Converter for JPG, PNG and WebP"
          description="Convert JPG, PNG and WebP images to another supported format in a browser. Keep the original pixel dimensions and download the converted image."
          applicationCategory="UtilitiesApplication"
          features={[
            "Convert JPG images to PNG or WebP",
            "Convert PNG images to JPG or WebP",
            "Convert WebP images to JPG or PNG",
            "Choose JPG, PNG or WebP output",
            "Keep the original pixel dimensions",
            "Process images locally in the browser",
          ]}
        />
        <p className="kicker">FREE ONLINE IMAGE CONVERTER</p>
        <h2>Convert JPG, PNG and WebP images</h2>
        <p className="lead">
          Use PicToSpec's free image converter to change an image into a format supported by your
          website, app or upload form. Choose a JPG, PNG or WebP source, select the output format
          and download the converted file. Conversion runs locally in your browser.
        </p>
        <a className="seo-cta" href="#tools">Open the image converter →</a>

        <h2>How to convert an image</h2>
        <ol>
          <li>Choose the JPG, PNG or WebP image you want to convert.</li>
          <li>Select the output format: JPG, PNG or WebP.</li>
          <li>Prepare the converted image.</li>
          <li>Check the preview and download the resulting file.</li>
          <li>Open the downloaded image and confirm that the destination website or app accepts its format.</li>
        </ol>

        <h2>JPG, PNG and WebP: which format should you choose?</h2>
        <h3>JPG (JPEG)</h3>
        <p>
          JPG is widely supported and commonly used for photographs. It uses lossy compression,
          which can reduce file size but may discard some image detail. JPG does not support
          transparent backgrounds, so transparent areas are filled with a solid white background
          when this converter creates JPG output.
        </p>
        <h3>PNG</h3>
        <p>
          PNG is useful for logos, screenshots, interface graphics and images that need transparency
          or crisp edges. PNG uses lossless encoding, but converting a JPG to PNG cannot restore
          detail that was lost in the original JPG. PNG output may also be larger than JPG or WebP.
        </p>
        <h3>WebP</h3>
        <p>
          WebP is a modern image format supported by many current browsers and websites. It can
          provide compact image files, although the actual size depends on the image and encoding.
          Check compatibility with the destination portal, app or editing software before using it.
        </p>

        <h2>Common image format conversions</h2>
        <ul>
          <li><b>JPG to PNG:</b> Useful when a destination specifically requires PNG. It does not restore lost photo detail.</li>
          <li><b>PNG to JPG:</b> Useful for photograph uploads where JPG is required. Transparent areas become a solid background.</li>
          <li><b>JPG to WebP:</b> Can be useful for websites that accept WebP and benefit from compact image files.</li>
          <li><b>PNG to WebP:</b> Can reduce file size for some graphics, but check whether transparency is preserved as expected in your destination workflow.</li>
          <li><b>WebP to JPG or PNG:</b> Useful when an older portal or application does not accept WebP.</li>
        </ul>

        <h2>Does changing the format resize an image?</h2>
        <p>
          No. Format conversion changes how the image is encoded, not its pixel width and height.
          This converter keeps the source dimensions. If you need a particular width or height, use
          the <a href="/image-resizer">image resizer</a>. If you need to remove unwanted edges, use
          the <a href="/image-cropper">image cropper</a>.
        </p>

        <h2>Does image conversion reduce file size?</h2>
        <p>
          A new format is not guaranteed to create a smaller file. The result depends on the source
          image, its dimensions, visual detail and output encoding. If a form or website specifies a
          maximum size in KB, check the converted file's actual size before uploading it.
        </p>
        <p>
          When you need to meet a file-size limit, use the
          <a href="/image-compressor"> image compressor</a> to set a maximum KB target. For a
          particularly small limit, see the
          <a href="/compress-image-to-50kb"> 50KB image compression guide</a>.
        </p>

        <h2>Tips before using a converted image</h2>
        <ul>
          <li>Check which formats the destination website or app accepts.</li>
          <li>Keep the original file in case you need to convert it again with different settings.</li>
          <li>Choose PNG when transparency is important; JPG output uses a solid background.</li>
          <li>Do not expect conversion to restore detail already lost in a compressed source image.</li>
          <li>Check the output dimensions and file size if the destination has upload requirements.</li>
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
          <li><a href="/image-resizer">Resize an image to custom pixel dimensions</a></li>
          <li><a href="/image-cropper">Crop an image by pixel coordinates</a></li>
          <li><a href="/compress-image-to-50kb">Compress an image to 50KB or 100KB</a></li>
          <li><a href="/resize-photo-for-online-form">Prepare a photo for an online form</a></li>
        </ul>
        <p className="note">
          Conversion does not guarantee a smaller file or restore lost image detail. Always check
          the downloaded image and the destination's format requirements before uploading.
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
