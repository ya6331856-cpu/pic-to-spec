"use client";

import { useEffect, useRef, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import BatchImageCompressor from "@/components/BatchImageCompressor";
import { validateImageFile, validateImageDimensions, validateCropBounds } from "@/lib/image-validation.mjs";
import { calculateResizeDimensions } from "@/lib/image-geometry.mjs";
import { findBestImageQuality } from "@/lib/image-compression.mjs";

type Tool = "compress" | "resize" | "convert" | "crop";
type Format = "image/jpeg" | "image/png" | "image/webp";

const imageGuides: Record<Tool, { title: string; example: string; steps: string[]; tips: string[]; limits: string }> = {
 compress: {
  title: "How to compress an image without losing more quality than necessary",
  example: "A 2 MB JPG can often be reduced for an email attachment or online form by choosing a target such as 200 KB. The result depends on image dimensions, detail, format and the target you choose.",
  steps: ["Select a JPG, PNG or WebP image up to 20 MB.", "Choose a target size in KB between 5 and 5000.", "Select JPG or WebP when you need lossy size reduction; PNG may not shrink much.", "Prepare the image, inspect the dimensions and file size, then download it."],
  tips: ["Start with a realistic target; very small files can show visible compression artefacts.", "For JPG and WebP, the compressor reduces dimensions gradually only when quality changes alone cannot reach the target.", "Check the final pixel dimensions against the destination form before uploading.", "Compare text, edges and faces at normal viewing size before uploading."],
  limits: "For JPG and WebP, the compressor first searches for the highest quality that fits at the original dimensions, then gradually reduces both dimensions proportionally when needed. Very small targets may still be impossible for some images. PNG output is re-encoded but cannot use the same lossy quality search, so it may not shrink enough. Always check the final file size, pixel dimensions and format against the destination website's rules."
 },
 resize: {
  title: "How to resize an image to the right pixel dimensions",
  example: "If a form asks for a maximum size of 600 × 400 pixels, enter those dimensions and keep the aspect ratio enabled to fit the original image inside that box without stretching it.",
  steps: ["Choose your source image.", "Enter the required width and height in pixels.", "Keep aspect ratio enabled for proportional resizing, or disable it only when exact dimensions are mandatory and distortion is acceptable.", "Prepare the resized image and check its final dimensions before downloading."],
  tips: ["Pixel dimensions and file size are different requirements; a photo can have correct dimensions but still be too large in KB.", "Use the destination form's instructions rather than assuming a passport or profile preset is an official standard.", "Avoid enlarging a tiny image excessively because resizing cannot restore missing detail."],
  limits: "With aspect ratio enabled, the image is scaled to fit within the requested width and height; it may not fill both dimensions. Turning the ratio off can stretch the image. The output is limited to 6000 pixels per side and 40 megapixels."
 },
 crop: {
  title: "How to crop an image using pixel coordinates",
  example: "For a 1200 × 800 pixel image, a crop with Left 100, Top 50, Width 600 and Height 600 keeps a square area beginning 100 pixels from the left and 50 pixels from the top.",
  steps: ["Choose the image and note its original pixel dimensions.", "Enter the Left and Top coordinates measured from the top-left corner.", "Enter the Width and Height of the area to keep.", "Prepare the crop and inspect the downloaded result."],
  tips: ["Keep the crop area inside the source image; values outside its edges are rejected.", "Use a square crop for a square avatar only when the destination asks for one.", "Leave enough space around faces, signatures or important text so nothing is cut off."],
  limits: "This cropper uses numeric pixel coordinates rather than a drag-to-select overlay. Coordinates and dimensions must be whole pixels, the crop must remain inside the source image, and the output cannot exceed 40 megapixels."
 },
 convert: {
  title: "How to convert images between JPG, PNG and WebP",
  example: "A JPG photograph can be converted to WebP for a modern website, while a transparent PNG should usually remain PNG if preserving transparency is important.",
  steps: ["Select a JPG, PNG or WebP source image.", "Choose the output format required by your website, app or upload form.", "Prepare the converted image.", "Open the downloaded file and confirm that it displays correctly in the destination application."],
  tips: ["JPG is widely accepted for photographs but does not preserve transparency.", "PNG supports transparency and is often useful for logos, screenshots and crisp graphics.", "WebP can reduce image size on supported platforms, but check compatibility before using it in older portals."],
  limits: "Conversion changes the file encoding, not the image's visual content or dimensions. JPG output uses a solid background for transparent areas. Re-encoding a lossy format can reduce quality, and a new format is not guaranteed to produce a smaller file."
 }
};
const presets = [
  { name: "Passport photo", w: 600, h: 600 },
  { name: "Profile photo", w: 500, h: 500 },
  { name: "Signature", w: 400, h: 150 },
  { name: "Form photo", w: 600, h: 400 }
];

function bytes(n: number) {
  return n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB";
}

export default function ImageWorkspace({ initialTool = "compress", initialTarget = "100", initialWidth = "600", initialHeight = "600", initialRatio = true, initialFormat = "image/jpeg", compact = false, pageTitle, pageDescription }: { initialTool?: Tool; initialTarget?: string; initialWidth?: string; initialHeight?: string; initialRatio?: boolean; initialFormat?: Format; compact?: boolean; pageTitle?: string; pageDescription?: string }) {
  const picker = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef("");
  const resultUrlRef = useRef("");
  const imageProbeIdRef = useRef(0);
  const processingIdRef = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [tool, setTool] = useState<Tool>(initialTool);
  const [batchMode, setBatchMode] = useState(false);
  const [target, setTarget] = useState(initialTarget);
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [ratio, setRatio] = useState(initialRatio);
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("400");
  const [cropH, setCropH] = useState("400");
  const [format, setFormat] = useState<Format>(initialFormat);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number; w: number; h: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" }));
  }, [result]);

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
    const fileError = validateImageFile(f.type, f.size); if (fileError) { setError(fileError); return; }
    const previewUrl = URL.createObjectURL(f);
    previewUrlRef.current = previewUrl;
    setFile(f); setPreview(previewUrl);
    const probe = new Image(); const probeUrl = URL.createObjectURL(f); probe.onload = () => { if (imageProbeId === imageProbeIdRef.current) { setCropW(String(probe.naturalWidth)); setCropH(String(probe.naturalHeight)); setCropX("0"); setCropY("0"); } URL.revokeObjectURL(probeUrl); }; probe.onerror = () => URL.revokeObjectURL(probeUrl); probe.src = probeUrl;
  }

  async function run() {
    if (!file) { setError("Choose an image first."); return; }
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = ""; setResult(null);
    if (tool === "compress") {
      const targetKb = Number(target);
      if (!Number.isInteger(targetKb) || targetKb < 5 || targetKb > 5000) { setError("Enter a target size between 5 KB and 5000 KB."); return; }
    }
    if (tool === "resize") {
      const requestedWidth = Number(width), requestedHeight = Number(height);
      if (!validateImageDimensions(requestedWidth, requestedHeight, 6000)) { setError("Enter whole-number dimensions between 1 and 6000 pixels."); return; }
    }
    if (tool === "crop") {
      const values = [cropX, cropY, cropW, cropH].map(Number);
      if (!values.every(Number.isInteger) || values[0] < 0 || values[1] < 0 || values[2] < 1 || values[3] < 1) { setError("Crop values must be whole pixels. Left and Top can be 0 or more; Width and Height must be at least 1."); return; }
    }
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
      if (tool === "crop") {
        const cropWidth = Number(cropW), cropHeight = Number(cropH);
        if (!validateCropBounds(sx, sy, cropWidth, cropHeight, img.naturalWidth, img.naturalHeight)) throw new Error(`Crop area is outside the image. Image size: ${img.naturalWidth} × ${img.naturalHeight} px.`);
        w = cropWidth; h = cropHeight;
      }
      if (tool === "resize") {
        const resized = calculateResizeDimensions(img.naturalWidth, img.naturalHeight, Number(width), Number(height), ratio, 40000000);
        if (!resized) throw new Error("These resize dimensions are invalid or exceed the 40-megapixel safety limit.");
        w = resized.width;
        h = resized.height;
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
        let best: Blob | null = null;
        const sourceWidth = w, sourceHeight = h;
        // First preserve the original dimensions. If quality alone cannot fit,
        // reduce dimensions gradually while preserving the aspect ratio.
        for (let resizeAttempt = 0; resizeAttempt < 8; resizeAttempt++) {
          const scale = Math.pow(0.85, resizeAttempt);
          const attemptWidth = Math.max(1, Math.round(sourceWidth * scale));
          const attemptHeight = Math.max(1, Math.round(sourceHeight * scale));
          canvas.width = attemptWidth;
          canvas.height = attemptHeight;
          const attemptContext = canvas.getContext("2d");
          if (!attemptContext) throw new Error("Your browser does not support image processing.");
          if (format === "image/jpeg") {
            attemptContext.fillStyle = "#fff";
            attemptContext.fillRect(0, 0, attemptWidth, attemptHeight);
          }
          attemptContext.imageSmoothingEnabled = true;
          attemptContext.imageSmoothingQuality = "high";
          attemptContext.drawImage(img, 0, 0, attemptWidth, attemptHeight);
          best = await findBestImageQuality(toBlob, limit, 18);
          if (processingId !== processingIdRef.current) return;
          if (best) {
            w = attemptWidth;
            h = attemptHeight;
            break;
          }
          if (Math.max(attemptWidth, attemptHeight) <= 320) break;
        }
        if (!best) throw new Error("This image could not fit the selected target, even after reducing its dimensions. Try a larger KB target.");
        blob = best;
      } else {
        blob = await toBlob(0.92);
        if (processingId !== processingIdRef.current) return;
        if (tool === "compress" && blob.size > Number(target) * 1024) throw new Error("This PNG is larger than your target. PNG size reduction is limited in browsers; try JPG or WebP for a smaller file.");
      }
      if (processingId !== processingIdRef.current) return;
      const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";
      const resultUrl = URL.createObjectURL(blob);
      resultUrlRef.current = resultUrl;
      if (processingId !== processingIdRef.current) { URL.revokeObjectURL(resultUrl); return; }
      setResult({ url: resultUrl, name: base + "-pictospec." + ext, size: blob.size, w, h });
    } catch (e) { if (processingId === processingIdRef.current) setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { if (processingId === processingIdRef.current) setBusy(false); }
  }

  return <main>
    <header className="topbar"><a className="brand" href="/"><span className="mark">P</span>PicToSpec</a><ToolSearch /><nav><a href="/image-compressor">Compressor</a><a href="/image-resizer">Resizer</a><a href="/image-cropper">Cropper</a><a href="/image-converter">Converter</a></nav><a className="privacy-link" href="/privacy">Privacy</a></header>
    {compact ? <section className="tool-page-intro"><p className="eyebrow">FREE ONLINE IMAGE TOOL</p><h1>{pageTitle || (tool === "compress" ? "Compress image to your target KB size" : tool === "resize" ? "Resize image to exact pixel dimensions" : tool === "crop" ? "Crop image online" : "Convert image format online")}</h1><p>{pageDescription || "Choose an image, adjust the settings and download your result. Processing stays in your browser."}</p></section> : <section className="hero"><div className="eyebrow">FREE ONLINE IMAGE TOOLS</div><h1>What do you need<br/><em>to do with your image?</em></h1><p>Choose a tool. Upload your image. Download the result.</p></section>}
    {!compact && <section className="quick-start" aria-label="Image tools">
      <div className="quick-grid">
        <a href="/image-compressor" className="tool-card"><span>↘</span><b>Image Compressor</b><small>Reduce image file size</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-resizer" className="tool-card"><span>▣</span><b>Image Resizer</b><small>Change width and height</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-cropper" className="tool-card"><span>⌗</span><b>Image Cropper</b><small>Cut unwanted image edges</small><strong>OPEN TOOL →</strong></a>
        <a href="/image-converter" className="tool-card"><span>⇄</span><b>Image Converter</b><small>Convert JPG, PNG and WebP</small><strong>OPEN TOOL →</strong></a>
      </div>
    </section>}
    <section className="workspace" id="tools"><div className="workspace-head"><div><small id="tool-name">IMAGE TOOL</small><h2>{tool === "compress" ? "Compress image" : tool === "resize" ? "Resize image" : tool === "crop" ? "Crop image" : "Convert image"}</h2></div></div>
      <div className="tabs">{(["compress","resize","crop","convert"] as Tool[]).map(t => <button key={t} className={tool === t ? "active" : ""} onClick={() => {if (tool !== t) { processingIdRef.current += 1; setBusy(false); setTool(t); setError(""); if(resultUrlRef.current)URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current=""; setResult(null); }}}>{t === "compress" ? "Compress" : t === "resize" ? "Resize" : t === "crop" ? "Crop" : "Convert"}</button>)}</div>
      {tool === "compress" && <div className="compression-mode-switch" role="group" aria-label="Compression mode"><button type="button" className={!batchMode ? "active" : ""} onClick={() => setBatchMode(false)}>Single image</button><button type="button" className={batchMode ? "active" : ""} onClick={() => setBatchMode(true)}>Batch compressor <span>UP TO 20</span></button></div>}
      {tool === "compress" && batchMode ? <BatchImageCompressor /> : <div className="columns"><div className="upload-column"><div className="step-hint"><b>STEP 1</b><span>Upload your image</span></div><button type="button" className="drop" onClick={() => picker.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); selectFile(e.dataTransfer.files?.[0]); }}>{preview ? <><img src={preview} alt="Selected image preview"/><strong>{file?.name}</strong><span>Tap to choose another image</span></> : <><span className="upload">↑</span><strong>Tap to choose an image</strong><span>JPG, PNG or WebP · up to 20 MB</span><small className="tap-hint">BROWSE FILES</small></>}</button><input ref={picker} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { selectFile(e.target.files?.[0]); e.currentTarget.value = ""; }}/>{file && <p className="fileinfo">{file.name} · {bytes(file.size)}</p>}<p className="privacy-compact"><span aria-hidden="true">🔒</span> Processed on this device · Not uploaded to PicToSpec</p></div>
      <div className="settings"><div className="step-hint"><b>STEP 2</b><span>Choose what you need</span></div>{tool === "compress" && <div className="field"><label>Target file size</label><div className="inputunit"><input type="number" min="5" max="5000" value={target} onChange={e => setTarget(e.target.value)}/><span>KB</span></div><p>We aim for the best quality under your size limit. JPG and WebP dimensions may be reduced if needed; check the result dimensions before upload.</p><div className="target-size-presets" role="group" aria-label="Common target file sizes" style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>{[50,100,200,500].map(size=><button type="button" key={size} aria-pressed={Number(target)===size} onClick={()=>setTarget(String(size))} style={{padding:"8px 11px",border:"1px solid",borderColor:Number(target)===size?"#14634b":"#d8e2dc",borderRadius:8,background:Number(target)===size?"#e8f5ee":"#fff",color:"#174d3d",fontSize:12,fontWeight:700,cursor:"pointer"}}>{size} KB</button>)}</div></div>}
      {tool === "resize" && <><div className="field"><label>Image dimensions</label><div className="dims"><input aria-label="Width in pixels" type="number" value={width} onChange={e => setWidth(e.target.value)}/><b>×</b><input aria-label="Height in pixels" type="number" value={height} onChange={e => setHeight(e.target.value)}/></div><label className="check"><input type="checkbox" checked={ratio} onChange={e => setRatio(e.target.checked)}/> Keep aspect ratio</label></div><div className="presets">{presets.map(p => <button key={p.name} onClick={() => {setWidth(String(p.w));setHeight(String(p.h));setRatio(false);}}><b>{p.name}</b><span>{p.w} × {p.h} px</span></button>)}</div></>}
      {tool === "crop" && <div className="field"><label>Crop area (pixels)</label><div className="crop-fields"><label>Left<input type="number" min="0" value={cropX} onChange={e=>setCropX(e.target.value)}/></label><label>Top<input type="number" min="0" value={cropY} onChange={e=>setCropY(e.target.value)}/></label><label>Width<input type="number" min="1" value={cropW} onChange={e=>setCropW(e.target.value)}/></label><label>Height<input type="number" min="1" value={cropH} onChange={e=>setCropH(e.target.value)}/></label></div><p>Enter the area to keep, measured from the top-left corner.</p></div>}
      {tool === "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      {tool !== "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      <div className="step-hint step-three"><b>STEP 3</b><span>Create and download</span></div><button type="button" className="primary" disabled={busy || !file} aria-busy={busy} onClick={run}>{busy ? "Preparing your image…" : "Prepare image now"} <span>→</span></button>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="result result-ready" ref={resultRef} role="status" aria-live="polite"><div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your image is ready!</b><p>{bytes(result.size)} · {result.w} × {result.h} px</p></div></div><a className="result-download" href={result.url} download={result.name}><span>↓</span> Download image</a><small>{result.name}</small></div>}
      </div></div>}
    </section>
    
    {compact && !pageTitle && <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebPage","name":imageGuides[initialTool].title,"description":imageGuides[initialTool].example,"publisher":{"@type":"Organization","name":"PicToSpec","url":"https://pictospec.com"}})}}/><section className="tool-content" style={{maxWidth:900,margin:"30px auto",padding:"0 20px"}}><h2>{imageGuides[initialTool].title}</h2><p>{imageGuides[initialTool].example}</p><h3>Step-by-step instructions</h3><ol>{imageGuides[initialTool].steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Practical tips</h3><ul>{imageGuides[initialTool].tips.map(tip=><li key={tip}>{tip}</li>)}</ul><h3>Formats, limits and important details</h3><p>{imageGuides[initialTool].limits}</p><h3>Frequently asked questions</h3><details><summary>Are my images uploaded to a server?</summary><p>No. Image processing is performed in your browser in this version. Your selected image is not sent to a PicToSpec image-processing server.</p></details><details><summary>Which image formats are supported?</summary><p>You can use JPG, PNG and WebP images. Choose an output format that is accepted by the website or app where you plan to use the result.</p></details><details><summary>Why might the output not meet my exact target?</summary><p>Image dimensions, visual detail, transparency and the selected format affect the result. Check the destination requirements and adjust the dimensions, format or target size if needed.</p></details><h3>Related image tools</h3><ul>{(initialTool==="compress"?[["Compress to 50KB","/compress-image-to-50kb"],["Resize a photo for an online form","/resize-photo-for-online-form"]]:initialTool==="resize"?[["Resize a photo for an online form","/resize-photo-for-online-form"],["Resize a signature image","/signature-resizer"]]:initialTool==="crop"?[["Compress an image","/image-compressor"],["Resize a photo","/image-resizer"]]:[["Convert JPG to WebP","/jpg-to-webp"],["Compress an image","/image-compressor"]]).map(([label,href])=><li key={href}><a href={href}>{label}</a></li>)}</ul></section></>}\n    {!compact && <section className="guides"><a href="/compress-image-to-50kb">Compress to 50KB</a><a href="/resize-photo-for-online-form">Photo size guide</a><a href="/signature-resizer">Signature guide</a><a href="/jpg-to-webp">JPG to WebP guide</a></section>}
    {!compact && <footer><a className="brand" href="/"><span className="mark">P</span>PicToSpec</a><a href="/privacy">Privacy</a></footer>}
  </main>;
}