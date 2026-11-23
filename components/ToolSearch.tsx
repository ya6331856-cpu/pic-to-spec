"use client";

import { useMemo, useState } from "react";

const tools = [
  { name: "Image Compressor", href: "/image-compressor", detail: "Reduce image size in KB or MB", aliases: "compress image photo reduce size kb mb" },
  { name: "Compress Image to 50KB", href: "/compress-image-to-50kb", detail: "Prepare an image under 50KB", aliases: "50kb 50 kb 20kb 100kb 200kb photo size" },
  { name: "Image Resizer", href: "/image-resizer", detail: "Change image width and height", aliases: "resize image dimensions pixels" },
  { name: "Photo for Online Form", href: "/resize-photo-for-online-form", detail: "Resize a photo for application forms", aliases: "online form passport photo application" },
  { name: "Signature Resizer", href: "/signature-resizer", detail: "Resize a signature image", aliases: "signature sign size" },
  { name: "Image Cropper", href: "/image-cropper", detail: "Crop an image by pixel dimensions", aliases: "crop cut image" },
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
  { name: "QR Code Generator", href: "/qr-code-generator", detail: "Create a QR code from text or a URL", aliases: "qr qrcode scan barcode url link" }
];

export default function ToolSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
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
  function goFirst() { if (matches[0]) window.location.href = matches[0].href; }
  return <div className="tool-search">
    <div className="tool-search-box">
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={e => {setQuery(e.target.value);setOpen(true);}} onFocus={() => setOpen(true)} onKeyDown={e => {if(e.key==="Enter")goFirst();if(e.key==="Escape")setOpen(false);}} placeholder="Search tools… try “50kb”, “GST”, “merge PDF”" aria-label="Search all tools" />
      {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
      <kbd>↵</kbd>
    </div>
    {open && <div className="tool-search-results">
      {matches.length ? matches.map(tool=><a key={tool.href} href={tool.href}><span><b>{tool.name}</b><small>{tool.detail}</small></span><strong>OPEN →</strong></a>) : <p>No matching tool found. Try a shorter search.</p>}
      <button className="search-dismiss" type="button" onClick={()=>setOpen(false)}>Close results</button>
    </div>}
  </div>;
}
