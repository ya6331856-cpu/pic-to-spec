"use client";

import { useEffect, useRef, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Tool = "compress" | "resize" | "convert" | "crop";
type Format = "image/jpeg" | "image/png" | "image/webp";

const presets = [
  { name: "Passport photo", w: 600, h: 600 },
  { name: "Profile photo", w: 500, h: 500 },
  { name: "Signature", w: 400, h: 150 },
  { name: "Form photo", w: 600, h: 400 }
];

function bytes(n: number) {
  return n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB";
}

export default function Home() {
  const picker = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef("");
  const resultUrlRef = useRef("");
  const imageProbeIdRef = useRef(0);
  const processingIdRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [tool, setTool] = useState<Tool>("compress");
  const [target, setTarget] = useState("100");
  const [width, setWidth] = useState("600");
  const [height, setHeight] = useState("600");
  const [ratio, setRatio] = useState(true);
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("400");
  const [cropH, setCropH] = useState("400");
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number; w: number; h: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!result) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }));
  }, [result]);

  useEffect(() => { const selected = new URLSearchParams(window.location.search).get("tool"); if (selected === "compress" || selected === "resize" || selected === "convert" || selected === "crop") { setTool(selected); setTimeout(() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }), 100); } }, []);
  useEffect(() => () => {
    imageProbeIdRef.current += 1;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);

  function selectFile(f?: File) {
    if (!f) return;
    const imageProbeId = ++imageProbeIdRef.current;
    processingIdRef.current += 1;
    setBusy(false);
    setError("");
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    previewUrlRef.current = ""; resultUrlRef.current = "";
    setResult(null); setFile(null); setPreview("");
    if (!["image/jpeg","image/png","image/webp"].includes(f.type)) { setError("Please choose a JPG, PNG or WebP image."); return; }
    if (f.size > 20 * 1024 * 1024) { setError("Please choose an image smaller than 20 MB."); return; }
    const previewUrl = URL.createObjectURL(f); previewUrlRef.current = previewUrl;
    setFile(f); setPreview(previewUrl);
    const probe = new Image(); const probeUrl = URL.createObjectURL(f); probe.onload = () => { if (imageProbeId === imageProbeIdRef.current) { setCropW(String(probe.naturalWidth)); setCropH(String(probe.naturalHeight)); setCropX("0"); setCropY("0"); } URL.revokeObjectURL(probeUrl); }; probe.onerror = () => URL.revokeObjectURL(probeUrl); probe.src = probeUrl;
  }

  async function run() {
    if (!file) { setError("Choose an image first."); return; }
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = ""; setResult(null);
    if (tool === "compress") { const kb=Number(target); if (!Number.isInteger(kb)||kb<5||kb>5000) { setError("Enter a target size between 5 KB and 5000 KB."); return; } }
    if (tool === "resize") { const w=Number(width),h=Number(height); if (!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>6000||h>6000) { setError("Enter whole-number dimensions between 1 and 6000 pixels."); return; } }
    if (tool === "crop") { const values=[cropX,cropY,cropW,cropH].map(Number); if (!values.every(Number.isInteger)||values[0]<0||values[1]<0||values[2]<1||values[3]<1) { setError("Crop values must be whole pixels. Left and Top can be 0 or more; Width and Height must be at least 1."); return; } }
    const processingId = ++processingIdRef.current;
    const selectedFile = file;
    setBusy(true); setError("");
    try {
      const img = new Image();
      const source = URL.createObjectURL(selectedFile);
      try { await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error("Image could not be opened.")); img.src = source; }); } finally { URL.revokeObjectURL(source); }
      if (processingId !== processingIdRef.current) return;
      if (!Number.isFinite(img.naturalWidth * img.naturalHeight) || img.naturalWidth * img.naturalHeight > 40000000) throw new Error("This source image exceeds 40 megapixels and may use too much browser memory. Choose a smaller image.");
      let w = img.naturalWidth, h = img.naturalHeight;
      const sx = Number(cropX), sy = Number(cropY);
      if (tool === "crop") { const cw=Number(cropW),ch=Number(cropH); if(sx>=img.naturalWidth||sy>=img.naturalHeight||cw>img.naturalWidth-sx||ch>img.naturalHeight-sy) throw new Error(`Crop area is outside the image. Image size: ${img.naturalWidth} × ${img.naturalHeight} px.`); w=cw; h=ch; }
      if (tool === "resize") {
        w = Number(width);
        h = Number(height);
        if (ratio) { const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight); w = Math.round(img.naturalWidth * scale); h = Math.round(img.naturalHeight * scale); }
      }
      if (w * h > 40000000) throw new Error("This image is too large to process safely. Resize it first or choose a smaller image.");
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Your browser does not support image processing.");
      if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; if (tool === "crop") ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h); else ctx.drawImage(img, 0, 0, w, h);
      const toBlob = (q: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not create image.")), format, q));
      let blob: Blob;
      if (tool === "compress" && format !== "image/png") {
        const limit = Number(target) * 1024;
        let lo = 0.05, hi = 0.96;
        let best: Blob | null = null;
        const highestQuality = await toBlob(hi);
        if (processingId !== processingIdRef.current) return;
        if (highestQuality.size <= limit) best = highestQuality;
        for (let i = 0; i < 18; i++) {
          const mid = (lo + hi) / 2;
          const candidate = await toBlob(mid);
          if (processingId !== processingIdRef.current) return;
          if (candidate.size <= limit) { best = candidate; lo = mid; }
          else { hi = mid; }
        }
        if (!best) throw new Error("Target size could not be reached. Try smaller dimensions or a larger KB target.");
        blob = best;
      } else {
        blob = await toBlob(0.92);
        if (processingId !== processingIdRef.current) return;
        if (tool === "compress" && blob.size > Number(target) * 1024) throw new Error("This PNG is larger than your target. PNG size reduction is limited in browsers; try JPG or WebP for a smaller file.");
      }
      if (processingId !== processingIdRef.current) return;
      const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";
      const resultUrl=URL.createObjectURL(blob); resultUrlRef.current=resultUrl;
      if (processingId !== processingIdRef.current) { URL.revokeObjectURL(resultUrl); return; }
      setResult({ url: resultUrl, name: base + "-pictospec." + ext, size: blob.size, w, h });
    } catch (e) { if (processingId === processingIdRef.current) setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { if (processingId === processingIdRef.current) setBusy(false); }
  }

  return <main>
    <header className="topbar"><a className="brand" href="/"><span className="mark">P</span>PicToSpec</a><nav id="primary-navigation" className={mobileMenuOpen ? "is-open" : ""}><a href="/image-compressor" onClick={() => setMobileMenuOpen(false)}>Compressor</a><a href="/image-resizer" onClick={() => setMobileMenuOpen(false)}>Resizer</a><a href="/image-cropper" onClick={() => setMobileMenuOpen(false)}>Cropper</a><a href="/image-converter" onClick={() => setMobileMenuOpen(false)}>Converter</a></nav><a className="privacy-link" href="/privacy">Privacy</a><button className="mobile-nav-toggle" type="button" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} aria-controls="primary-navigation" onClick={() => setMobileMenuOpen(open => !open)}><span></span><span></span><span></span></button></header>
    <section className="hero"><div className="hero-main"><div className="hero-copy"><div className="eyebrow">FREE ONLINE TOOLS · PRIVATE BY DESIGN</div><h1>Get everyday tasks<br/><em>done in seconds.</em></h1><p>Simple, fast tools for images, PDFs, text and calculations. No account needed.</p><ToolSearch /><div className="hero-proof"><span>✓ Free to use</span><span>✓ Works in your browser</span><span>✓ No sign-up</span></div></div><div className="hero-mascot" aria-label="Pixo, the PicToSpec mascot"><div className="hero-mascot-glow"></div><img src="/pixo.svg" alt="Pixo the friendly PicToSpec chameleon mascot" width="240" height="240" fetchPriority="low" /><div className="hero-mascot-note"><strong>Hi, I’m Pixo!</strong><span>Let’s make your work easier.</span></div></div></div></section>
    <section className="quick-start" aria-label="Image tools">
      <div className="quick-grid">
        <a href="/background-remover" className="tool-card"><span>✦</span><b>Background Remover</b><small>Make photo backgrounds transparent</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-compressor" className="tool-card"><span>↘</span><b>Image Compressor</b><small>Reduce image file size</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-resizer" className="tool-card"><span>▣</span><b>Image Resizer</b><small>Change width and height</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-cropper" className="tool-card"><span>⌗</span><b>Image Cropper</b><small>Cut unwanted image edges</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-converter" className="tool-card"><span>⇄</span><b>Image Converter</b><small>Convert JPG, PNG and WebP</small><strong>OPEN TOOL →</strong></a>
      </div>
    </section>
    <section className="tool-directory" id="tool-directory" aria-label="All free online tools">
      <div className="directory-heading"><div><span className="eyebrow">THE TOOLBOX</span><h2>Find the right tool for the job</h2><p>Choose a category or open any tool directly.</p></div></div>
      <div className="directory-category"><h3>Image tools</h3><div className="quick-grid">
        <a className="tool-card" href="/image-compressor"><b>Image Compressor</b><small>Reduce image file size</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/image-resizer"><b>Image Resizer</b><small>Set exact image dimensions</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/image-cropper"><b>Image Cropper</b><small>Crop images by pixel size</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/image-converter"><b>Image Converter</b><small>Convert JPG, PNG and WebP</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/compress-image-to-50kb"><b>Compress to 50KB</b><small>Meet online form file limits</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/resize-photo-for-online-form"><b>Online Form Photo</b><small>Prepare application photos</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/signature-resizer"><b>Signature Resizer</b><small>Resize signature images</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/jpg-to-webp"><b>JPG to WebP</b><small>Convert images to WebP</small><strong>OPEN TOOL →</strong></a>
      </div></div>
      <div className="directory-category"><h3>PDF tools</h3><div className="quick-grid">
        <a className="tool-card" href="/pdf-merger"><b>Merge PDF</b><small>Combine PDF documents</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/pdf-splitter"><b>Split PDF</b><small>Extract selected pages</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/jpg-to-pdf"><b>JPG to PDF</b><small>Convert images into PDF</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/pdf-to-jpg"><b>PDF to JPG / PNG</b><small>Convert PDF pages into images</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/pdf-to-word"><b>PDF to Word</b><small>Convert selectable PDF text to DOCX</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/pdf-to-excel"><b>PDF to Excel</b><small>Extract table-like data to XLSX</small><strong>OPEN TOOL →</strong></a>
      </div></div>
      <div className="directory-category"><h3>Calculators</h3><div className="quick-grid">
        <a className="tool-card" href="/gst-calculator"><b>GST Calculator</b><small>Calculate tax and total price</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/emi-calculator"><b>EMI Calculator</b><small>Estimate monthly loan EMI</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/percentage-calculator"><b>Percentage Calculator</b><small>Calculate percentages</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/discount-calculator"><b>Discount Calculator</b><small>Find sale price and savings</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/age-calculator"><b>Age Calculator</b><small>Calculate age from birth date</small><strong>OPEN TOOL →</strong></a>
      </div></div>
      <div className="directory-category"><h3>Text and developer tools</h3><div className="quick-grid">
        <a className="tool-card" href="/word-counter"><b>Word Counter</b><small>Count words and characters</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/text-compare"><b>Text Compare</b><small>Find added and removed lines</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/html-entity-encoder-decoder"><b>HTML Entity Encoder / Decoder</b><small>Encode or decode special HTML characters</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/unix-timestamp-converter"><b>Unix Timestamp Converter</b><small>Convert timestamps to readable UTC dates</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/url-slug-generator"><b>URL Slug Generator</b><small>Create clean SEO-friendly URL slugs</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/lorem-ipsum-generator"><b>Lorem Ipsum Generator</b><small>Generate placeholder text for layouts</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/text-line-sorter"><b>Text Line Sorter</b><small>Sort lines alphabetically or numerically</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/duplicate-line-remover"><b>Duplicate Line Remover</b><small>Remove repeated lines from text</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/text-line-reverser"><b>Text Line Reverser</b><small>Reverse the order of text lines</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/case-converter"><b>Case Converter</b><small>Change text letter case</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/json-formatter"><b>JSON Formatter</b><small>Format and validate JSON</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/base64-encoder-decoder"><b>Base64 Encoder / Decoder</b><small>Encode or decode text</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/url-encoder-decoder"><b>URL Encoder / Decoder</b><small>Encode and decode URL characters</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/csv-json-converter"><b>CSV to JSON Converter</b><small>Convert CSV and JSON data</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/csv-cleaner"><b>CSV Cleaner</b><small>Remove duplicate rows and extra spaces</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/color-converter"><b>Color Converter</b><small>Convert HEX, RGB and HSL values</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/url-parser"><b>URL Parser</b><small>Inspect URL parts and query strings</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/json-to-xml-converter"><b>JSON to XML Converter</b><small>Convert JSON data into XML</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/xml-formatter"><b>XML Formatter</b><small>Validate and indent XML markup</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/css-formatter"><b>CSS Formatter</b><small>Beautify CSS declarations</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/html-formatter"><b>HTML Formatter</b><small>Format HTML with readable indentation</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/regex-tester"><b>Regex Tester</b><small>Test patterns and inspect matches</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/css-gradient-generator"><b>CSS Gradient Generator</b><small>Create custom CSS color gradients</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/uuid-generator"><b>UUID Generator</b><small>Create random unique identifiers</small><strong>OPEN TOOL →</strong></a>
      </div></div>
      <div className="directory-category"><h3>SEO tools</h3><div className="quick-grid">\n        <a className="tool-card" href="/meta-tag-generator"><b>Meta Tag Generator</b><small>Create SEO and social preview tags</small><strong>OPEN TOOL →</strong></a>\n        <a className="tool-card" href="/robots-txt-generator"><b>Robots.txt Generator</b><small>Create crawler access rules</small><strong>OPEN TOOL →</strong></a>\n      </div></div>\n      <div className="directory-category"><h3>Generators</h3><div className="quick-grid">
        <a className="tool-card" href="/password-generator"><b>Password Generator</b><small>Create random strong passwords</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/qr-code-generator"><b>QR Code Generator</b><small>Create QR codes for text and links</small><strong>OPEN TOOL →</strong></a>
      </div></div>
      <div className="directory-category"><h3>New document & application tools</h3><div className="quick-grid">
        <a className="tool-card" href="/formrule-ai"><b>FormRule AI</b><small>Read photo and signature upload rules</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/passport-photo-maker"><b>Passport Photo Maker</b><small>Create a multi-copy photo print sheet</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/image-to-text"><b>Image to Text OCR</b><small>Extract English text from images</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/pdf-organizer"><b>PDF Page Organizer</b><small>Reorder, remove and rotate pages</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/ats-resume-checker"><b>ATS Resume Checker</b><small>Review resume structure and keywords</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/gst-invoice-generator"><b>GST Invoice Generator</b><small>Create a simple invoice PDF</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/unit-converter"><b>Unit Converter</b><small>Convert everyday measurements</small><strong>OPEN TOOL →</strong></a>
        <a className="tool-card" href="/hinglish-to-hindi"><b>Hinglish to Hindi</b><small>Type Hindi using English letters</small><strong>OPEN TOOL →</strong></a>
      </div></div>
    </section>
    <section className="tool-content" style={{maxWidth:1100,margin:"28px auto",padding:"28px 22px"}}><h2>Free online tools for everyday work</h2><p>PicToSpec brings practical image, PDF, text, developer and calculator tools together in one place. Open a tool, follow its instructions and download or copy the result. Most processing happens directly in your browser, so you can work without creating an account or sending files to a PicToSpec processing server.</p><h3>Prepare images for websites and online forms</h3><p>Remove photo backgrounds with the <a href="/background-remover">AI Background Remover</a>, reduce image file size, resize photos to pixel dimensions, crop an image or convert between JPG, PNG and WebP. If an application gives a strict upload limit, read its file-size, dimension and format rules before preparing your image. Try the <a href="/image-compressor">image compressor</a>, <a href="/image-resizer">image resizer</a>, <a href="/passport-photo-maker">Passport Photo Maker</a>, or our guide to <a href="/compress-image-to-50kb">compressing an image to 50KB</a>.</p><h3>Manage PDF files and documents</h3><p>Combine multiple PDF files, extract a page range into a new PDF, or create an A4 PDF from images. Check page order and the final document before sharing it. Start with <a href="/pdf-merger">Merge PDF</a>, <a href="/pdf-splitter">Split PDF</a>, <a href="/pdf-organizer">PDF Page Organizer</a> or <a href="/jpg-to-pdf">JPG to PDF</a>.</p><h3>Prepare application photos and documents</h3><p>Use <a href="/formrule-ai">FormRule AI</a> to read common photo and signature upload requirements from a notice, then review the suggested settings and prepare a ZIP pack. Create multiple print copies with the <a href="/passport-photo-maker">Passport Photo Maker</a>, or extract text from a screenshot using <a href="/image-to-text">Image to Text OCR</a>. Always confirm the destination portal's latest rules.</p><h3>Convert and organize PDF pages</h3><p>Extract table-like data into a spreadsheet with the <a href="/pdf-to-excel">PDF to Excel Converter</a>, convert selectable PDF text into an editable document with the <a href="/pdf-to-word">PDF to Word Converter</a>, or turn PDF pages into JPG or PNG images with the <a href="/pdf-to-jpg">PDF to JPG / PNG Converter</a>, then reorder or rotate pages with the <a href="/pdf-organizer">PDF Page Organizer</a>. You can also merge documents with <a href="/pdf-merger">Merge PDF</a> or extract selected pages with <a href="/pdf-splitter">Split PDF</a>.</p><h3>Prepare work documents</h3><p>Review a resume using the <a href="/ats-resume-checker">ATS Resume Checker</a>, or create a basic invoice PDF with the <a href="/gst-invoice-generator">GST Invoice Generator</a>. These tools provide practical drafts and checks, not official approval or legal advice.</p><h3>Type Hindi with English letters</h3><p>Use the <a href="/hinglish-to-hindi">Hinglish to Hindi converter</a> to turn Romanized Hindi into Devanagari text. Review names and uncommon words before sharing.</p><h3>Work with text, data and quick calculations</h3><p>Count words and characters, compare text revisions, format JSON, clean CSV data, convert CSV data, encode URL text or generate UUIDs. You can also estimate GST, loan EMI, percentages, discounts and age with dedicated calculators. Results are intended as practical helpers; verify important financial or application decisions against the relevant official information.</p><h3>Privacy and browser-based processing</h3><p>PicToSpec does not require an account for these tools. Image and document tasks are designed to run in your browser. Some browser features, such as copying to the clipboard, may ask for permission. Read our <a href="/privacy">Privacy Policy</a> to understand the site's data practices and optional analytics.</p></section>
    <section className="workspace" id="tools"><div className="workspace-head"><div><small id="tool-name">IMAGE TOOL</small><h2>{tool === "compress" ? "Compress image" : tool === "resize" ? "Resize image" : tool === "crop" ? "Crop image" : "Convert image"}</h2></div></div>
      <div className="tabs">{(["compress","resize","crop","convert"] as Tool[]).map(t => <button key={t} className={tool === t ? "active" : ""} onClick={() => {setTool(t);setError("");if(resultUrlRef.current)URL.revokeObjectURL(resultUrlRef.current);resultUrlRef.current="";setResult(null);}}>{t === "compress" ? "Compress" : t === "resize" ? "Resize" : t === "crop" ? "Crop" : "Convert"}</button>)}</div>
      <div className="columns"><div className="upload-column"><div className="step-hint"><b>STEP 1</b><span>Upload your image</span></div><button type="button" className="drop" onClick={() => picker.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); selectFile(e.dataTransfer.files?.[0]); }}>{preview ? <><img src={preview} alt="Selected image preview"/><strong>{file?.name}</strong><span>Tap to choose another image</span></> : <><span className="upload">↑</span><strong>Tap to choose an image</strong><span>JPG, PNG or WebP · up to 20 MB</span><small className="tap-hint">BROWSE FILES</small></>}</button><input ref={picker} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { selectFile(e.target.files?.[0]); e.currentTarget.value = ""; }}/>{file && <p className="fileinfo">{file.name} · {bytes(file.size)}</p>}<div className="privacy">🔒 <div><b>Your images stay private</b><p>Processing happens locally in your browser. Images are not uploaded to our server.</p></div></div></div>
      <div className="settings"><div className="step-hint"><b>STEP 2</b><span>Choose what you need</span></div>{tool === "compress" && <div className="field"><label>Target file size</label><div className="inputunit"><input type="number" min="5" max="5000" value={target} onChange={e => setTarget(e.target.value)}/><span>KB</span></div><p>We will try to keep the result under your target size.</p></div>}
      {tool === "resize" && <><div className="field"><label>Image dimensions</label><div className="dims"><input aria-label="Width in pixels" type="number" value={width} onChange={e => setWidth(e.target.value)}/><b>×</b><input aria-label="Height in pixels" type="number" value={height} onChange={e => setHeight(e.target.value)}/></div><label className="check"><input type="checkbox" checked={ratio} onChange={e => setRatio(e.target.checked)}/> Keep aspect ratio</label></div><div className="presets">{presets.map(p => <button key={p.name} onClick={() => {setWidth(String(p.w));setHeight(String(p.h));setRatio(false);}}><b>{p.name}</b><span>{p.w} × {p.h} px</span></button>)}</div></>}
      {tool === "crop" && <div className="field"><label>Crop area (pixels)</label><div className="crop-fields"><label>Left<input type="number" min="0" value={cropX} onChange={e=>setCropX(e.target.value)}/></label><label>Top<input type="number" min="0" value={cropY} onChange={e=>setCropY(e.target.value)}/></label><label>Width<input type="number" min="1" value={cropW} onChange={e=>setCropW(e.target.value)}/></label><label>Height<input type="number" min="1" value={cropH} onChange={e=>setCropH(e.target.value)}/></label></div><p>Enter the area to keep, measured from the top-left corner.</p></div>}
      {tool === "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      {tool !== "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      <div className="step-hint step-three"><b>STEP 3</b><span>Create and download</span></div><button type="button" className="primary" disabled={busy || !file} aria-busy={busy} onClick={run}>{busy ? "Preparing your image…" : "Prepare image now"} <span>→</span></button>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="result result-ready" ref={resultRef} role="status" aria-live="polite"><div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your image is ready!</b><p>{bytes(result.size)} · {result.w} × {result.h} px</p></div></div><a className="result-download" href={result.url} download={result.name}><span>↓</span> Download image</a><small>{result.name}</small></div>}
      </div></div>
    </section>
    
    <section className="guides"><a href="/compress-image-to-50kb">Compress to 50KB</a><a href="/resize-photo-for-online-form">Photo size guide</a><a href="/signature-resizer">Signature guide</a><a href="/jpg-to-webp">JPG to WebP guide</a></section>
    <footer><a className="brand" href="/"><span className="mark">P</span>PicToSpec</a><span>Your files stay on your device.</span><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:ya6331856@gmail.com">Contact</a></footer>
  </main>;
}