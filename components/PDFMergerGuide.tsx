"use client";

import React from "react";

const sections = [
  {
    title: "What a PDF merger does",
    body: "A PDF merger combines separate PDF documents into one new PDF. Instead of sending several attachments, you can place related pages in a single file for easier review, printing, archiving or submission. PicToSpec merges the complete pages from each selected PDF and keeps the documents in the order you selected them. It does not edit the original source files.",
  },
  {
    title: "How to merge PDF files with PicToSpec",
    steps: [
      "Open the PDF Merger and choose at least two PDF files from your device, or drag and drop them into the file area.",
      "Select the files in the order you want them to appear. The selected-file list is your order check before you start.",
      "Check the filenames carefully. If the order is wrong, select the files again in the intended sequence.",
      "Choose Merge PDF files and keep the browser tab open while the documents are processed.",
      "When the download starts, open merged-pdf.pdf and review the first pages, last pages, page order and readability.",
    ],
  },
  {
    title: "How file order works",
    body: "The merger appends each selected PDF after the previous one. For example, selecting cover.pdf, report.pdf and appendix.pdf creates a document with the cover first, the report next and the appendix last. Pages inside each source PDF retain their original sequence. This tool does not provide a separate page-level rearrangement screen, so prepare the file selection order before merging.",
  },
  {
    title: "Useful examples and real-world workflows",
    bullets: [
      "Application documents: combine a cover letter, completed form and supporting PDFs when the receiving organisation asks for one file. Check its file-size and naming rules first.",
      "Invoices and receipts: combine related monthly PDFs into one record. Keep the original invoices separately for accounting and audit purposes.",
      "Reports: place an executive summary, main report and appendices in a predictable sequence.",
      "Study material: join lecture handouts or selected reading PDFs into one revision document.",
      "Scanned paperwork: combine separate scan PDFs into one file. Merging does not run OCR, so image-only scans remain image-only.",
      "Project handover: put approved specifications and reference documents together, while keeping confidential documents out of a shared bundle unless the recipient is authorised.",
    ],
  },
  {
    title: "Limits and compatibility",
    bullets: [
      "Input format: PDF files only. Images and Word documents must be converted to PDF before merging.",
      "Number of files: select at least 2 and no more than 20 PDFs per operation.",
      "Combined input size: no more than 100 MB across all selected files.",
      "Output length: the merged document cannot exceed 500 pages.",
      "Processing: the browser reads the files and creates the merged PDF locally. The source files are not uploaded to PicToSpec's PDF processing server.",
      "Device resources: large, image-heavy or complex PDFs can use substantial memory. A phone may run out of available memory before a desktop computer.",
      "Compatibility: encrypted, password-protected, damaged or unusual PDFs may fail to load. Use a legitimate, accessible copy if you have permission to process it.",
    ],
  },
  {
    title: "What is preserved—and what may not be",
    body: "The tool copies PDF pages into a newly created PDF. Page appearance and page sequence are the main purpose of this operation, but merging is not the same as combining every document-level feature. Do not assume that bookmarks, document outlines, fillable form behaviour, embedded attachments, signatures, accessibility structure, metadata or every interactive annotation will be carried over exactly. Links and other annotations can behave differently depending on how the source PDF was built. If any of these features are important, test the merged output in the PDF reader and workflow that your recipient uses.",
  },
  {
    title: "Digital signatures, forms and official submissions",
    body: "A digital signature is designed to detect changes to a signed document. Creating a new merged PDF changes the document, so the original signature validation should not be expected to remain valid for the combined file. Keep the signed originals and follow the receiving authority's instructions. For fillable forms, check that fields still work after merging; a flattened or copied page appearance is not the same as a fully editable form. Never merge documents into an official submission until you have checked the required order, page count, file size and signature rules.",
  },
  {
    title: "Privacy and safe handling",
    body: "PicToSpec performs this merge in your browser; the selected PDFs are not sent to its conversion server. However, the files remain accessible to the browser tab and device while processing. Use a trusted, updated device, avoid shared/public computers for sensitive paperwork, close the tab when finished and store the downloaded file securely. Browser-local processing is not a guarantee against malware on your device, unsafe browser extensions, screenshots or access by someone who already controls the device.",
  },
  {
    title: "How to prepare a clean merged PDF",
    bullets: [
      "Rename files clearly before selection, for example 01-cover.pdf, 02-form.pdf and 03-evidence.pdf.",
      "Open each source PDF first and check that it is the correct version and is not blank or corrupted.",
      "Rotate incorrectly oriented pages in a PDF editor before merging; this merger does not offer page rotation controls.",
      "If the output must be small, compress the source PDFs before merging and verify that text and images remain readable.",
      "Avoid adding duplicate copies of the same document. Check the page count and sequence after downloading.",
      "Keep a separate backup of the source files. The merger creates a new output and does not replace them.",
    ],
  },
  {
    title: "Troubleshooting",
    bullets: [
      "Only one file selected: the merger needs at least two PDFs. Add another supported PDF.",
      "More than 20 files: split the task into smaller groups, then merge the resulting PDFs if the final output remains within the limits.",
      "Combined size is over 100 MB: reduce the source file sizes or process smaller groups. Check the final combined page limit too.",
      "The output would exceed 500 pages: create smaller bundles. The tool stops rather than creating an output beyond its page limit.",
      "A file is rejected: confirm it is a PDF, not a renamed image or Word file. Re-export a valid PDF from the original application.",
      "Password or loading error: the PDF may be encrypted, damaged or unsupported. Only remove protection when you are authorised to do so.",
      "Browser freezes or runs out of memory: close other tabs and apps, use a modern browser, restart the browser and try a smaller batch.",
      "Download does not appear: check the browser's downloads list and download permissions. Try again after allowing downloads for the site.",
      "Pages appear in an unexpected order: the merger follows the selected-file order. Re-select the PDFs in the required sequence and merge again.",
    ],
  },
  {
    title: "Alternatives and related tasks",
    body: "Use a PDF splitter when you need to extract one continuous page range from a PDF. Use PDF Organizer when you need to specify page order, remove selected pages or rotate pages. Use PDF Page Numbers & Watermark when the combined file needs visible page numbering or a text watermark. If you need to edit text, OCR a scan, preserve complex forms or manage bookmarks, use a dedicated PDF editor and verify its output.",
  },
];

