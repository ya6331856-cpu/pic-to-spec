export default function JpgToPdfGuide() {
  return (
    <section className="tool-content" aria-label="JPG to PDF conversion guide">
      <div>
        <p className="kicker">JPG TO PDF CONVERSION GUIDE</p>
        <h2>Convert JPG Images to a PDF Document Online</h2>
        <p>
          Turn JPG or PNG pictures into a single PDF that is easier to share, print or attach to
          an application. PicToSpec places each selected image on a separate A4 page, keeps its
          proportions and centres it on the page. The conversion runs in your browser.
        </p>
        <p>
          This converter creates an image-based PDF: the picture is embedded on the page as an
          image. It does not recognise text in photographs, create searchable text, or combine
          several pictures onto one page.
        </p>
      </div>

      <nav aria-label="On this page">
        <h3>On this page</h3>
        <ol>
          <li><a href="#jpg-pdf-how-it-works">How JPG to PDF conversion works</a></li>
          <li><a href="#jpg-pdf-steps">How to convert images to PDF</a></li>
          <li><a href="#jpg-pdf-page-size">A4 page size, orientation and image fit</a></li>
          <li><a href="#jpg-pdf-quality">Image quality and file size tips</a></li>
          <li><a href="#jpg-pdf-limitations">Supported formats and limits</a></li>
          <li><a href="#jpg-pdf-privacy">Privacy and local processing</a></li>
          <li><a href="#jpg-pdf-faq">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="jpg-pdf-how-it-works">
        <h2>How does a JPG to PDF converter work?</h2>
        <p>
          A JPG-to-PDF converter embeds each selected picture into a PDF page. In this tool,
          every image becomes its own A4 page. Images are scaled proportionally to fit inside
          the page area and centred; they are not stretched to fill the paper. The order of
          the pages follows the order in which you select the files.
        </p>
        <p>
          JPG and JPEG are names commonly used for the same image format. PNG is also accepted
          here. The output is a standard PDF file, but its pages contain pictures rather than
          editable document text.
        </p>
      </section>

      <section id="jpg-pdf-steps">
        <h2>How to convert JPG or PNG images to PDF</h2>
        <ol>
          <li>Choose the JPG or PNG images you want to include, or drag them into the upload area.</li>
          <li>Select the images in the order you want them to appear in the PDF.</li>
          <li>Choose <strong>Convert images to PDF</strong> and wait while your browser creates the document.</li>
          <li>Open the downloaded PDF and check every page before sharing or printing it.</li>
        </ol>
        <p>
          If the page order is important, arrange or rename your images before selecting them.
          Keep the original image files as a backup; conversion creates a new PDF and does not
          modify the originals.
        </p>
      </section>

      <section id="jpg-pdf-page-size">
        <h2>A4 page size, orientation and image fit</h2>
        <p>
          The current converter uses A4-sized pages. A portrait image will usually leave more
          white space on the sides, while a landscape image will usually leave more white space
          above and below. The image is fitted within the available page area while preserving
          its aspect ratio.
        </p>
        <p>
          The tool does not currently offer custom paper sizes, automatic page orientation,
          margins, border controls or multiple images on one page. If the recipient requires
          a specific layout, inspect the PDF before submitting it.
        </p>
      </section>

      <section id="jpg-pdf-quality">
        <h2>How to get a clear PDF and manage file size</h2>
        <ul>
          <li>Start with the clearest original image available; enlarging a small picture cannot restore missing detail.</li>
          <li>For photographed documents, use even lighting, avoid shadows and keep the camera parallel to the page.</li>
          <li>Check that small text is readable at normal viewing size before converting.</li>
          <li>Very large images can use substantial browser memory. Reduce image dimensions first if your device struggles.</li>
          <li>After conversion, open the PDF and review page order, orientation and legibility.</li>
        </ul>
        <p>
          This tool embeds the selected images; it is not a dedicated PDF optimiser and does
          not promise a smaller output file. The PDF size depends largely on the source images.
          You can use the <a href="/image-compressor">image compressor</a> before conversion
          when a smaller file is more important than retaining every original pixel.
        </p>
      </section>

      <section id="jpg-pdf-limitations">
        <h2>Supported image formats and conversion limits</h2>
        <ul>
          <li>Accepted formats: JPG/JPEG and PNG.</li>
          <li>Maximum selection: 20 images per conversion.</li>
          <li>Combined input size: up to 100 MB.</li>
          <li>Maximum image dimensions: 40 megapixels per image.</li>
          <li>Output layout: one image per A4 PDF page.</li>
        </ul>
        <p>
          WEBP, GIF, HEIC and other image formats are not accepted directly. Convert them to
          JPG or PNG first. The tool does not perform OCR, straighten photographed pages,
          remove backgrounds or make text inside an image selectable.
        </p>
      </section>

      <section id="jpg-pdf-privacy">
        <h2>Are my images uploaded when I convert them?</h2>
        <p>
          The conversion is performed locally in your browser. The selected image files are
          read by the page and used to build the PDF; they are not sent to a PicToSpec file
          conversion server. Your browser still needs enough available memory to process the
          images, especially when several large files are selected.
        </p>
      </section>

      <section id="jpg-pdf-faq">
        <h2>Frequently asked questions</h2>
        <details>
          <summary>Can I convert multiple JPG images into one PDF?</summary>
          <p>Yes. Select up to 20 JPG or PNG images. Each selected image becomes a separate page in one PDF, in selection order.</p>
        </details>
        <details>
          <summary>Can I convert PNG to PDF with this tool?</summary>
          <p>Yes. Both JPG/JPEG and PNG images are supported.</p>
        </details>
        <details>
          <summary>Will my image fill the whole A4 page?</summary>
          <p>No. The image is scaled proportionally to fit within the page area and centred. White space may remain around it.</p>
        </details>
        <details>
          <summary>Does the PDF contain selectable or searchable text?</summary>
          <p>No. Each page contains an embedded image. OCR is not included, so text in a photograph is not selectable or searchable.</p>
        </details>
        <details>
          <summary>Can I convert a HEIC, WEBP or GIF image?</summary>
          <p>Not directly. Convert the image to JPG or PNG first, then select the converted file.</p>
        </details>
        <details>
          <summary>Are my photos stored on PicToSpec?</summary>
          <p>No. This conversion runs in your browser and the selected files are not uploaded to a PicToSpec conversion server.</p>
        </details>
      </section>
    </section>
  );
}
