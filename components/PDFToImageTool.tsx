"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import ToolSearch from "@/components/ToolSearch";

type OutputFormat = "image/jpeg" | "image/png";
const MAX_FILE_BYTES = 100 * 1024 * 1024;
const MAX_PAGES = 30;
const MAX_PIXELS = 24000000;

export default function PDFToImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("1");
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [download, setDownload] = useState<{url:string;name:string}|null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const downloadUrlRef = useRef("");

  useEffect(() => {
    if (!download) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({behavior: reduced ? "auto" : "smooth", block:"center"}));
  }, [download]);

  useEffect(() => () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
  }, []);

  async function selectPdf(next: File | null) {
    setFile(null); setPageCount(0); setError(""); setStatus(""); setDownload(null);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = "";
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file."); return;
    }
    if (next.size > MAX_FILE_BYTES) {
      setError("This tool supports PDF files up to 100 MB."); return;
    }
    setBusy(true);
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({data: await next.arrayBuffer()}).promise;
      if (pdf.numPages < 1) throw new Error("This PDF does not contain any pages.");
      if (pdf.numPages > 500) throw new Error("This tool supports PDFs up to 500 pages. Use a smaller document.");
      setFile(next);
      setPageCount(pdf.numPages);
      setEndPage(String(Math.min(pdf.numPages, 5)));
      setStatus(pdf.numPages + " pages detected. Choose the pages you want to convert.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF. It may be damaged or encrypted.");
    } finally { if (pdf) { try { await pdf.cleanup(); } catch {} } setBusy(false); }
  }

  async function convert() {
    if (!file) { setError("Choose a PDF file first."); return; }
    const first = Number(startPage), last = Number(endPage);
    if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last < first || last > pageCount) {
      setError("Enter a valid page range between 1 and " + pageCount + "."); return;
    }
    if (last - first + 1 > MAX_PAGES) {
      setError("Convert up to " + MAX_PAGES + " pages per download. Choose a smaller page range."); return;
    }
    setBusy(true); setError(""); setStatus(""); setDownload(null);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = "";
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({data: await file.arrayBuffer()}).promise;
      const zip = new JSZip();
      const extension = format === "image/png" ? "png" : "jpg";
      const prefix = file.name.replace(/\.pdf$/i, "").replace(/[^a-z0-9_-]+/gi, "-").slice(0, 50) || "document";
      const imageFiles: {name:string; blob:Blob}[] = [];
      for (let pageNumber = first; pageNumber <= last; pageNumber++) {
        setStatus("Converting page " + pageNumber + " of " + last + "…");
        const page = await pdf.getPage(pageNumber);
        const base = page.getViewport({scale: 1});
        const scale = Math.min(2, Math.sqrt(MAX_PIXELS / (base.width * base.height)));
        const viewport = page.getViewport({scale});
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const context = canvas.getContext("2d", {alpha: format === "image/png"});
        if (!context) throw new Error("Your browser could not create an image canvas.");
        await page.render({canvas, canvasContext: context, viewport}).promise;
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
          value => value ? resolve(value) : reject(new Error("Could not export page " + pageNumber + " as an image.")),
          format,
          format === "image/jpeg" ? 0.92 : undefined
        ));
        const name = prefix + "-page-" + String(pageNumber).padStart(3, "0") + "." + extension;
        imageFiles.push({name, blob});
        canvas.width = 0; canvas.height = 0;
        page.cleanup();
      }
      let output: Blob;
      let outputName: string;
      if (imageFiles.length === 1) {
        output = imageFiles[0].blob;
        outputName = imageFiles[0].name;
      } else {
        imageFiles.forEach(item => zip.file(item.name, item.blob));
        output = await zip.generateAsync({type:"blob"});
        outputName = prefix + "-pages-" + first + "-to-" + last + ".zip";
      }
      const url = URL.createObjectURL(output);
      downloadUrlRef.current = url;
      setDownload({url, name:outputName});
      setStatus(imageFiles.length + " page" + (imageFiles.length === 1 ? "" : "s") + " converted. Your download is ready.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this PDF. Try another file.");
    } finally {
      // Always release the UI lock, including when PDF.js fails before opening the document.
      setBusy(false);
    }
  }

  return <main className="seo-page">
    <div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch /></div>
    <p className="kicker">FREE PDF CONVERTER</p>
    <h1>PDF to JPG / PNG Converter</h1>
    <p className="lead">Convert PDF pages into clear JPG or PNG images online. Choose a page range, select an image format, and download one image or a ZIP of multiple pages.</p>
    <p className="note">Your PDF is processed in your browser, not uploaded to PicToSpec. The PDF.js worker is loaded from a public CDN. Keep your original document and review converted images before sharing.</p>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>1. Upload your PDF</h2>
      <input type="file" accept=".pdf,application/pdf" disabled={busy} onChange={e=>{selectPdf(e.target.files?.[0]||null);e.currentTarget.value="";}}/>
      {file&&<p>{file.name} · {(file.size/1024/1024).toFixed(2)} MB · {pageCount} pages</p>}
      <h2>2. Choose pages</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
        <label>First page<input aria-label="First page" type="number" min="1" max={pageCount||500} value={startPage} onChange={e=>setStartPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
        <label>Last page<input aria-label="Last page" type="number" min="1" max={pageCount||500} value={endPage} onChange={e=>setEndPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
      </div>
      <p>Convert up to {MAX_PAGES} pages in one download. For the entire PDF, set the last page to {pageCount || "the final page"}.</p>
      <h2>3. Select image format</h2>
      <select aria-label="Image format" value={format} onChange={e=>setFormat(e.target.value as OutputFormat)} style={{width:"100%",padding:12}}>
        <option value="image/jpeg">JPG – smaller files, good for sharing</option>
        <option value="image/png">PNG – lossless image quality</option>
      </select>
      <button className="primary" disabled={!file||busy} onClick={convert} style={{marginTop:18}}>{busy?"Converting…":"Convert PDF to images →"}</button>
      {error&&<p className="error" role="alert">{error}</p>}
      {status&&<p className="result" role="status" aria-live="polite">{status}</p>}
      {download&&<div className="result result-ready" ref={resultRef}><div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your images are ready!</b><p>{download.name}</p></div></div><a className="result-download" href={download.url} download={download.name}>↓ Download {download.name.endsWith(".zip")?"ZIP":"image"}</a></div>}
    </section>
    <section className="tool-content">
      <h2>How to convert a PDF to JPG or PNG</h2>
      <ol><li>Choose a PDF file from your device (up to 100 MB).</li><li>Enter the first and last page you want to convert.</li><li>Choose JPG for smaller files or PNG for lossless output.</li><li>Select Convert. A single page downloads as an image; multiple pages are packed into a ZIP file.</li></ol>
      <h2>JPG or PNG: which format should you choose?</h2>
      <p>JPG is usually a practical choice for photographs and smaller file sizes. PNG keeps image data lossless and can be useful for diagrams, screenshots and pages with sharp text, although files may be larger. Neither format turns the page into editable text; use OCR if you need to extract words.</p>
      <h2>Limits and privacy</h2>
      <p>PDF files must be 100 MB or smaller and contain no more than 500 pages. You can export up to 30 pages per operation. Each rendered page is capped at approximately 24 megapixels to reduce browser memory use. Encrypted, damaged or unusually complex PDFs may fail. Processing happens locally in your browser, but the PDF.js worker code is loaded from a public CDN.</p>
      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Can I convert every page at once?</h3><p>Yes, if the document has 30 pages or fewer. For longer PDFs, convert them in separate page ranges of up to 30 pages.</p></div>
      <div className="faq"><h3>Can I download each page separately?</h3><p>When you convert more than one page, the images are placed in a ZIP archive. Extract the ZIP on your device to access each image.</p></div>
      <div className="faq"><h3>Will the text in the image be editable?</h3><p>No. JPG and PNG are image formats. To extract selectable text, use the PicToSpec Image to Text OCR tool.</p></div>
    </section>
    <section className="guides"><a href="/pdf-merger">Merge PDF</a><a href="/pdf-splitter">Split PDF</a><a href="/pdf-organizer">Organize PDF pages</a><a href="/image-to-text">Image to Text OCR</a></section>
  </main>;
}
