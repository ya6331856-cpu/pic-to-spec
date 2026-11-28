import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Format Guide: JPG, PNG, WebP, GIF and SVG",
  description:
    "Compare JPG, PNG, WebP, GIF and SVG image formats. Learn about transparency, animation, file size and which format to choose for websites, photos and graphics.",
  alternates: { canonical: "/resources/image-format-guide" },
  openGraph: {
    title: "Image Format Guide: JPG, PNG, WebP, GIF and SVG | PicToSpec",
    description:
      "A practical reference for choosing image formats based on quality, transparency, animation and website use.",
    type: "article",
    url: "https://pictospec.com/resources/image-format-guide",
  },
  twitter: {
    card: "summary",
    title: "Image Format Guide | PicToSpec",
    description:
      "Compare common image formats and choose the right one for photos, graphics and websites.",
  },
};

const formats = [
  {
    format: "JPEG / JPG",
    best: "Photographs and complex images",
    strengths: "Widely supported; usually produces compact photo files.",
    limits: "Lossy compression; does not support transparency or animation.",
    mime: "image/jpeg",
  },
  {
    format: "PNG",
    best: "Logos, screenshots, diagrams and transparent graphics",
    strengths: "Lossless compression; supports transparency.",
    limits: "Can be much larger than JPEG for photographs; no standard animation.",
    mime: "image/png",
  },
  {
    format: "WebP",
    best: "Website photos and graphics where browser support is suitable",
    strengths: "Supports lossy and lossless compression, transparency and animation.",
    limits: "Check the requirements of older software or upload portals before choosing it.",
    mime: "image/webp",
  },
  {
    format: "GIF",
    best: "Simple short animations and basic graphics",
    strengths: "Supports animation and broad legacy compatibility.",
    limits: "Limited 256-colour palette; usually not ideal for detailed photographs.",
    mime: "image/gif",
  },
  {
    format: "SVG",
    best: "Icons, logos, diagrams and scalable illustrations",
    strengths: "Vector artwork stays sharp when resized and is often compact for simple graphics.",
    limits: "Not a direct replacement for photographic formats; only use SVG files from trusted sources.",
    mime: "image/svg+xml",
  },
];

export default function ImageFormatGuidePage() {
  return (
    <main className="legal">
      <a href="/" className="back">← Back to PicToSpec</a>
      <p className="kicker">IMAGE REFERENCE</p>
      <h1>JPG vs PNG vs WebP: which image format should you use?</h1>
      <p>
        The best image format depends on what the image contains and where you plan to use it.
        Photographs, transparent logos, screenshots and animations have different needs. This
        guide compares common formats so you can choose before converting or compressing a file.
      </p>

      <h2>Quick image format comparison</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Format</th><th>Good for</th><th>Advantages</th><th>Limitations</th></tr>
          </thead>
          <tbody>
            {formats.map((item) => (
              <tr key={item.format}>
                <th scope="row">{item.format}</th>
                <td>{item.best}</td>
                <td>{item.strengths}</td>
                <td>{item.limits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Which format should you choose?</h2>
      <ul>
        <li><strong>Choose JPG</strong> for everyday photographs when broad compatibility and a smaller file matter more than transparency.</li>
        <li><strong>Choose PNG</strong> for screenshots, sharp interface graphics, logos and images that need a transparent background.</li>
        <li><strong>Choose WebP</strong> for many website images when the destination supports it and you want modern compression with transparency or animation options.</li>
        <li><strong>Choose GIF</strong> only when you specifically need a simple animated GIF or must support a workflow that requires it.</li>
        <li><strong>Choose SVG</strong> for vector logos, icons and diagrams that need to scale cleanly. Avoid opening or embedding SVG files from sources you do not trust.</li>
      </ul>

      <h2>Does converting an image always reduce its size?</h2>
      <p>
        No. Changing the file format does not guarantee a smaller file. The result depends on the
        source image, dimensions, compression settings and output format. A PNG screenshot may
        become smaller as PNG than as JPEG, while a photograph may become much smaller as JPEG or
        WebP. Compare the output file size and inspect image quality before replacing the original.
      </p>

      <h2>Image dimensions and file size are different</h2>
      <p>
        Dimensions describe the pixel width and height, such as 1200 × 800 pixels. File size
        describes how much storage the encoded image uses, such as 250 KB. Resizing changes pixel
        dimensions; compression changes how image data is stored. If an upload form has both a
        pixel-dimension rule and a KB limit, check both.
      </p>

      <h2>Convert or prepare an image with PicToSpec</h2>
      <ul>
        <li><a href="/image-converter">Image Converter</a> — convert supported images between JPG, PNG and WebP.</li>
        <li><a href="/jpg-to-webp">JPG to WebP Converter</a> — convert JPEG photos to WebP.</li>
        <li><a href="/image-compressor">Image Compressor</a> — reduce image file size.</li>
        <li><a href="/image-resizer">Image Resizer</a> — change image width and height.</li>
        <li><a href="/image-cropper">Image Cropper</a> — keep only the part of an image you need.</li>
      </ul>
      <p>
        Tool support and output options can vary by browser. Keep your original file until you have
        checked that the converted image looks correct and works in the destination website or app.
      </p>

      <h2>Frequently asked questions</h2>
      <h3>Is JPG or PNG better for photos?</h3>
      <p>JPG is usually a practical choice for photographs when a smaller file is important. PNG is useful when you need lossless image data or transparency, but photo files can be larger.</p>
      <h3>Can WebP have a transparent background?</h3>
      <p>Yes. WebP supports transparency, as well as lossy and lossless compression.</p>
      <h3>Can I turn an SVG logo into PNG?</h3>
      <p>Yes, when you need a raster image for a destination that does not accept SVG. Choose the output dimensions carefully because PNG is pixel-based.</p>
      <h3>Should I delete the original after conversion?</h3>
      <p>No. Keep the original until you have checked the output quality, dimensions, transparency and compatibility.</p>

      <p><a href="/about">About PicToSpec</a> · <a href="/privacy">Privacy Policy</a> · <a href="/">Browse all free tools</a></p>
    </main>
  );
}
