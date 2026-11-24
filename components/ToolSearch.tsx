"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const tools = [
  { name: "Image Compressor", href: "/image-compressor", detail: "Reduce image size in KB or MB", aliases: "compress image photo reduce size kb mb" },
  { name: "Compress Image to 50KB", href: "/compress-image-to-50kb", detail: "Prepare an image under 50KB", aliases: "50kb 50 kb 20kb 100kb 200kb photo size" },
  { name: "Image Resizer", href: "/image-resizer", detail: "Change image width and height", aliases: "resize image dimensions pixels" },
  { name: "Photo for Online Form", href: "/resize-photo-for-online-form", detail: "Resize a photo for application forms", aliases: "online form passport photo application" },
  { name: "Signature Resizer", href: "/signature-resizer", detail: "Resize a signature image", aliases: "signature sign size" },
  { name: "Image Cropper", href: "/image-cropper", detail: "Crop an image by pixel dimensions", aliases: "crop cut image" },
  { name: "Image Cutter", href: "/image-cutter", detail: "Trim an image using crop coordinates", aliases: "cutter trim cut image" },
  { name: "Image Converter", href: "/image-converter", detail: "Convert JPG, PNG and WebP", aliases: "convert image jpg png webp format" },
  { name: "JPG to WebP", href: "/jpg-to-webp", detail: "Convert JPG images to WebP", aliases: "jpg webp jpeg" },
  { name: "Merge PDF", href: "/pdf-merger", detail: "Combine multiple PDF files", aliases: "merge pdf join combine pdfs" },
  { name: "Split PDF", href: "/pdf-splitter", detail: "Extract pages from a PDF", aliases: "split pdf extract pages separate" },
  { name: "JPG to PDF", href: "/jpg-to-pdf", detail: "Turn images into an A4 PDF", aliases: "image to pdf png to pdf convert pdf" },
  { name: "GST Calculator", href: "/gst-calculator", detail: "Calculate GST and final price", aliases: "gst tax 5 12 18 28 percent" },
  { name: "EMI Calculator", href: "/emi-calculator", detail: "Estimate monthly loan EMI", aliases: "emi loan monthly payment interest" },
  { name: "Percentage Calculator", href: "/percentage-calculator", detail: "Calculate percentage values", aliases: "percent percentage %" },
  { name: "Discount Calculator", href: "/discount-calculator", detail: "Calculate sale price and savings", aliases: "discount sale offer off price" },
  { name: "Age Calculator", href: "/age-calculator", detail: "Calculate age from date of birth", aliases: "age dob birthday date of birth" },
  { name: "Word Counter", href: "/word-counter", detail: "Count words, characters and spaces", aliases: "word count character counter text" },
  { name: "Case Converter", href: "/case-converter", detail: "Change text to upper or lower case", aliases: "uppercase lowercase title case sentence" },
  { name: "JSON Formatter", href: "/json-formatter", detail: "Format, validate and minify JSON", aliases: "json beautifier validator minify developer" },
  { name: "Base64 Encoder / Decoder", href: "/base64-encoder-decoder", detail: "Encode or decode Base64 text", aliases: "base64 encode decode" },
  { name: "Password Generator", href: "/password-generator", detail: "Generate a random strong password", aliases: "password secure random strong" },
  { name: "QR Code Generator", href: "/qr-code-generator", detail: "Create a QR code from text or a URL", aliases: "qr qrcode scan barcode url link" },
  { name: "URL Encoder / Decoder", href: "/url-encoder-decoder", detail: "Encode or decode URL characters", aliases: "url encode decode percent uri link escape" },
  { name: "CSV to JSON Converter", href: "/csv-json-converter", detail: "Convert CSV rows and JSON arrays", aliases: "csv json excel comma separated convert" },
  { name: "UUID Generator", href: "/uuid-generator", detail: "Generate random UUID version 4 identifiers", aliases: "uuid guid unique id random identifier" },
  { name: "FormRule AI", href: "/formrule-ai", detail: "Read form photo and signature requirements and prepare files", aliases: "exam application photo signature size form rule upload pack" },
  { name: "Passport Photo Maker", href: "/passport-photo-maker", detail: "Create passport-style photo sheets with multiple copies", aliases: "passport visa photo print 4x6 a4 photo maker" },
  { name: "PDF Page Organizer", href: "/pdf-organizer", detail: "Reorder, remove and rotate PDF pages", aliases: "pdf organize reorder delete rotate pages" },
  { name: "Image to Text OCR", href: "/image-to-text", detail: "Extract editable English text from images", aliases: "ocr image text extract photo screenshot scan" }
];

export default function ToolSearch() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools.slice(0, 6);
    const terms = q.split(" ").filter(Boolean);
    return tools.map(tool => {
      const haystack = (tool.name + " " + tool.detail + " " + tool.aliases).toLowerCase();
      const score = terms.reduce((total, term) => total + (tool.name.toLowerCase().includes(term) ? 4 : tool.aliases.includes(term) ? 3 : haystack.includes(term) ? 1 : 0), 0);
      return { ...tool, score };
    }).filter(tool => tool.score > 0).sort((a,b) => b.score-a.score).slice(0,7);
  }, [query]);
  function goActive() { if (matches[activeIndex]) window.location.href = matches[activeIndex].href; }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown" && matches.length) { e.preventDefault(); setOpen(true); setActiveIndex(i => (i + 1) % matches.length); return; }
    if (e.key === "ArrowUp" && matches.length) { e.preventDefault(); setOpen(true); setActiveIndex(i => (i - 1 + matches.length) % matches.length); return; }
    if (e.key === "Enter") { e.preventDefault(); goActive(); }
  }
  return <div className="tool-search" ref={rootRef}>
    <div className="tool-search-box">
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={e => {setQuery(e.target.value);setActiveIndex(0);setOpen(true);}} onFocus={() => setOpen(true)} onKeyDown={handleKeyDown} aria-expanded={open} aria-controls="tool-search-results" aria-activedescendant={open && matches[activeIndex] ? `tool-option-${activeIndex}` : undefined} aria-autocomplete="list" autoComplete="off" placeholder="Search tools… try “50kb”, “GST”, “merge PDF”" aria-label="Search all tools" />
      {query && <button type="button" onClick={() => {setQuery("");setActiveIndex(0);setOpen(true);}} aria-label="Clear search">×</button>}
      <kbd>↵</kbd>
    </div>
    {open && <div className="tool-search-results" id="tool-search-results" role="listbox" aria-label="Tool search results">
      {matches.length ? matches.map((tool,index)=><a key={tool.href} id={`tool-option-${index}`} role="option" aria-selected={index===activeIndex} className={index===activeIndex?"active":""} onMouseEnter={()=>setActiveIndex(index)} href={tool.href}><span><b>{tool.name}</b><small>{tool.detail}</small></span><strong>OPEN →</strong></a>) : <p role="status" aria-live="polite">No matching tool found. Try a shorter search.</p>}
      <button className="search-dismiss" type="button" onClick={()=>setOpen(false)}>Close results</button>
    </div>}
  </div>;
}
