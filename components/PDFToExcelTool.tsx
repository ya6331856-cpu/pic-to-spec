"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import ToolSearch from "@/components/ToolSearch";

const MAX_BYTES = 40 * 1024 * 1024;
const MAX_PAGES = 40;
const MAX_ROWS = 5000;

type CellText = { x: number; text: string };
type TextRow = { y: number; cells: CellText[] };

function escapeXml(value: string) {
  // XML 1.0 forbids most C0 control characters; strip them before writing XLSX parts.
  return value.replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/g,"")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
function columnName(index: number) {
  let n = index + 1, name = "";
  while (n > 0) { const rem = (n - 1) % 26; name = String.fromCharCode(65 + rem) + name; n = Math.floor((n - 1) / 26); }
  return name;
}
function makeCell(ref: string, value: string) {
  const trimmed = value.trim();
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(trimmed) && Number.isFinite(Number(trimmed))) {
    return '<c r="' + ref + '"><v>' + Number(trimmed) + '</v></c>';
  }
  return '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + escapeXml(value) + '</t></is></c>';
}

export default function PDFToExcelTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [firstPage, setFirstPage] = useState("1");
  const [lastPage, setLastPage] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [download, setDownload] = useState<{url:string;name:string}|null>(null);
  const downloadUrlRef = useRef("");

  useEffect(() => () => { if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current); }, []);

  async function chooseFile(next: File | null) {
    setFile(null); setPageCount(0); setError(""); setStatus(""); setDownload(null);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = "";
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) { setError("Please select a PDF file."); return; }
    if (next.size > MAX_BYTES) { setError("Choose a PDF smaller than 40 MB."); return; }
    setBusy(true);
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({data:await next.arrayBuffer()}).promise;
      if (pdf.numPages < 1) throw new Error("This PDF does not contain any pages.");
      if (pdf.numPages > 200) throw new Error("This tool supports PDFs up to 200 pages. Convert a smaller document.");
      setFile(next); setPageCount(pdf.numPages); setLastPage(String(Math.min(pdf.numPages, MAX_PAGES)));
      setStatus(pdf.numPages + " pages detected. Select up to " + MAX_PAGES + " pages for spreadsheet extraction.");
    } catch(e) { setError(e instanceof Error ? e.message : "Could not read this PDF. It may be damaged or encrypted."); }
    finally { if (pdf) { try { await pdf.cleanup(); } catch {} } setBusy(false); }
  }

  async function convert() {
    if (!file) { setError("Choose a PDF file first."); return; }
    const first = Number(firstPage), last = Number(lastPage);
    if (!Number.isInteger(first)||!Number.isInteger(last)||first<1||last<first||last>pageCount) { setError("Enter a valid page range between 1 and "+pageCount+"."); return; }
    if (last-first+1>MAX_PAGES) { setError("Convert up to "+MAX_PAGES+" pages per spreadsheet."); return; }
    setBusy(true); setError(""); setStatus("Preparing spreadsheet…"); setDownload(null);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    downloadUrlRef.current = "";
    let pdf: any = null;
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
      pdf = await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;
      const allRows: string[][] = [];
      let totalText = 0;
      for(let pageNo=first;pageNo<=last;pageNo++){
        setStatus("Reading table-like text on page "+pageNo+" of "+last+"…");
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        const rows: TextRow[] = [];
        for(const item of content.items as any[]){
          const value = typeof item.str === "string" ? item.str.trim() : "";
          if(!value) continue;
          const x = Number(item.transform?.[4] ?? 0);
          const y = Number(item.transform?.[5] ?? 0);
          let row = rows.find(candidate=>Math.abs(candidate.y-y)<3);
          if(!row){row={y,cells:[]};rows.push(row);}
          row.cells.push({x,text:value});
          totalText += value.length;
        }
        rows.sort((a,b)=>b.y-a.y);
        const pageRows: string[][] = [];
        for(const row of rows){
          row.cells.sort((a,b)=>a.x-b.x);
          const grouped: {x:number;text:string}[] = [];
          for(const cell of row.cells){
            const previous=grouped[grouped.length-1];
            if(previous && Math.abs(previous.x-cell.x)<10) previous.text += " "+cell.text;
            else grouped.push({x:cell.x,text:cell.text});
          }
          const values=grouped.map(cell=>cell.text.replace(/\s+/g," ").trim());
          if(values.some(Boolean)) pageRows.push(values);
        }
        const maxColumns=Math.max(0,...pageRows.map(row=>row.length));
        if(maxColumns>0){
          if(allRows.length) allRows.push([]);
          allRows.push(["PDF page "+pageNo]);
          for(const row of pageRows) allRows.push(row);
        }
        page.cleanup();
        if(allRows.length>MAX_ROWS) throw new Error("This selection contains too many extracted rows. Try fewer pages.");
      }
      if(totalText===0||allRows.length===0) throw new Error("No selectable text was found. This may be a scanned PDF; use OCR first, then copy the recognized text into a spreadsheet.");
      const maxCols=Math.max(1,...allRows.map(row=>row.length));
      if(maxCols>100) throw new Error("This PDF appears to contain more than 100 columns. Try selecting fewer pages.");
      const sheetRows=allRows.map((row,index)=>{
        const cells=row.map((value,col)=>makeCell(columnName(col)+(index+1),value)).join("");
        return '<row r="'+(index+1)+'">'+cells+'</row>';
      }).join("");
      const zip=new JSZip();
      zip.file("[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
      zip.file("_rels/.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
      zip.file("xl/workbook.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Extracted data" sheetId="1" r:id="rId1"/></sheets></workbook>');
      zip.file("xl/_rels/workbook.xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
      zip.file("xl/worksheets/sheet1.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+sheetRows+'</sheetData></worksheet>');
      const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      const url=URL.createObjectURL(blob); downloadUrlRef.current=url;
      const base=file.name.replace(/\.pdf$/i,"").replace(/[^a-z0-9_-]+/gi,"-").slice(0,60)||"document";
      setDownload({url,name:base+"-extracted.xlsx"});
      setStatus("Spreadsheet created with "+allRows.length+" rows and up to "+maxCols+" columns. Review and adjust the table structure in Excel.");
    }catch(e){setError(e instanceof Error?e.message:"Could not convert this PDF. Try another document.");}
    finally{if(pdf) { try { await pdf.cleanup(); } catch {} } setBusy(false);}
  }

  return <main className="seo-page">
    <div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch /></div>
    <p className="kicker">FREE PDF TO EXCEL CONVERTER</p>
    <h1>PDF to Excel Converter</h1>
    <p className="lead">Extract selectable text and table-like rows from PDF pages into an editable Excel spreadsheet. Choose a page range and download an XLSX file.</p>
    <details className="tool-note-details"><summary>Read before converting</summary><p>This tool extracts text and approximate table rows; it is not an advanced table-recognition engine. Column alignment can vary in complex PDFs. Files are processed in your browser; the PDF.js worker loads from a public CDN.</p></details>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>1. Upload your PDF</h2>
      <input type="file" accept=".pdf,application/pdf" disabled={busy} onChange={e=>{chooseFile(e.target.files?.[0]||null);e.currentTarget.value="";}}/>
      {file&&<p>{file.name} · {(file.size/1024/1024).toFixed(2)} MB · {pageCount} pages</p>}
      <h2>2. Select page range</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
        <label>First page<input type="number" min="1" max={pageCount||200} value={firstPage} onChange={e=>setFirstPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
        <label>Last page<input type="number" min="1" max={pageCount||200} value={lastPage} onChange={e=>setLastPage(e.target.value)} style={{display:"block",width:"100%",padding:12,marginTop:6}}/></label>
      </div>
      <button className="primary" disabled={!file||busy} onClick={convert} style={{marginTop:18}}>{busy?"Extracting…":"Convert PDF to Excel →"}</button>
      {error&&<p className="error" role="alert">{error}</p>}
      {status&&<p className="result" role="status" aria-live="polite">{status}</p>}
      {download&&<div className="result result-ready"><div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your Excel file is ready!</b><p>{download.name}</p></div></div><a className="result-download" href={download.url} download={download.name}>↓ Download XLSX</a></div>}
    </section>
    <section className="tool-content">
      <h2>How to convert PDF to Excel</h2>
      <ol><li>Select a PDF up to 40 MB.</li><li>Choose the first and last pages to extract.</li><li>Select Convert PDF to Excel.</li><li>Download the XLSX workbook and open it in Microsoft Excel, Google Sheets or LibreOffice Calc.</li><li>Check column alignment and correct any rows that need adjustment.</li></ol>
      <h2>Does it preserve PDF tables?</h2>
      <p>The converter uses text positions to group words into rows and approximate columns. It works best with simple, digitally generated PDFs where table cells have consistent alignment. It may not reconstruct merged cells, complex borders, multi-column layouts or irregular tables exactly.</p>
      <h2>Can I convert a scanned bank statement?</h2>
      <p>Scanned PDFs contain images rather than selectable text, so this tool cannot read them directly. OCR is needed first. You can try the <a href="/image-to-text">PicToSpec Image to Text OCR</a> tool, then review the recognized text carefully before using it in a spreadsheet.</p>
      <h2>Privacy and limits</h2>
      <p>PDF content is processed in your browser and is not uploaded to a PicToSpec conversion server. The file limit is 40 MB, the document limit is 200 pages, and each conversion can extract up to 40 pages and 5,000 rows. Encrypted or damaged PDFs may fail. Review financial or business figures against the original document before relying on them.</p>
      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Will formulas be created automatically?</h3><p>No. This tool extracts visible text and numbers; it does not infer spreadsheet formulas or validate totals.</p></div>
      <div className="faq"><h3>Can I edit the downloaded spreadsheet?</h3><p>Yes. The XLSX output contains editable cells. You can sort, format and adjust the extracted values in spreadsheet software.</p></div>
      <div className="faq"><h3>Why are some columns misplaced?</h3><p>PDFs are designed for fixed-page display, not necessarily structured data. Different fonts, spacing and merged cells can make automatic column detection imperfect.</p></div>
    </section>
    <section className="guides"><a href="/pdf-to-word">PDF to Word</a><a href="/pdf-to-jpg">PDF to JPG / PNG</a><a href="/image-to-text">Image to Text OCR</a><a href="/csv-json-converter">CSV to JSON</a></section>
  </main>;
}
