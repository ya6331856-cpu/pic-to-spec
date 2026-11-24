"use client";

import { useState } from "react";
import JSZip from "jszip";
import ToolSearch from "@/components/ToolSearch";

type Requirement = { kind: "photo" | "signature"; label: string; maxKB: number; width: number; height: number; format: "image/jpeg" | "image/png" };
type Prepared = { name: string; blob: Blob; size: number; width: number; height: number };

const defaults: Requirement[] = [
  { kind: "photo", label: "Photo", maxKB: 50, width: 200, height: 230, format: "image/jpeg" },
  { kind: "signature", label: "Signature", maxKB: 20, width: 140, height: 60, format: "image/jpeg" }
];

function extractRequirements(text: string): Requirement[] {
  const lower = text.toLowerCase();
  const output = defaults.map(item => ({ ...item }));
  const sizeMatches = Array.from(lower.matchAll(/(photo|photograph|passport|signature|sign)\D{0,50}(\d{1,4})\s*(kb|k\s*b)/g));
  for (const match of sizeMatches) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind)!;
    const value = Number(match[2]);
    if (value >= 5 && value <= 5000) target.maxKB = value;
  }
  const dimensionMatches = Array.from(lower.matchAll(/(photo|photograph|passport|signature|sign)\D{0,40}(\d{2,4})\s*[x×*]\s*(\d{2,4})\s*(px|pixels?)\b/g));
  for (const match of dimensionMatches) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind)!;
    const width = Number(match[2]), height = Number(match[3]);
    if (width >= 20 && width <= 3000 && height >= 20 && height <= 3000) {
      target.width = width; target.height = height;
    }
  }
  const formatMatches = Array.from(lower.matchAll(/(photo|photograph|passport|signature|sign)\D{0,50}(png only|png format|jpg only|jpeg only|jpg format|jpeg format)/g));
  for (const match of formatMatches) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind)!;
    target.format = /png/.test(match[2]) ? "image/png" : "image/jpeg";
  }
  return output;
}

function canvasBlob(file: File, req: Requirement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = async () => {
      try {
        if (image.naturalWidth * image.naturalHeight > 40000000) throw new Error(file.name + " is larger than the safe 40-megapixel limit.");
        const canvas = document.createElement("canvas");
        canvas.width = req.width; canvas.height = req.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser cannot process this image.");
        if (req.format === "image/jpeg") { context.fillStyle = "#fff"; context.fillRect(0, 0, req.width, req.height); }
        const scale = Math.max(req.width / image.naturalWidth, req.height / image.naturalHeight);
        const sw = req.width / scale, sh = req.height / scale;
        const sx = (image.naturalWidth - sw) / 2, sy = (image.naturalHeight - sh) / 2;
        context.drawImage(image, sx, sy, sw, sh, 0, 0, req.width, req.height);
        let blob: Blob | null = null;
        if (req.format === "image/png") {
          // PNG is lossless; the canvas quality argument is ignored by browsers.
          blob = await new Promise<Blob | null>(done => canvas.toBlob(done, req.format));
        } else {
          let quality = 0.92;
          for (let i = 0; i < 12; i++) {
            blob = await new Promise<Blob | null>(done => canvas.toBlob(done, req.format, quality));
            if (blob && blob.size <= req.maxKB * 1024) break;
            quality *= 0.82;
          }
        }
        if (!blob || blob.size > req.maxKB * 1024) throw new Error("Could not reach " + req.maxKB + " KB for " + req.label + ". Try a larger limit or smaller dimensions.");
        resolve(blob);
      } catch (error) { reject(error); }
      finally {
        URL.revokeObjectURL(url);
      }
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not open " + file.name + ".")); };
    image.src = url;
  });
}