const faqs = [
  ["How many PDF files can I merge?", "You can select 2 to 20 PDF files in one operation."],
  ["What is the maximum combined file size?", "The total size of all selected PDFs must be 100 MB or less."],
  ["How many pages can the merged PDF contain?", "The output is limited to 500 pages. The tool stops if the combined page count would exceed that limit."],
  ["Can I choose the order of the PDFs?", "Yes. Select the files in the order you want them to appear. Each file's pages are appended in their existing order."],
  ["Can I rearrange individual pages?", "Not in this merger. Use PDF Organizer when you need page-level ordering, removal or rotation."],
  ["Are my PDFs uploaded to a server?", "No. The selected files are processed locally in your browser and are not uploaded to PicToSpec's PDF processing server."],
  ["Can I merge a password-protected PDF?", "Encrypted PDFs may fail to load. Only use an unencrypted copy when you are authorised to access and process it."],
  ["Will the original PDFs be changed?", "No. The merger creates a separate file named merged-pdf.pdf. Your selected source files remain unchanged."],
  ["Will bookmarks and fillable forms be preserved?", "Do not assume document-level features such as bookmarks, form behaviour, attachments or all annotations will be preserved. Check the output carefully."],
  ["Will digital signatures remain valid?", "A newly merged PDF is a changed document. Do not expect the original digital signatures to validate on the combined file; retain signed originals."],
  ["Can I merge JPG or Word files?", "No. This tool accepts PDF files only. Convert other formats to PDF first using an appropriate converter."],
  ["Why did merging fail?", "A source may be encrypted, damaged or unsupported, or the device may not have enough memory. Try opening the source PDFs and merging a smaller batch."],
  ["Can I use it on a phone?", "Yes, in a modern mobile browser, but large PDFs may need more memory than the phone has available. Smaller batches are more reliable."],
  ["Does merging make the PDF smaller?", "No. Merging combines documents; it is not a compression operation. The output may be similar in size to the combined inputs."],
  ["Can I add page numbers while merging?", "No. Merge first, then use the PDF Page Numbers & Watermark tool if you need visible numbering."],
  ["How do I check the result?", "Open the downloaded PDF and inspect its page order, total page count, orientation, readability and any important interactive features."],
];

export default function PDFMergerGuide() {
  return (
    <section className="tool-content" aria-label="PDF merger guide">
      <p className="kicker">PDF MERGER GUIDE</p>
      <h2>Merge PDF files online: complete guide</h2>
      <p>
        Combine related PDF documents into one file without installing desktop software. This guide
        explains the workflow, file limits, ordering, privacy, compatibility and checks to make
        before sharing a merged document.
      </p>
      {sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {"body" in section && <p>{section.body}</p>}
          {"steps" in section && (
            <ol>{section.steps.map((item) => <li key={item}>{item}</li>)}</ol>
          )}
          {"bullets" in section && (
            <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
          )}
        </section>
      ))}
      <section>
        <h2>Frequently asked questions</h2>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <section>
        <h2>Related PDF tools</h2>
        <p>
          <a href="/pdf-organizer">PDF Organizer</a> ·{" "}
          <a href="/pdf-splitter">PDF Splitter</a> ·{" "}
          <a href="/pdf-page-numbers-watermark">PDF Page Numbers &amp; Watermark</a> ·{" "}
          <a href="/pdf-to-jpg">PDF to JPG</a>
        </p>
      </section>
    </section>
  );
}
