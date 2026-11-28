"use client";

export default function PDFOrganizerGuide() {
  return (
    <section className="tool-content" aria-labelledby="pdf-organizer-guide">
      <h2 id="pdf-organizer-guide">PDF Organizer: complete page management guide</h2>
      <p>A PDF page organizer changes the order and selection of whole pages. Use it to put a report in the right sequence, remove blank or unwanted pages, or rotate pages that display sideways. This tool creates a new PDF; it does not edit text, images, or other content inside a page.</p>

      <h2>What this PDF organizer does</h2>
      <ul>
        <li>Reorder pages by entering their page numbers in the desired sequence.</li>
        <li>Remove pages by leaving their numbers out of the sequence.</li>
        <li>Rotate every included page by 0°, 90°, 180°, or 270°.</li>
        <li>Export a separate PDF containing the selected pages in the order entered.</li>
      </ul>
      <p>The current interface uses a comma-separated page list, not drag-and-drop thumbnails. It applies one rotation choice to all included pages; individual-page rotation controls are not available.</p>

      <h2>How to organize a PDF</h2>
      <ol>
        <li>Choose one PDF file. The tool detects its page count.</li>
        <li>In the page-order box, enter every page you want to keep, separated by commas.</li>
        <li>Put the numbers in the order you want them to appear in the output.</li>
        <li>Leave out any page you want to remove.</li>
        <li>Choose a rotation for all included pages, or keep “No rotation”.</li>
        <li>Select <strong>Download organized PDF</strong>, then open the output and check its order and orientation.</li>
      </ol>
      <p>Example: for a source with pages 1, 2, 3, 4, 5, entering <code>3, 1, 2, 5</code> creates a four-page PDF in that order and omits page 4. The list must contain valid page numbers and cannot contain duplicates.</p>

      <h2>Reordering, removing, and rotating: examples</h2>
      <ul>
        <li><strong>Move a page to the front:</strong> enter its number first, followed by the remaining pages in order.</li>
        <li><strong>Remove a blank page:</strong> omit that page number from the list.</li>
        <li><strong>Extract a selection:</strong> enter only the pages you need, in the desired order.</li>
        <li><strong>Correct sideways scans:</strong> choose 90° or 270° for all included pages. Check which direction is correct before using the whole document.</li>
        <li><strong>Turn pages upside down:</strong> choose 180°.</li>
      </ul>
      <p>Rotation is applied relative to each page’s existing rotation. If pages in the source have mixed orientations, applying the same rotation to all of them may not produce a consistent result. For mixed documents, a PDF editor with per-page rotation is a better fit.</p>

      <h2>Input limits and validation</h2>
      <ul>
        <li>Input format: PDF only.</li>
        <li>Maximum file size: 100 MB.</li>
        <li>Maximum source length: 500 pages.</li>
        <li>Maximum output length: 500 pages.</li>
        <li>Page list: comma-separated integers within the source page count.</li>
        <li>Duplicate page numbers are rejected.</li>
        <li>Output: a new PDF containing the listed pages.</li>
      </ul>
      <p>At least one valid page number must be provided. Page numbers are 1-based: the first page is 1, not 0. The tool does not accept page ranges such as “2-5” in the current comma-separated interface; enter each page separately.</p>

      <h2>When to use this tool—and when not to</h2>
      <ul>
        <li><strong>Good fit:</strong> rearranging a report, removing unwanted pages, extracting selected pages, or applying the same rotation to a document.</li>
        <li><strong>Use a thumbnail-based editor:</strong> when you want to visually drag pages, preview each page, or rotate only a few pages individually.</li>
        <li><strong>Use a PDF splitter:</strong> when you want to extract one continuous page range without manually listing every page.</li>
        <li><strong>Use a PDF merger:</strong> when you need to combine pages from multiple PDF files.</li>
        <li><strong>Use a full PDF editor:</strong> when you need to change text, images, links, annotations, page size, or content within pages.</li>
      </ul>

      <h2>Privacy, security, and document integrity</h2>
      <p>The current workflow reads and processes the PDF in your browser and does not send the source file to a PicToSpec PDF processing server. Local processing reduces file transfer, but it does not make a shared or compromised device private. Avoid working with confidential files on public devices and handle downloaded copies carefully.</p>
      <p>Encrypted or damaged PDFs may fail to load. Use only documents you are authorized to access; this tool is not intended to bypass passwords or document permissions. Keep an untouched original, especially for signed, official, legal, or archival documents. Reordering or removing pages can invalidate digital signatures or certification.</p>

      <h2>What happens to PDF content?</h2>
      <p>The organizer copies complete pages into a new PDF. It does not provide controls for editing text or images inside those pages. The output should be checked for page order, orientation, links, annotations, forms, and any special document features that matter to your workflow. PDF features can behave differently after page copying, so do not assume every interactive or signed feature will remain intact.</p>

      <h2>Common mistakes to avoid</h2>
      <ul>
        <li>Forgetting a page number: the page will be omitted from the output.</li>
        <li>Entering numbers in the source order when you intended to rearrange them.</li>
        <li>Using 0 as the first page number; numbering starts at 1.</li>
        <li>Repeating a number; duplicate pages are rejected.</li>
        <li>Expecting “2-6” to mean a range; enter <code>2, 3, 4, 5, 6</code>.</li>
        <li>Rotating every page when only one page is sideways.</li>
        <li>Replacing the original signed PDF with an edited copy.</li>
      </ul>

      <h2>Troubleshooting</h2>
      <ul>
        <li><strong>Invalid page number:</strong> use whole numbers from 1 through the detected page count.</li>
        <li><strong>Duplicate page error:</strong> remove repeated numbers from the list.</li>
        <li><strong>Output is missing pages:</strong> compare the entered list with the source; only listed pages are kept.</li>
        <li><strong>Pages are in the wrong order:</strong> reorder the comma-separated list and export again.</li>
        <li><strong>Some pages face the wrong way:</strong> the tool rotates all included pages together. Use a dedicated editor for individual-page rotation.</li>
        <li><strong>PDF does not load:</strong> confirm it is under 100 MB and no more than 500 pages; encrypted or damaged files may not work.</li>
        <li><strong>Processing is slow:</strong> try a smaller selection and close other memory-heavy tabs.</li>
        <li><strong>Important interactive features changed:</strong> retain the original and use a specialized PDF editor for forms, signatures, or advanced features.</li>
      </ul>

      <h2>How to get the best result</h2>
      <ol>
        <li>Keep a backup of the original PDF.</li>
        <li>Write down the intended page sequence before editing a long document.</li>
        <li>For a small selection, enter only the pages needed.</li>
        <li>Test rotation on a short output first if the source has mixed orientations.</li>
        <li>Open the downloaded PDF and verify page count, sequence, and orientation.</li>
        <li>Keep signed originals unchanged and confirm any required signatures after editing.</li>
      </ol>

      <h2>Related PDF tools</h2>
      <p>To extract a continuous range, use <a href="/pdf-splitter">PDF Splitter</a>. To combine separate PDFs, use <a href="/pdf-merger">PDF Merger</a>. To add page numbers or a watermark, use <a href="/pdf-page-numbers-watermark">PDF Page Numbers & Watermark</a>. To convert pages to images, use <a href="/pdf-to-jpg">PDF to JPG / PNG</a>.</p>

      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Can I reorder PDF pages?</h3><p>Yes. Enter the page numbers in the exact order you want them in the output.</p></div>
      <div className="faq"><h3>How do I delete a page?</h3><p>Leave its page number out of the comma-separated list. Only listed pages are copied.</p></div>
      <div className="faq"><h3>Can I extract only selected pages?</h3><p>Yes. Enter only the pages you want to keep, in the desired order.</p></div>
      <div className="faq"><h3>Can I use page ranges like 2-5?</h3><p>Not in the current interface. Enter each page separately, such as 2, 3, 4, 5.</p></div>
      <div className="faq"><h3>Can I duplicate a page?</h3><p>No. Duplicate page numbers are rejected.</p></div>
      <div className="faq"><h3>Can I rotate only one page?</h3><p>No. The selected rotation applies to every included page. Use a PDF editor for individual-page rotation.</p></div>
      <div className="faq"><h3>What rotation options are available?</h3><p>No rotation, 90°, 180°, or 270°. The 90° and 270° options are clockwise.</p></div>
      <div className="faq"><h3>Does it edit text inside a PDF?</h3><p>No. It reorganizes complete pages; it does not edit page content.</p></div>
      <div className="faq"><h3>What is the maximum file size?</h3><p>Up to 100 MB and 500 source pages; output is limited to 500 pages.</p></div>
      <div className="faq"><h3>Are my files uploaded?</h3><p>The current workflow processes the source PDF in your browser and does not send it to a PicToSpec PDF processing server.</p></div>
      <div className="faq"><h3>Can it open encrypted PDFs?</h3><p>Encrypted files may not work. Use an authorized accessible copy; the tool does not bypass restrictions.</p></div>
      <div className="faq"><h3>Will digital signatures remain valid?</h3><p>Page changes can invalidate signatures or certification. Preserve the original signed document.</p></div>
      <div className="faq"><h3>Why are some pages missing?</h3><p>Only page numbers in the list are included. Add any omitted pages you want to keep.</p></div>
      <div className="faq"><h3>Why does a page still look sideways?</h3><p>The rotation is applied relative to its existing orientation. Mixed-orientation PDFs may need individual page adjustments in another editor.</p></div>
      <div className="faq"><h3>Does the tool overwrite my original?</h3><p>No. It downloads a new organized PDF.</p></div>
    </section>
  );
}
