"use client";

import { useState } from "react";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ToolSearch from "@/components/ToolSearch";
import {
  formatPdfPageLabel,
  validatePdfStampRange,
  validatePdfWatermarkText
} from "@/lib/pdf-stamp.mjs";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_PAGES = 500;

function colorFromHex(hex: string) {
  const value = hex.replace("#", "");
  const red = parseInt(value.slice(0, 2), 16) / 255;
  const green = parseInt(value.slice(2, 4), 16) / 255;
  const blue = parseInt(value.slice(4, 6), 16) / 255;
  return rgb(red, green, blue);
}

function safeFileBase(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-+|-+$/g, "") || "document";
}

export default function PdfPageNumbersWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("");
  const [addPageNumbers, setAddPageNumbers] = useState(true);
  const [numberFormat, setNumberFormat] = useState<"number" | "page" | "page-of" | "fraction">("page-of");
  const [numberColor, setNumberColor] = useState("#303846");
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkSize, setWatermarkSize] = useState("42");
  const [watermarkOpacity, setWatermarkOpacity] = useState("18");
  const [watermarkColor, setWatermarkColor] = useState("#777777");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadPdf(nextFile: File | null) {
    setFile(null);
    setPageCount(0);
    setEndPage("");
    setError("");
    setStatus("");

    if (!nextFile) return;
    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError("Choose a PDF smaller than 100 MB.");
      return;
    }

    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await nextFile.arrayBuffer());
      const count = pdf.getPageCount();
      if (count < 1) throw new Error("This PDF does not contain any pages.");
      if (count > MAX_PAGES) throw new Error("This tool supports up to 500 pages per PDF.");
      setFile(nextFile);
      setPageCount(count);
      setStartPage("1");
      setEndPage(String(count));
      setStatus(count + " pages detected. Choose the pages you want to stamp.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read this PDF. It may be damaged or encrypted.");
    } finally {
      setBusy(false);
    }
  }

  async function createPdf() {
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    if (!addPageNumbers && !addWatermark) {
      setError("Choose page numbers, a watermark, or both.");
      return;
    }

    const rangeError = validatePdfStampRange(startPage, endPage, pageCount, MAX_PAGES);
    if (rangeError) {
      setError(rangeError);
      return;
    }

    const cleanWatermark = watermarkText.trim();
    if (addWatermark) {
      const watermarkError = validatePdfWatermarkText(cleanWatermark, 80);
      if (watermarkError) {
        setError(watermarkError);
        return;
      }
    }

    const chosenSize = Number(watermarkSize);
    const chosenOpacity = Number(watermarkOpacity);
    if (addWatermark && (!Number.isInteger(chosenSize) || chosenSize < 8 || chosenSize > 72)) {
      setError("Watermark font size must be between 8 and 72 points.");
      return;
    }
    if (addWatermark && (!Number.isInteger(chosenOpacity) || chosenOpacity < 5 || chosenOpacity > 60)) {
      setError("Watermark opacity must be between 5% and 60%.");
      return;
    }

    setBusy(true);
    setError("");
    setStatus("");
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      if (pdf.getPageCount() !== pageCount) {
        throw new Error("The PDF page count changed. Please select the file again.");
      }
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const first = Number(startPage) - 1;
      const last = Number(endPage) - 1;
      const selectedCount = last - first + 1;

      for (let index = first; index <= last; index += 1) {
        const page = pages[index];
        const size = page.getSize();

        if (addWatermark) {
          const widthAtOnePoint = font.widthOfTextAtSize(cleanWatermark, 1);
          const maxTextWidth = Math.min(size.width, size.height) * 1.05;
          const fittedSize = Math.min(chosenSize, maxTextWidth / Math.max(widthAtOnePoint, 1));
          if (fittedSize < 4) {
            throw new Error("Watermark text is too long for this page size. Use shorter text.");
          }
          const textWidth = font.widthOfTextAtSize(cleanWatermark, fittedSize);
          const diagonalLength = textWidth * Math.SQRT1_2;
          page.drawText(cleanWatermark, {
            x: (size.width - diagonalLength) / 2,
            y: (size.height + diagonalLength) / 2,
            size: fittedSize,
            font,
            color: colorFromHex(watermarkColor),
            opacity: chosenOpacity / 100,
            rotate: degrees(315)
          });
        }

        if (addPageNumbers) {
          const label = formatPdfPageLabel(index - first + 1, selectedCount, numberFormat);
          const labelSize = 9;
          const labelWidth = font.widthOfTextAtSize(label, labelSize);
          const margin = Math.max(14, Math.min(24, size.height * 0.025));
          page.drawText(label, {
            x: Math.max(8, (size.width - labelWidth) / 2),
            y: margin,
            size: labelSize,
            font,
            color: colorFromHex(numberColor),
            opacity: 0.92
          });
        }
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = safeFileBase(file.name) + "-stamped.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("Your updated PDF download has started. Open it and check the stamped pages.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update this PDF. Please try another file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="seo-page">
      <div className="tool-page-top">
        <a className="back" href="/">← PicToSpec home</a>
        <ToolSearch />
      </div>

      <p className="kicker">FREE PDF EDITING TOOL</p>
      <h1>Add Page Numbers & Watermark to PDF</h1>
      <p className="lead">
        Add clear page numbers, a light diagonal text watermark, or both. Choose a page range and create a new PDF without uploading your document to a processing server.
      </p>
      <p className="note">
        Files are processed locally in your browser. Editing a digitally signed PDF can invalidate its existing signatures. Keep your original file.
      </p>

      <section className="workspace" style={{ margin: "24px 0", padding: 20 }}>
        <h2>1. Choose one PDF</h2>
        <input
          type="file"
          accept=".pdf,application/pdf"
          disabled={busy}
          onChange={event => {
            loadPdf(event.target.files?.[0] || null);
            event.currentTarget.value = "";
          }}
        />
        {pageCount > 0 && <p role="status">{pageCount} pages detected · up to 500 pages supported.</p>}

        <h2>2. Select pages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
          <label>
            First page
            <input type="number" min="1" max={pageCount || 500} value={startPage} disabled={!file || busy} onChange={event => setStartPage(event.target.value)} />
          </label>
          <label>
            Last page
            <input type="number" min="1" max={pageCount || 500} value={endPage} disabled={!file || busy} onChange={event => setEndPage(event.target.value)} />
          </label>
        </div>
        <p>Only the selected range is changed. Other pages remain in the PDF without added marks.</p>

        <h2>3. Choose what to add</h2>
        <label style={{ display: "flex", alignItems: "center", gap: 9, margin: "10px 0" }}>
          <input type="checkbox" checked={addPageNumbers} disabled={busy} onChange={event => setAddPageNumbers(event.target.checked)} />
          Add page numbers
        </label>
        {addPageNumbers && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
            <label>
              Number style
              <select value={numberFormat} disabled={busy} onChange={event => setNumberFormat(event.target.value as typeof numberFormat)}>
                <option value="number">1, 2, 3</option>
                <option value="page">Page 1, Page 2</option>
                <option value="page-of">Page 1 of 5</option>
                <option value="fraction">1 / 5</option>
              </select>
            </label>
            <label>
              Number color
              <input type="color" value={numberColor} disabled={busy} onChange={event => setNumberColor(event.target.value)} />
            </label>
          </div>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: 9, margin: "18px 0 10px" }}>
          <input type="checkbox" checked={addWatermark} disabled={busy} onChange={event => setAddWatermark(event.target.checked)} />
          Add diagonal watermark
        </label>
        {addWatermark && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
            <label style={{ gridColumn: "1 / -1" }}>
              Watermark text
              <input type="text" maxLength={80} value={watermarkText} disabled={busy} onChange={event => setWatermarkText(event.target.value)} placeholder="CONFIDENTIAL" />
            </label>
            <label>
              Font size (points)
              <input type="number" min="8" max="72" value={watermarkSize} disabled={busy} onChange={event => setWatermarkSize(event.target.value)} />
            </label>
            <label>
              Opacity: {watermarkOpacity}%
              <input type="range" min="5" max="60" value={watermarkOpacity} disabled={busy} onChange={event => setWatermarkOpacity(event.target.value)} />
            </label>
            <label>
              Watermark color
              <input type="color" value={watermarkColor} disabled={busy} onChange={event => setWatermarkColor(event.target.value)} />
            </label>
          </div>
        )}

        <button className="primary download-action" disabled={!file || busy} onClick={createPdf} style={{ marginTop: 20, width: "100%" }}>
          {busy ? "Processing PDF…" : "↓ Download stamped PDF"}
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        {status && <p className="result" role="status">{status}</p>}
      </section>

      <section className="tool-content">
        <h2>How to add page numbers or a watermark to a PDF</h2>
        <p>
          Upload a PDF, choose the first and last pages to edit, then select page numbering, a watermark, or both. Page numbers are placed near the bottom centre. The optional watermark is placed diagonally across each selected page with adjustable size, colour and opacity. The source file is not changed; PicToSpec creates a separate PDF for download.
        </p>
        <h3>When this PDF tool is useful</h3>
        <ul>
          <li>Add page numbers to reports, assignments, manuals or meeting documents.</li>
          <li>Mark draft copies with labels such as DRAFT, SAMPLE or CONFIDENTIAL.</li>
          <li>Number only a chosen section while leaving the rest of the PDF untouched.</li>
        </ul>
        <h3>Privacy, compatibility and limitations</h3>
        <p>
          PDF editing runs in your browser. The tool supports PDF files up to 100 MB and 500 pages. Encrypted or damaged PDFs may not open. The built-in PDF font supports basic English letters, numbers and punctuation in watermark text. Existing digital signatures can become invalid after any PDF edit, so do not use the output as a replacement for a digitally signed original.
        </p>
        <h3>Frequently asked questions</h3>
        <details>
          <summary>Can I number only selected pages?</summary>
          <p>Yes. Enter the first and last page numbers. Numbering begins at 1 within the selected range, and unselected pages are not changed.</p>
        </details>
        <details>
          <summary>Can I add a watermark without page numbers?</summary>
          <p>Yes. Turn off Add page numbers and enable Add diagonal watermark. You can also use both options together.</p>
        </details>
        <details>
          <summary>Are my PDF files uploaded?</summary>
          <p>No. The PDF is read and updated locally in your browser. It is not sent to a PicToSpec PDF processing server.</p>
        </details>
      </section>
    </main>
  );
}
