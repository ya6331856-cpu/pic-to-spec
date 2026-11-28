"use client";

export default function PDFToWordGuide() {
  return (
    <section className="tool-content" aria-labelledby="pdf-word-guide">
      <h2 id="pdf-word-guide">PDF to Word: complete conversion guide</h2>
      <p>A PDF is designed to keep a document looking consistent across devices. A Word DOCX is designed for editing and reflowing content. Converting between them therefore means extracting text and rebuilding a document—not simply changing a filename. This tool focuses on selectable text and a practical editable draft.</p>

      <h2>What this PDF to Word converter does</h2>
      <p>It reads text objects from a PDF, groups nearby text items into approximate lines using their page positions, and writes those lines as editable paragraphs in a DOCX file. Source pages are separated in the output. This is useful when you need to reuse text, make corrections, or create a working draft from a text-based PDF.</p>
      <p>The converter does not recreate the original PDF page as a pixel-perfect Word layout. It does not perform OCR, rebuild tables, or reliably transfer pictures, charts, headers, footers, columns, font styling, hyperlinks, or exact spacing.</p>

      <h2>When to use PDF to Word—and when not to</h2>
      <ul>
        <li><strong>Good fit:</strong> text-based reports, notes, simple letters, policy documents, and content you plan to edit or quote.</li>
        <li><strong>Use OCR first:</strong> scanned pages or PDFs where you cannot select and copy the words.</li>
        <li><strong>Use a different workflow:</strong> forms, complex multi-column layouts, image-heavy brochures, precise tables, signed documents, or files where exact visual fidelity is essential.</li>
        <li><strong>Keep the PDF:</strong> when you need the original page appearance, print layout, or a stable record.</li>
      </ul>

      <h2>How to convert a PDF into an editable Word document</h2>
      <ol>
        <li>Select a PDF smaller than 50 MB. The document must contain no more than 100 pages.</li>
        <li>Wait for the page count to be detected. If the file is encrypted, damaged, or unsupported, the tool may show an error.</li>
        <li>Enter the first and last page. The range is inclusive; for example, pages 3 through 7 produces five source pages.</li>
        <li>Select <strong>Convert PDF to Word</strong> and wait while the browser extracts text page by page.</li>
        <li>Download the DOCX, open it in Word or a compatible editor, and compare it with the source before relying on it.</li>
      </ol>
      <p>To convert the whole file, keep the first page at 1 and the last page at the detected page count. You can convert a smaller range when you only need a chapter or selected pages.</p>

      <h2>What does “editable” mean?</h2>
      <p>The generated DOCX contains editable text paragraphs. You can select, copy, revise, and format that text in a word processor. “Editable” does not mean that every element from the PDF becomes a matching Word object. Text may be reordered or joined differently, and images or table structures may be absent.</p>

      <h2>PDF text extraction and reading order</h2>
      <p>PDFs often store text as positioned fragments rather than as a simple sequence of sentences. This tool groups fragments with similar vertical positions into approximate lines, sorts fragments from left to right, and orders lines from top to bottom. That approach works best for a straightforward single-column page.</p>
      <p>It can be less reliable with columns, sidebars, floating labels, right-to-left text, rotated text, footnotes, overlapping content, or unusual spacing. A PDF’s internal order may differ from the order a person sees on the page. Review the output and correct it in Word.</p>

      <h2>Scanned PDFs and OCR</h2>
      <p>A scanned PDF usually contains page images. If no selectable text is present, this converter cannot recognize the words and will report that no selectable text was found. Use <a href="/image-to-text">Image to Text OCR</a> on the relevant page images, proofread the recognition result, and then place the corrected text into Word. OCR can confuse similar characters such as O/0, I/1, punctuation, and low-resolution letters.</p>

      <h2>Tables, columns, images, and formatting</h2>
      <p>Table cells may be extracted as separate text fragments, and the converter does not reconstruct a true Word table. Multi-column text may be interleaved. Embedded images, diagrams, charts, and decorative elements are not reliably included. Bold, italic, font choice, color, indentation, and exact paragraph spacing are not promised.</p>
      <p>If the document contains important numbers or legal, financial, medical, or contractual wording, verify each value against the PDF. Do not treat the converted file as an authoritative copy until it has been checked.</p>

      <h2>File limits and browser performance</h2>
      <ul>
        <li>Input format: PDF.</li>
        <li>Maximum input size: 50 MB.</li>
        <li>Maximum document length: 100 pages per conversion.</li>
        <li>Maximum selected range: 100 pages.</li>
        <li>Output: editable DOCX.</li>
        <li>Page range: one continuous inclusive range.</li>
      </ul>
      <p>Large or complicated files can use substantial memory and may take longer on phones or older devices. Close unused tabs, select only the pages you need, and retry with a smaller range if the browser becomes unresponsive.</p>

      <h2>Privacy and security</h2>
      <p>The PDF is read and processed in your browser; the current conversion workflow does not send the source document to a PicToSpec conversion server. The PDF.js worker is loaded from a public CDN, so an internet connection is needed for that resource. Local processing reduces server transfer, but it does not make a shared or compromised device private. Avoid converting confidential files on public devices and remove downloaded copies when appropriate.</p>
      <p>Do not use this converter to bypass document permissions. If a PDF is password-protected or restricted, use an authorized copy and the document owner’s permitted workflow.</p>

      <h2>Troubleshooting</h2>
      <ul>
        <li><strong>“No selectable text was found”:</strong> the PDF may be scanned or image-only. Use OCR, then proofread.</li>
        <li><strong>File rejected:</strong> confirm it is a PDF, under 50 MB, and no more than 100 pages.</li>
        <li><strong>Encrypted or damaged PDF:</strong> open it in a trusted PDF reader and export an accessible, authorized copy if possible.</li>
        <li><strong>Text appears out of order:</strong> the source may use columns, positioned fragments, or unusual reading order. Correct the DOCX manually or extract smaller sections.</li>
        <li><strong>Missing images or tables:</strong> this tool is text-focused; those elements are not reliably reconstructed.</li>
        <li><strong>Conversion is slow:</strong> choose fewer pages and close memory-heavy tabs or apps.</li>
        <li><strong>DOCX opens with warnings:</strong> retry the conversion and open the file in a current compatible word processor. If the issue persists, use another authorized conversion workflow.</li>
      </ul>

      <h2>How to get the best result</h2>
      <ol>
        <li>Start with a clear, text-based PDF rather than a scan.</li>
        <li>Convert only the pages you need.</li>
        <li>Check headings, paragraph order, punctuation, numbers, and page breaks.</li>
        <li>Rebuild important tables and add missing images manually.</li>
        <li>Compare the final DOCX against the original PDF before sharing or publishing.</li>
      </ol>

      <h2>Alternatives and related workflows</h2>
      <p>For image-only pages, use <a href="/image-to-text">Image to Text OCR</a>. To turn PDF pages into pictures, use <a href="/pdf-to-jpg">PDF to JPG / PNG</a>. To rearrange pages, use <a href="/pdf-organizer">PDF Organizer</a>; to extract a page range as a separate PDF, use <a href="/pdf-splitter">PDF Splitter</a>. If you need to combine documents, use <a href="/pdf-merger">PDF Merger</a>.</p>

      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Is this PDF to Word converter free?</h3><p>Yes, the browser-based tool is available to use without a conversion upload to PicToSpec’s server.</p></div>
      <div className="faq"><h3>Does it create a DOC or DOCX file?</h3><p>It creates a DOCX document, the modern Word document format.</p></div>
      <div className="faq"><h3>Can I edit the converted text?</h3><p>Yes. Text is written as editable paragraphs in the DOCX. Layout and styling may need manual correction.</p></div>
      <div className="faq"><h3>Can it convert a scanned PDF?</h3><p>Not directly. Scanned pages need OCR before their words can be edited as text.</p></div>
      <div className="faq"><h3>Will the Word file look exactly like the PDF?</h3><p>No. The tool extracts text and approximates reading order; it does not promise an exact visual replica.</p></div>
      <div className="faq"><h3>Are tables converted into Word tables?</h3><p>Not reliably. Table text may be extracted, but cell structure and alignment can be lost.</p></div>
      <div className="faq"><h3>Are images and charts included?</h3><p>They are not reliably transferred by this text-focused converter.</p></div>
      <div className="faq"><h3>What is the maximum PDF size?</h3><p>The input must be smaller than 50 MB and contain no more than 100 pages.</p></div>
      <div className="faq"><h3>Can I convert only certain pages?</h3><p>Yes. Enter the first and last page of one continuous inclusive range, up to 100 pages.</p></div>
      <div className="faq"><h3>Why is the text in the wrong order?</h3><p>PDF text is positioned on the page. Columns, sidebars, or unusual layouts can confuse approximate reading-order reconstruction.</p></div>
      <div className="faq"><h3>Why does it say no selectable text was found?</h3><p>The PDF may contain scanned page images instead of text objects. Use OCR and check its result.</p></div>
      <div className="faq"><h3>Does conversion work on a phone?</h3><p>It runs in a modern browser, but large files can be slower or use more memory on phones. Try a smaller page range if needed.</p></div>
      <div className="faq"><h3>Are my PDF files uploaded?</h3><p>The current converter processes the source PDF in your browser and does not send it to a PicToSpec conversion server. Its PDF.js worker is loaded from a public CDN.</p></div>
      <div className="faq"><h3>Can I convert a password-protected PDF?</h3><p>Encrypted PDFs may not be supported. Use an authorized, accessible copy and do not bypass document restrictions.</p></div>
      <div className="faq"><h3>Should I trust the converted document for important work?</h3><p>Review it against the original, especially names, figures, tables, and legal or financial wording. The DOCX is an editable draft, not a guaranteed exact copy.</p></div>
    </section>
  );
}