export default function FormRuleTool() {
  const [source, setSource] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>(defaults);
  const [photo, setPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [extracted, setExtracted] = useState("");

  async function readSource() {
    if (!source) { setError("Upload a PDF, image or screenshot first."); return; }
    const isPdf = source.type === "application/pdf" || source.name.toLowerCase().endsWith(".pdf");
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(source.type);
    if (!isPdf && !isImage) { setError("Choose a PDF, JPG, PNG or WebP file."); return; }
    if (source.size > 30 * 1024 * 1024) { setError("Choose a source document smaller than 30 MB."); return; }
    setBusy(true); setError(""); setStatus("");
    let pdf: any = null;
    try {
      let text = "";
      if (source.type === "application/pdf" || source.name.toLowerCase().endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjs.version + "/pdf.worker.min.mjs";
        pdf = await pdfjs.getDocument({ data: await source.arrayBuffer() }).promise;
        const pages = Math.min(pdf.numPages, 15);
        for (let i = 1; i <= pages; i++) {
          const page = await pdf.getPage(i);
          try {
            const content = await page.getTextContent();
            text += content.items.map((item: any) => "str" in item ? item.str : "").join(" ") + "\n";
          } finally {
            page.cleanup();
          }
        }
        if (!text.trim()) throw new Error("This PDF has no selectable text. Upload a clear screenshot instead for OCR.");
      } else if (source.type.startsWith("image/")) {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker("eng");
        try { const result = await worker.recognize(source); text = result.data.text; }
        finally { await worker.terminate(); }
      } else throw new Error("Choose a PDF or image file.");
      if (!text.trim()) throw new Error("No readable text was found. Try a clearer PDF or image.");
      setExtracted(text.slice(0, 12000));
      setRequirements(extractRequirements(text));
      setStatus("Text extracted. Review and correct every requirement before preparing files.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not read this document."); }
    finally { if (pdf) { try { await pdf.cleanup(); } catch {} } setBusy(false); }
  }

  async function makePack() {
    setError(""); setStatus("");
    for (const req of requirements) {
      if (!Number.isInteger(req.maxKB) || req.maxKB < 5 || req.maxKB > 5000 ||
          !Number.isInteger(req.width) || req.width < 20 || req.width > 3000 ||
          !Number.isInteger(req.height) || req.height < 20 || req.height > 3000) {
        setError("Check each requirement: file size must be 5–5000 KB and dimensions must be 20–3000 pixels.");
        return;
      }
    }
    for (const selected of [photo, signature]) {
      if (selected && (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 20 * 1024 * 1024)) {
        setError("Photo and signature files must be JPG, PNG or WebP and smaller than 20 MB each.");
        return;
      }
    }
    if (!photo && !signature) {
      setError("Upload at least a photo or signature.");
      return;
    }
    setBusy(true);
    try {
      const zip = new JSZip();
      const prepared: Prepared[] = [];
      for (const req of requirements) {
        const file = req.kind === "photo" ? photo : signature;
        if (!file) continue;
        const blob = await canvasBlob(file, req);
        const ext = req.format === "image/png" ? "png" : "jpg";
        const name = req.kind + "-ready." + ext;
        zip.file(name, blob);
        prepared.push({ name, blob, size: blob.size, width: req.width, height: req.height });
      }
      if (!prepared.length) throw new Error("Upload at least a photo or signature.");
      zip.file("requirements-check.txt", "PicToSpec FormRule\n\nReview the receiving website's latest instructions before submission.\n\n" + prepared.map(item => item.name + ": " + item.width + "x" + item.height + " px, " + (item.size / 1024).toFixed(1) + " KB").join("\n"));
      const archive = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(archive); const link = document.createElement("a");
      link.href = url; link.download = "pictospec-form-upload-pack.zip"; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("Your ZIP pack is ready. Check each file and the form's latest rules before submitting.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not prepare the upload pack."); }
    finally { setBusy(false); }
  }

  function update(index: number, key: keyof Requirement, value: string) {
    setRequirements(current => current.map((item, i) => i === index ? { ...item, [key]: key === "format" ? value : Number(value) } : item));
  }

  return <main className="seo-page">
    <div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch /></div>
    <p className="kicker">DOCUMENT REQUIREMENT ASSISTANT</p>
    <h1>FormRule AI – Prepare Photo & Signature Files</h1>
    <p className="lead">Extract visible upload rules from a PDF or screenshot, review the suggested requirements, and prepare a ZIP pack of correctly sized photo and signature files in your browser.</p>
    <p className="note">This is an assisted rule reader, not an official form validator. Extraction can miss or misread instructions. Always confirm the values below against the original notice and the receiving portal.</p>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>Step 1 · Upload the form instructions</h2>
      <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const next=e.target.files?.[0]||null;e.currentTarget.value="";setSource(next);setExtracted("");setRequirements(defaults);setStatus("");setError("");}}/>
      {source&&<p>{source.name}</p>}
      <button className="primary" disabled={busy} onClick={readSource}>{busy?"Reading…":"Read requirements"}</button>
      {extracted&&<details style={{marginTop:14}}><summary>View extracted text</summary><pre style={{whiteSpace:"pre-wrap",fontSize:12}}>{extracted}</pre></details>}
      <h2>Step 2 · Confirm requirements</h2>
      {requirements.map((req,index)=><div key={req.kind} style={{borderTop:"1px solid #e5ece7",padding:"14px 0"}}>
        <h3>{req.label}</h3>
        <div className="quick-grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
          <label>Maximum KB<input type="number" min="5" max="5000" value={req.maxKB} onChange={e=>update(index,"maxKB",e.target.value)}/></label>
          <label>Width (px)<input type="number" min="20" max="3000" value={req.width} onChange={e=>update(index,"width",e.target.value)}/></label>
          <label>Height (px)<input type="number" min="20" max="3000" value={req.height} onChange={e=>update(index,"height",e.target.value)}/></label>
          <label>Format<select value={req.format} onChange={e=>update(index,"format",e.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
        </div>
      </div>)}
      <h2>Step 3 · Upload your files</h2>
      <label>Photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{setPhoto(e.target.files?.[0]||null);e.currentTarget.value="";}}/></label>
      <label style={{display:"block",marginTop:12}}>Signature<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{setSignature(e.target.files?.[0]||null);e.currentTarget.value="";}}/></label>
      <button className="primary download-action" disabled={busy} onClick={makePack} style={{marginTop:18}}>{busy?"Preparing…":"↓ Prepare ZIP upload pack"}</button>
      {error&&<p role="alert" className="error">{error}</p>}
      {status&&<p role="status" className="result">{status}</p>}
    </section>
    <h2>How FormRule works</h2>
    <ol><li>Upload a selectable-text PDF or a clear image/screenshot.</li><li>Review the extracted size, dimension and format suggestions; correct them if needed.</li><li>Upload your photo and signature and prepare the ZIP pack.</li><li>Open the files and verify them on the destination form before submitting.</li></ol>
    <h2>Privacy and limitations</h2>
    <p>PDF text extraction, image OCR and file preparation run in your browser. OCR may require downloading language and worker files from the OCR provider. The tool does not submit files to a government portal or guarantee acceptance. The current reader recognises common photo/signature KB and pixel patterns; unusual instructions, background rules and document-specific conditions need manual review.</p>
    <h2>Frequently asked questions</h2>
    <div className="faq"><h3>Does FormRule guarantee my application will be accepted?</h3><p>No. Only the receiving organisation can decide whether a file meets all its rules. Review the official instructions before uploading.</p></div>
    <div className="faq"><h3>Can it read scanned PDFs?</h3><p>For now, use a clear screenshot or image for scanned pages. Selectable-text PDFs are read directly.</p></div>
    <div className="faq"><h3>Does it upload my files to PicToSpec?</h3><p>File preparation happens in your browser. OCR may download its processing engine and language data, but the uploaded image itself is processed locally by the browser worker.</p></div>
  </main>;
}
