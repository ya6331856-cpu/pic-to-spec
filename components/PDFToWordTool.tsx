"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import ToolSearch from "@/components/ToolSearch";

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_PAGES = 100;

function xml(value: string) {
  // XML 1.0 forbids most C0 control characters; strip them before writing DOCX parts.
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

type TextLine = { y: number; items: { x: number; text: string }[] };

export default function PDFToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [firstPage, setFirstPage] = useState("1");
  const [lastPage, setLastPage] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const downloadUrlRef = useRef("");

  useEffect(() => () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
  }, []);

  async function chooseFile(next: File | null) {
    setFile(null); setPageCount(0); setError(""); setStatus("");
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = "";
    setDownloadUrl(""); setDownloadName("");
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file."); return;
    }
    if (next.size > MAX_BYTES) {
      setError("Please choose a PDF smaller than 50 MB."); return;
    }
    setBusy(true);
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({ data: await next.arrayBuffer() }).promise;
      if (pdf.numPages < 1) throw new Error("This PDF does not contain any pages.");
      if (pdf.numPages > MAX_PAGES) throw new Error("This tool supports up to 100 pages per conversion.");
      setFile(next); setPageCount(pdf.numPages); setLastPage(String(pdf.numPages));
      setStatus(pdf.numPages + " pages detected. Choose a page range or convert the whole document.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF. It may be encrypted or damaged.");
    } finally { if (pdf) { try { await pdf.cleanup(); } catch {} } setBusy(false); }
  }

  async function convert() {
    if (!file) { setError("Choose a PDF file first."); return; }
    const first = Number(firstPage), last = Number(lastPage);
    if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last < first || last > pageCount) {
      setError("Enter a valid page range between 1 and " + pageCount + "."); return;
    }
    if (last - first + 1 > MAX_PAGES) {
      setError("Convert no more than 100 pages at a time."); return;
    }
    setBusy(true); setError(""); setStatus("Reading PDF text…");
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const documentXml: string[] = [];
      let totalCharacters = 0;
      for (let pageNo = first; pageNo <= last; pageNo++) {
        setStatus("Extracting text from page " + pageNo + " of " + last + "…");
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        const lines: TextLine[] = [];
        for (const raw of content.items as any[]) {
          if (!raw.str || !raw.str.trim()) continue;
          const x = Number(raw.transform?.[4] ?? 0);
          const y = Number(raw.transform?.[5] ?? 0);
          let line = lines.find(candidate => Math.abs(candidate.y - y) < 3);
          if (!line) { line = { y, items: [] }; lines.push(line); }
          line.items.push({ x, text: raw.str });
          totalCharacters += raw.str.length;
        }
        lines.sort((a,b)=>b.y-a.y);
        for (const line of lines) {
          line.items.sort((a,b)=>a.x-b.x);
          const text = line.items.map(item=>item.text).join(" ").replace(/\s+/g," ").trim();
          if (text) documentXml.push("<w:p><w:pPr><w:spacing w:after=\"100\"/></w:pPr><w:r><w:t xml:space=\"preserve\">"+xml(text)+"</w:t></w:r></w:p>");
        }
        if (pageNo < last) documentXml.push("<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>");
        page.cleanup();
      }
      if (totalCharacters === 0) throw new Error("No selectable text was found. This may be a scanned PDF. Use Image to Text OCR to extract text from page images.");
      const zip = new JSZip();
      zip.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
      zip.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
      zip.file("word/_rels/document.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');
      zip.file("word/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>');
      zip.file("word/document.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+documentXml.join("")+'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr></w:body></w:document>');
      const blob = await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
      const url = URL.createObjectURL(blob);
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = url;
      setDownloadUrl(url);
      setDownloadName(file.name.replace(/\.pdf$/i,"") + ".docx");
      setStatus("Editable Word document created. Review formatting and compare important details with the original PDF.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this PDF.");
    } finally {
      if (pdf) { try { await pdf.cleanup(); } catch {} }
      setBusy(false);
    }
  }

  return <main className="seo-page">
    <div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch /></div>
    <p className="kicker">FREE PDF TO WORD CONVERTER</p>
    <h1>PDF to Word Converter</h1>
    <p className="lead">Turn selectable PDF text into an editable Microsoft Word DOCX document. Choose a page range and download your converted file directly in your browser.</p>
    <details className="tool-note-details"><summary>Read before converting</summary><p>Conversion runs in your browser. Text and basic reading order are extracted; complex layouts, tables, columns, fonts and images may not be preserved exactly. Scanned PDFs need OCR first.</p></details>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>1. Choose your PDF</h2>
      <input type="file" accept=".pdf,application/pdf" disabled={busy} onChange={e=>{chooseFile(e.target.files?.[0]||null);e.currentTarget.value="";}}/>
      {file&&<p>{file.name} · {(file.size/1024/1024).toFixed(2)} MB · {pageCount} pages</p>}
      <h2>2. Select page range</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
        <label>First page<input type="number" min="1" max={pageCount||MAX_PAGES} value={firstPage} onChange={e=>setFirstPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
        <label>Last page<input type="number" min="1" max={pageCount||MAX_PAGES} value={lastPage} onChange={e=>setLastPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
      </div>
      <button className="primary" disabled={!file||busy} onClick={convert} style={{marginTop:18}}>{busy?"Converting…":"Convert PDF to Word →"}</button>
      {error&&<p className="error" role="alert">{error}</p>}
      {status&&<p className="result" role="status" aria-live="polite">{status}</p>}
      {downloadUrl&&<div className="result result-ready"><div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your Word document is ready!</b><p>{downloadName}</p></div></div><a className="result-download" href={downloadUrl} download={downloadName}>↓ Download DOCX</a></div>}
    </section>
    <section className="tool-content">
      <h2>How to convert PDF to Word</h2>
      <ol><li>Select a PDF file up to 50 MB.</li><li>Choose the first and last page, or keep the full page range.</li><li>Select Convert PDF to Word.</li><li>Download the DOCX file and open it in Microsoft Word, LibreOffice Writer or another compatible editor.</li></ol>
      <h2>What formatting is preserved?</h2>
      <p>This converter focuses on extracting selectable text into editable paragraphs. It uses text positions to approximate reading order and separates pages in the Word document. It does not promise an exact visual copy: multi-column layouts, tables, headers, footers, special fonts, charts and embedded images may be rearranged or omitted. Always proofread the DOCX against the source.</p>
      <h2>What if my PDF is scanned?</h2>
      <p>A scanned PDF contains page images rather than selectable text. This converter cannot reliably extract words from those pages. Run OCR with the <a href="/image-to-text">PicToSpec Image to Text OCR</a> tool on the relevant page images, then review the extracted text before using it in Word.</p>
      <h2>Privacy and file limits</h2>
      <p>Files are processed locally in your browser and are not sent to a PicToSpec conversion server. The PDF.js worker is loaded from a public CDN. The current limit is 50 MB and 100 pages per conversion. Encrypted, damaged or unusually complex PDFs may not work on every device.</p>
      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Is the output editable?</h3><p>Yes. The output is a DOCX file containing editable text paragraphs, but the original page design may not be reproduced exactly.</p></div>
      <div className="faq"><h3>Can it convert scanned PDFs?</h3><p>Not directly. Scanned pages need optical character recognition (OCR). Use an OCR tool and carefully check the extracted text.</p></div>
      <div className="faq"><h3>Does it preserve tables and images?</h3><p>Not reliably in this version. It is designed for selectable text and basic reading order. Check complex documents manually.</p></div>
    </section>
    <section className="guides"><a href="/pdf-to-jpg">PDF to JPG / PNG</a><a href="/pdf-organizer">Organize PDF pages</a><a href="/pdf-splitter">Split PDF</a><a href="/image-to-text">Image to Text OCR</a></section>
  </main>;
}
