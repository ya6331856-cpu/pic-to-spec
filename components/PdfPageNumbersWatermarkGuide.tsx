"use client";

export default function PdfPageNumbersWatermarkGuide() {
  return (
    <section className="tool-content" aria-labelledby="pdf-stamp-guide">
      <h2 id="pdf-stamp-guide">PDF page numbers and watermarks: complete guide</h2>
      <p>Page numbers help readers navigate a document; watermarks communicate status, ownership, or handling instructions. This tool adds either or both to a selected range of pages and exports a separate PDF. It does not rewrite your original file.</p>

      <h2>What the tool can add</h2>
      <ul>
        <li><strong>Page numbers:</strong> choose “1, 2, 3”, “Page 1”, “Page 1 of 5”, or “1 / 5”, and select a number color.</li>
        <li><strong>Diagonal text watermark:</strong> enter text up to 80 characters, choose a color, font size from 8–72 points, and opacity from 5–60%.</li>
        <li><strong>Selected pages:</strong> enter one continuous first-to-last page range. Pages outside it remain without new marks.</li>
        <li><strong>Combined output:</strong> apply page numbers, a watermark, or both in the same operation.</li>
      </ul>
      <p>Page numbers are drawn near the bottom centre. The watermark is drawn diagonally. The tool uses a built-in standard Helvetica font; it is not a full typography or layout editor.</p>

      <h2>How to add page numbers or a watermark</h2>
      <ol>
        <li>Choose a PDF file. The tool reads it and detects its page count.</li>
        <li>Enter the first and last page to change. The range includes both endpoints; pages 3–7 means five pages.</li>
        <li>Enable page numbers, a watermark, or both. Set the available style options.</li>
        <li>For a watermark, use short text and adjust size, color, and opacity so the document remains readable.</li>
        <li>Select <strong>Download stamped PDF</strong>. Open the downloaded file and inspect the changed pages before sharing it.</li>
      </ol>
      <p>To apply marks to the whole document, leave the first page at 1 and the last page at the detected page count. If you only want a chapter or appendix marked, use its page range.</p>

      <h2>How numbering works</h2>
      <p>Numbering starts at 1 for the first page in the selected range, not necessarily at that page’s original PDF page number. For example, if you select pages 8–12, the labels will be 1 through 5 (or the equivalent chosen format). “Page 1 of 5” and “1 / 5” use the selected range’s count as the total.</p>
      <p>The number is placed at the bottom centre with a fixed small text size and a margin based on page height. There is no control for top/bottom placement, left/right alignment, font size, custom starting number, Roman numerals, or section-specific numbering. Existing page content is not automatically shifted to make room, so check that the number does not cover important text.</p>

      <h2>Choosing a useful watermark</h2>
      <p>Common labels include DRAFT, SAMPLE, CONFIDENTIAL, REVIEW COPY, or an organization’s name, provided you have the right to use it. A watermark is a visible annotation, not encryption or access control. Anyone with the PDF may still copy, screenshot, or remove marks using other software.</p>
      <ul>
        <li><strong>Keep it brief:</strong> long text may be scaled down to fit; extremely long text can be rejected.</li>
        <li><strong>Protect readability:</strong> use a light color and lower opacity for ordinary reading copies. Increase contrast only when the mark needs to stand out.</li>
        <li><strong>Test a sample:</strong> page sizes and orientations vary. Inspect portrait, landscape, and unusually small pages.</li>
        <li><strong>Use accurate labels:</strong> do not mark a document “confidential” unless that status is appropriate.</li>
      </ul>
      <p>The selected opacity is applied to the watermark text. The watermark is rotated diagonally and positioned around the page centre; placement is not manually adjustable.</p>

      <h2>When this tool is useful—and when it is not</h2>
      <ul>
        <li><strong>Useful:</strong> reports, assignments, manuals, handouts, draft reviews, sample copies, and documents that need simple navigation or a visible status label.</li>
        <li><strong>Not a substitute for:</strong> redaction, encryption, password protection, digital signing, copyright protection, or document permissions.</li>
        <li><strong>Use a dedicated editor:</strong> when you need headers/footers, precise placement, custom fonts, different numbering by section, page labels that continue from an earlier document, or complex branded layouts.</li>
        <li><strong>Keep the original:</strong> especially for signed, official, legal, or archival documents.</li>
      </ul>

      <h2>File limits and compatibility</h2>
      <ul>
        <li>Input: PDF only.</li>
        <li>Maximum file size: 100 MB.</li>
        <li>Maximum document length: 500 pages.</li>
        <li>Page selection: one continuous inclusive range.</li>
        <li>Watermark text: up to 80 characters; built-in Helvetica supports basic English letters, numbers, and punctuation.</li>
        <li>Watermark size: 8–72 points; opacity: 5–60%.</li>
        <li>Output: a separate stamped PDF.</li>
      </ul>
      <p>Large files can take longer and use substantial browser memory, particularly on older phones. If processing fails, try a smaller file or a shorter page range. Encrypted or damaged PDFs may not open.</p>

      <h2>Privacy and digital signatures</h2>
      <p>The PDF is read and modified locally in your browser; the current workflow does not send the source document to a PicToSpec PDF processing server. Local processing reduces file transfer, but it does not guarantee privacy on a shared or compromised device. Avoid handling sensitive documents on public devices and manage downloaded copies carefully.</p>
      <p>Adding any mark changes the PDF bytes and can invalidate an existing digital signature or certification. Do not use the stamped output as a replacement for a digitally signed original. Preserve the original and follow the document owner’s authorized process.</p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>Choosing the wrong page range—check the detected page count and remember that both endpoints are included.</li>
        <li>Assuming numbering continues from the original PDF page number—the selected range starts at 1.</li>
        <li>Using a dark, large watermark that obscures text or makes printing difficult.</li>
        <li>Assuming a watermark prevents copying or editing—it does not.</li>
        <li>Overwriting the only copy of a signed or important PDF—keep the original separately.</li>
        <li>Failing to inspect landscape pages, pages with content near the bottom, or pages with different dimensions.</li>
      </ul>

      <h2>Troubleshooting</h2>
      <ul>
        <li><strong>PDF is rejected:</strong> confirm it is a PDF, below 100 MB, and has no more than 500 pages.</li>
        <li><strong>File will not load:</strong> it may be encrypted, damaged, or use unsupported features. Try opening an authorized copy in a trusted PDF reader and exporting a compatible PDF.</li>
        <li><strong>Wrong pages are marked:</strong> recheck the first and last page; the range is inclusive and based on the PDF’s page order.</li>
        <li><strong>Numbers start at 1 unexpectedly:</strong> this is intentional; numbering restarts within the selected range.</li>
        <li><strong>Watermark is too faint or strong:</strong> adjust opacity and color, then inspect the output on screen and in print.</li>
        <li><strong>Watermark text is tiny or rejected:</strong> shorten the text; the tool fits text to the page and enforces an 80-character limit.</li>
        <li><strong>Marks cover content:</strong> choose a different page range or use a PDF editor with manual positioning; this tool does not move existing content.</li>
        <li><strong>Browser becomes slow:</strong> close other heavy tabs and process fewer pages at a time.</li>
        <li><strong>Signature warning appears:</strong> expected after editing a signed PDF. Retain the original signed file.</li>
      </ul>

      <h2>How to get the best result</h2>
      <ol>
        <li>Keep an untouched copy of the source PDF.</li>
        <li>Start with a short page range to verify placement and appearance.</li>
        <li>Choose a number format that suits the document; use “Page 1 of 5” when readers need the section total.</li>
        <li>Use concise watermark text and a low enough opacity to preserve legibility.</li>
        <li>Review the exported PDF at normal zoom and, if relevant, in print preview.</li>
        <li>Confirm page count, numbering sequence, and signature status before distribution.</li>
      </ol>

      <h2>Alternatives and related PDF workflows</h2>
      <p>For precise headers, footers, custom numbering, or movable watermarks, use a full PDF editor. To rearrange, rotate, or remove pages, try <a href="/pdf-organizer">PDF Organizer</a>. To combine documents, use <a href="/pdf-merger">PDF Merger</a>; to extract a range, use <a href="/pdf-splitter">PDF Splitter</a>. To turn pages into images, use <a href="/pdf-to-jpg">PDF to JPG / PNG</a>.</p>

      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Can I add only page numbers?</h3><p>Yes. Enable page numbers and leave the watermark option off.</p></div>
      <div className="faq"><h3>Can I add only a watermark?</h3><p>Yes. Turn off page numbers and enable the diagonal watermark.</p></div>
      <div className="faq"><h3>Can I add both at once?</h3><p>Yes. Enable both options before downloading.</p></div>
      <div className="faq"><h3>Can I mark selected pages only?</h3><p>Yes. Enter the first and last page of one continuous inclusive range.</p></div>
      <div className="faq"><h3>Does numbering continue from the original page number?</h3><p>No. Numbering begins at 1 on the first selected page.</p></div>
      <div className="faq"><h3>Does “Page 1 of 5” count the whole PDF?</h3><p>It counts the selected range. If you select five pages, the total shown is five.</p></div>
      <div className="faq"><h3>Can I choose where page numbers appear?</h3><p>No. They are placed near the bottom centre. Manual positioning is not available.</p></div>
      <div className="faq"><h3>Can I change the page-number font or size?</h3><p>No. The tool uses a built-in standard font and fixed small page-number text size.</p></div>
      <div className="faq"><h3>Can I use a custom font in the watermark?</h3><p>No. Watermarks use built-in Helvetica, which is intended for basic English text, numbers, and punctuation.</p></div>
      <div className="faq"><h3>What is the maximum watermark text length?</h3><p>Up to 80 characters. Shorter text is more likely to remain legible.</p></div>
      <div className="faq"><h3>What watermark size and opacity are allowed?</h3><p>Font size is 8–72 points and opacity is 5–60%.</p></div>
      <div className="faq"><h3>Does a watermark prevent copying?</h3><p>No. It is a visible mark, not a security control or DRM.</p></div>
      <div className="faq"><h3>Will the tool remove existing page numbers?</h3><p>No. It adds new marks and does not detect or remove existing numbers or watermarks.</p></div>
      <div className="faq"><h3>Are my PDF files uploaded?</h3><p>The current tool processes the file locally in your browser and does not send it to a PicToSpec PDF processing server.</p></div>
      <div className="faq"><h3>Can I edit a digitally signed PDF?</h3><p>You may be able to create an output, but editing can invalidate existing signatures. Keep the signed original unchanged.</p></div>
      <div className="faq"><h3>What is the maximum PDF size?</h3><p>The tool supports files up to 100 MB and 500 pages.</p></div>
      <div className="faq"><h3>Why did the PDF fail to load?</h3><p>It may be encrypted, damaged, too large, or exceed the page limit. Try a compatible authorized copy or a smaller document.</p></div>
      <div className="faq"><h3>Does it change pages outside my selected range?</h3><p>No new marks are added to pages outside the selected range; the rest of the document remains in the output.</p></div>
      <div className="faq"><h3>Can I use this on a phone?</h3><p>Yes, in a modern browser, although large PDFs may take longer and use more memory on mobile devices.</p></div>
      <div className="faq"><h3>Is the output a separate file?</h3><p>Yes. The tool downloads a new stamped PDF and does not overwrite the original file.</p></div>
    </section>
  );
}
