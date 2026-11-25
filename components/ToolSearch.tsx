"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const tools = [
  { name: "Image Compressor", href: "/image-compressor", detail: "Reduce image size in KB or MB", aliases: "compress image photo reduce size kb mb" },
  { name: "Compress Image to 50KB", href: "/compress-image-to-50kb", detail: "Prepare an image under 50KB", aliases: "compress image to 50kb 50 kb 20kb 100kb compress image to 100kb 200kb target file size photo size" },
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
  { name: "SIP Calculator", href: "/sip-calculator", detail: "Estimate monthly mutual fund investment value", aliases: "sip systematic investment plan mutual fund monthly investment return" },
  { name: "FD & RD Calculator", href: "/fd-rd-calculator", detail: "Estimate fixed and recurring deposit maturity", aliases: "fixed deposit recurring deposit fd rd maturity interest" },
  { name: "Profit Margin & Markup Calculator", href: "/profit-margin-calculator", detail: "Calculate business profit margin and markup", aliases: "profit margin markup selling price cost business pricing" },
  { name: "Freelance Hourly Rate Calculator", href: "/freelance-hourly-rate-calculator", detail: "Estimate your freelance hourly rate", aliases: "freelancer hourly rate freelance pricing income expenses billable hours" },
  { name: "Simple & Compound Interest Calculator", href: "/simple-compound-interest-calculator", detail: "Compare simple and compound interest", aliases: "simple interest compound interest calculator investment" },
  { name: "Word Counter", href: "/word-counter", detail: "Count words, characters and spaces", aliases: "word count character counter text" },
  { name: "Typing Speed Test", href: "/typing-speed-test", detail: "Measure net WPM, typing accuracy and mistakes", aliases: "typing test speed wpm words per minute keyboard practice typing accuracy" },
  { name: "Text Compare", href: "/text-compare", detail: "Find added and removed lines between two texts", aliases: "diff compare two texts differences changes documents" },
  { name: "HTML Entity Encoder / Decoder", href: "/html-entity-encoder-decoder", detail: "Encode or decode HTML special characters", aliases: "html entity escape unescape ampersand quotes tags" },
  { name: "Unix Timestamp Converter", href: "/unix-timestamp-converter", detail: "Convert Unix seconds and milliseconds to UTC dates", aliases: "epoch timestamp date time seconds milliseconds converter" },
  { name: "URL Slug Generator", href: "/url-slug-generator", detail: "Create clean SEO-friendly URL slugs", aliases: "slug permalink seo url title hyphen underscore" },
  { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator", detail: "Generate placeholder text by words or paragraphs", aliases: "dummy text filler placeholder copy paragraphs" },
  { name: "Text Line Sorter", href: "/text-line-sorter", detail: "Sort text lines alphabetically or numerically", aliases: "sort lines alphabetic numeric ascending descending list" },
  { name: "Duplicate Line Remover", href: "/duplicate-line-remover", detail: "Remove repeated lines from text", aliases: "deduplicate unique lines repeated duplicates clean text" },
  { name: "Text Line Reverser", href: "/text-line-reverser", detail: "Reverse the order of text lines", aliases: "reverse lines reorder backwards text list" },
  { name: "CSV Cleaner", href: "/csv-cleaner", detail: "Trim cells and remove blank or duplicate rows", aliases: "clean csv remove duplicate rows blank lines whitespace spreadsheet" },
  { name: "Case Converter", href: "/case-converter", detail: "Change text to upper or lower case", aliases: "uppercase lowercase title case sentence" },
  { name: "JSON Formatter", href: "/json-formatter", detail: "Format, validate and minify JSON", aliases: "json beautifier validator minify developer" },
  { name: "JSON Validator", href: "/json-validator", detail: "Check JSON syntax and locate parsing errors", aliases: "json validate syntax error parser checker" },
  { name: "JSON Schema Generator", href: "/json-schema-generator", detail: "Generate a JSON Schema from sample JSON", aliases: "json schema draft 2020 validation properties required types" },
  { name: "JSON to TypeScript", href: "/json-to-typescript", detail: "Generate TypeScript types and interfaces from JSON", aliases: "typescript type interface ts object array json converter" },
  { name: "SQL Formatter", href: "/sql-formatter", detail: "Format SQL queries with readable indentation", aliases: "sql beautifier pretty print query formatter database mysql postgres" },
  { name: "Cron Expression Generator", href: "/cron-expression-generator", detail: "Build and explain five-field cron schedules", aliases: "cron schedule expression generator job scheduler minutes hours daily weekly" },
  { name: "HTML to Markdown Converter", href: "/html-to-markdown-converter", detail: "Convert HTML markup into clean Markdown", aliases: "html markdown md converter headings links lists tables code" },
  { name: "JavaScript Minifier", href: "/javascript-minifier", detail: "Remove JavaScript comments and unnecessary whitespace", aliases: "js minify minifier compress optimize javascript code smaller" },
  { name: "HTML Minifier", href: "/html-minifier", detail: "Remove HTML comments and whitespace between tags", aliases: "html minify minifier compress optimize markup smaller" },
  { name: "CSS Minifier", href: "/css-minifier", detail: "Remove CSS comments and unnecessary whitespace", aliases: "css minify minifier compress stylesheet optimize code" },
  { name: "JSON to YAML Converter", href: "/json-to-yaml-converter", detail: "Convert JSON data into readable YAML", aliases: "json yaml convert yaml converter config kubernetes" },
  { name: "YAML Validator", href: "/yaml-validator", detail: "Check common YAML indentation and syntax issues", aliases: "yaml yml validate validator lint syntax config kubernetes" },
  { name: "XML to CSV Converter", href: "/xml-to-csv-converter", detail: "Convert XML records and attributes into CSV", aliases: "xml csv excel spreadsheet export table converter" },
  { name: "XML to JSON Converter", href: "/xml-to-json-converter", detail: "Convert XML elements and attributes into JSON", aliases: "xml json convert parser attributes tags api" },
  { name: "SQL to JSON Converter", href: "/sql-to-json-converter", detail: "Convert SQL INSERT statements into JSON records", aliases: "sql insert json database rows export convert" },
  { name: "JSON Diff Tool", href: "/json-diff", detail: "Compare two JSON values and find exact differences", aliases: "json compare diff difference changes added removed nested" },
  { name: "Markdown Previewer", href: "/markdown-preview", detail: "Write Markdown and preview formatted content live", aliases: "markdown md editor live preview readme documentation" },
  { name: "Meta Tag Generator", href: "/meta-tag-generator", detail: "Generate SEO title, description and Open Graph tags", aliases: "seo meta title description canonical og open graph social tags" },
  { name: "Robots.txt Generator", href: "/robots-txt-generator", detail: "Create robots.txt crawl rules and sitemap directives", aliases: "robots txt crawler user agent allow disallow sitemap seo" },
  { name: "Base64 Encoder / Decoder", href: "/base64-encoder-decoder", detail: "Encode or decode Base64 text", aliases: "base64 encode decode" },
  { name: "Password Generator", href: "/password-generator", detail: "Generate a random strong password", aliases: "password secure random strong" },
  { name: "QR Code Generator", href: "/qr-code-generator", detail: "Create a QR code from text or a URL", aliases: "qr qrcode scan barcode url link" },
  { name: "URL Encoder / Decoder", href: "/url-encoder-decoder", detail: "Encode or decode URL characters", aliases: "url encode decode percent uri link escape" },
  { name: "CSV to JSON Converter", href: "/csv-json-converter", detail: "Convert CSV rows into JSON objects", aliases: "csv json excel comma separated convert import" },
  { name: "JSON to CSV Converter", href: "/json-to-csv-converter", detail: "Export JSON arrays to spreadsheet-ready CSV", aliases: "json csv excel spreadsheet export nested objects delimiter" },
  { name: "JSON to Excel Converter", href: "/json-to-excel-converter", detail: "Export JSON arrays to a real Excel workbook", aliases: "json xlsx excel spreadsheet workbook export nested objects" },
  { name: "CSV to Excel Converter", href: "/csv-to-excel-converter", detail: "Convert CSV data into a real Excel workbook", aliases: "csv xlsx excel spreadsheet convert comma semicolon tab leading zeros" },
  { name: "Color Converter", href: "/color-converter", detail: "Convert HEX colors to RGB and HSL", aliases: "hex rgb hsl color code picker converter" },
  { name: "SVG to PNG / JPG Converter", href: "/svg-to-png-converter", detail: "Convert safe SVG artwork to PNG or JPG", aliases: "svg png jpg image convert vector" },
  { name: "ICO & Favicon Generator", href: "/favicon-generator", detail: "Create a downloadable ICO favicon", aliases: "favicon ico icon generator website" },
  { name: "Image Color Picker", href: "/image-color-picker", detail: "Pick HEX RGB and HSL colors from an image", aliases: "image photo color picker hex rgb hsl" },
  { name: "Base64 Image Converter", href: "/base64-image-converter", detail: "Encode images to Base64 or decode image data URLs", aliases: "base64 image encode decode data url" },
  { name: "Bulk Image Renamer & Watermark", href: "/bulk-image-renamer-watermark", detail: "Rename batches of images and add an optional text watermark", aliases: "bulk batch rename image photos watermark multiple files zip" },
  { name: "EXIF Data Viewer & Remover", href: "/exif-data-viewer-remover", detail: "Inspect common JPEG EXIF fields and remove metadata by re-encoding", aliases: "exif metadata remove strip camera model date photo privacy" },
  { name: "Image Blur & Pixelate Tool", href: "/image-blur-pixelate-tool", detail: "Blur or pixelate a selected rectangular image region", aliases: "blur pixelate censor hide face private details mosaic image" },
  { name: "URL Parser", href: "/url-parser", detail: "Split a URL into protocol, host, path and query", aliases: "parse url uri hostname domain query parameters inspect" },
  { name: "JSON to XML Converter", href: "/json-to-xml-converter", detail: "Convert JSON objects and arrays into XML", aliases: "json xml convert object array developer" },
  { name: "XML Formatter", href: "/xml-formatter", detail: "Validate and indent XML markup", aliases: "xml beautifier pretty print validator" },
  { name: "CSS Formatter", href: "/css-formatter", detail: "Beautify CSS with consistent indentation", aliases: "css beautifier pretty print style sheet" },
  { name: "HTML Formatter", href: "/html-formatter", detail: "Format HTML markup with indentation", aliases: "html beautifier pretty print markup" },
  { name: "Regex Tester", href: "/regex-tester", detail: "Test regular expressions and preview replacements", aliases: "regex regexp regular expression pattern match capture groups tester" },
  { name: "CSS Gradient Generator", href: "/css-gradient-generator", detail: "Create linear and radial CSS gradients", aliases: "gradient background linear radial color stops css design" },
  { name: "UUID Generator", href: "/uuid-generator", detail: "Generate random UUID version 4 identifiers", aliases: "online uuid generator random uuid generator uuid v4 uuid guid unique id random identifier" },
  { name: "FormRule AI", href: "/formrule-ai", detail: "Read form photo and signature requirements and prepare files", aliases: "exam application photo signature size form rule upload pack" },
  { name: "Passport Photo Maker", href: "/passport-photo-maker", detail: "Create passport-style photo sheets with multiple copies", aliases: "passport visa photo print 4x6 a4 photo maker" },
  { name: "PDF Page Organizer", href: "/pdf-organizer", detail: "Reorder, remove and rotate PDF pages", aliases: "pdf organize reorder delete rotate pages" },
  { name: "PDF Page Numbers & Watermark", href: "/pdf-page-numbers-watermark", detail: "Add page numbers or a diagonal watermark to selected PDF pages", aliases: "pdf page number numbering watermark stamp confidential draft sample label" },
  { name: "PDF to JPG / PNG", href: "/pdf-to-jpg", detail: "Convert PDF pages into JPG or PNG images", aliases: "pdf to jpg pdf to png pdf converter image pages export" },
  { name: "PDF to Word", href: "/pdf-to-word", detail: "Convert selectable PDF text into an editable DOCX file", aliases: "pdf word doc docx microsoft office convert editable" },
  { name: "PDF to Excel", href: "/pdf-to-excel", detail: "Extract PDF text and table-like rows into an XLSX spreadsheet", aliases: "pdf excel xlsx spreadsheet table bank statement convert" },
  { name: "Background Remover", href: "/background-remover", detail: "Remove photo backgrounds and export transparent PNGs", aliases: "remove background transparent png cutout bg eraser product photo" },
  { name: "Image to Text OCR", href: "/image-to-text", detail: "Extract editable English text from images", aliases: "ocr image text extract photo screenshot scan" },
  { name: "ATS Resume Checker", href: "/ats-resume-checker", detail: "Review resume structure and job keyword overlap", aliases: "resume cv ats job application checker score" },
  { name: "GST Invoice Generator", href: "/gst-invoice-generator", detail: "Create a simple GST invoice PDF", aliases: "gst tax invoice bill cgst sgst igst business" },
  { name: "Unit Converter", href: "/unit-converter", detail: "Convert length, weight, temperature, volume and more", aliases: "unit conversion converter cm inch kg lbs celsius fahrenheit liter" },
  { name: "Hinglish to Hindi", href: "/hinglish-to-hindi", detail: "Convert Roman Hindi text to Devanagari", aliases: "hinglish hindi typing roman english to devanagari converter" }
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
