"use client";

import { useEffect, useRef, useState } from "react";

type Tool = "compress" | "resize" | "convert";
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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [tool, setTool] = useState<Tool>("compress");
  const [target, setTarget] = useState("100");
  const [width, setWidth] = useState("600");
  const [height, setHeight] = useState("600");
  const [ratio, setRatio] = useState(true);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number; w: number; h: number } | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); if (result?.url) URL.revokeObjectURL(result.url); }, [preview, result]);

  function selectFile(f?: File) {
    if (!f) return;
    setError(""); setResult(null);
    if (!f.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (f.size > 20 * 1024 * 1024) { setError("Please choose an image smaller than 20 MB."); return; }
    setFile(f); setPreview(URL.createObjectURL(f));
  }

  async function run() {
    if (!file) { setError("Choose an image first."); return; }
    setBusy(true); setError(""); setResult(null);
    try {
      const img = new Image();
      const source = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error("Image could not be opened.")); img.src = source; });
      URL.revokeObjectURL(source);
      let w = img.naturalWidth, h = img.naturalHeight;
      if (tool === "resize") {
        w = Math.max(1, Math.min(6000, Number(width) || w));
        h = Math.max(1, Math.min(6000, Number(height) || h));
        if (ratio) { const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight); w = Math.round(img.naturalWidth * scale); h = Math.round(img.naturalHeight * scale); }
      }
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Your browser does not support image processing.");
      if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(img, 0, 0, w, h);
      const toBlob = (q: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not create image.")), format, q));
      let blob: Blob;
      if (tool === "compress" && format !== "image/png") {
        const limit = Math.max(5, Math.min(5000, Number(target) || 100)) * 1024;
        let lo = 0.05, hi = 0.96; blob = await toBlob(hi);
        for (let i = 0; i < 16 && blob.size > limit; i++) { const mid = (lo + hi) / 2; const candidate = await toBlob(mid); blob = candidate; if (candidate.size > limit) hi = mid; else lo = mid; }
        if (blob.size > limit) throw new Error("Target size could not be reached. Try smaller dimensions or a larger KB target.");
      } else {
        blob = await toBlob(0.92);
        if (tool === "compress" && blob.size > (Number(target) || 100) * 1024) throw new Error("PNG compression is limited. Try JPG or WebP.");
      }
      const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";
      setResult({ url: URL.createObjectURL(blob), name: base + "-pictospec." + ext, size: blob.size, w, h });
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  return <main>
    <header className="topbar"><a className="brand" href="/"><span className="mark">P</span>picto<span>spec</span></a><nav><a href="#tools">Tools</a><a href="#how">How it works</a><a href="/privacy">Privacy</a></nav><small>● Files stay on your device</small></header>
    <section className="hero"><div className="eyebrow">IMAGE TOOLS, MADE SIMPLE</div><h1>Make every image<br/><em>fit the requirement.</em></h1><p>Compress to a target KB size, resize exact dimensions and convert formats — without uploading your photos to a server.</p><div className="trust"><span>✓ No account needed</span><span>✓ Browser-based processing</span><span>✓ Free to use</span></div></section>
    <section className="quick-start" aria-label="Choose what you want to do">
      <p className="eyebrow">START WITH ONE TAP</p><h2>What do you want to do?</h2>
      <div className="quick-grid">
        <button onClick={() => {setTool("compress");setTarget("50");document.getElementById("tools")?.scrollIntoView({behavior:"smooth"});}}><span>↘</span><b>Make image 50 KB</b><small>Tap to open · Reduce file size</small></button>
        <button onClick={() => {setTool("resize");setWidth("600");setHeight("600");setRatio(false);document.getElementById("tools")?.scrollIntoView({behavior:"smooth"});}}><span>▣</span><b>Resize passport photo</b><small>Tap to open · Set photo size</small></button>
        <button onClick={() => {setTool("resize");setWidth("400");setHeight("150");setRatio(false);document.getElementById("tools")?.scrollIntoView({behavior:"smooth"});}}><span>✎</span><b>Resize signature</b><small>Tap to open · Set signature size</small></button>
        <button onClick={() => {setTool("convert");setFormat("image/webp");document.getElementById("tools")?.scrollIntoView({behavior:"smooth"});}}><span>⇄</span><b>Convert JPG to WebP</b><small>Tap to open · Choose JPG, PNG or WebP</small></button>
      </div>
    </section>
    <section className="workspace" id="tools"><div className="workspace-head"><div><small>YOUR IMAGE WORKSPACE</small><h2>Prepare your image</h2></div><b>01 <i>/ 03</i></b></div>
      <div className="tabs">{(["compress","resize","convert"] as Tool[]).map(t => <button key={t} className={tool === t ? "active" : ""} onClick={() => {setTool(t);setError("");setResult(null);}}>{t === "compress" ? "Compress to KB" : t === "resize" ? "Resize dimensions" : "Convert format"}</button>)}</div>
      <div className="columns"><div className="upload-column"><div className="step-hint"><b>STEP 1</b><span>Upload your image</span></div><button type="button" className="drop" onClick={() => picker.current?.click()}>{preview ? <><img src={preview} alt="Selected image preview"/><strong>{file?.name}</strong><span>Tap to choose another image</span></> : <><span className="upload">↑</span><strong>Tap to choose an image</strong><span>JPG, PNG or WebP · up to 20 MB</span><small className="tap-hint">BROWSE FILES</small></>}</button><input ref={picker} hidden type="file" accept="image/*" onChange={e => selectFile(e.target.files?.[0])}/>{file && <p className="fileinfo">{file.name} · {bytes(file.size)}</p>}<div className="privacy">🔒 <div><b>Your images stay private</b><p>Processing happens locally in your browser. Images are not uploaded to our server.</p></div></div></div>
      <div className="settings"><div className="step-hint"><b>STEP 2</b><span>Choose what you need</span></div>{tool === "compress" && <div className="field"><label>Target file size</label><div className="inputunit"><input type="number" min="5" max="5000" value={target} onChange={e => setTarget(e.target.value)}/><span>KB</span></div><p>We will try to keep the result under your target size.</p></div>}
      {tool === "resize" && <><div className="field"><label>Image dimensions</label><div className="dims"><input aria-label="Width in pixels" type="number" value={width} onChange={e => setWidth(e.target.value)}/><b>×</b><input aria-label="Height in pixels" type="number" value={height} onChange={e => setHeight(e.target.value)}/></div><label className="check"><input type="checkbox" checked={ratio} onChange={e => setRatio(e.target.checked)}/> Keep aspect ratio</label></div><div className="presets">{presets.map(p => <button key={p.name} onClick={() => {setWidth(String(p.w));setHeight(String(p.h));setRatio(false);}}><b>{p.name}</b><span>{p.w} × {p.h} px</span></button>)}</div></>}
      {tool === "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      {tool !== "convert" && <div className="field"><label>Output format</label><select value={format} onChange={e => setFormat(e.target.value as Format)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>}
      <div className="step-hint step-three"><b>STEP 3</b><span>Create and download</span></div><button className="primary" disabled={busy || !file} onClick={run}>{busy ? "Preparing your image…" : "Prepare image now"} <span>→</span></button>
      {error && <p className="error">{error}</p>}
      {result && <div className="result"><b>✓ Image ready</b><p>{bytes(result.size)} · {result.w} × {result.h} px</p><a href={result.url} download={result.name}>Download {result.name} ↓</a></div>}
      </div></div>
    </section>
    <section className="how" id="how"><h2>How it works</h2><div><article><b>01</b><h3>Choose your image</h3><p>Select a photo or signature from your device.</p></article><article><b>02</b><h3>Set your requirements</h3><p>Choose the file size, dimensions or format you need.</p></article><article><b>03</b><h3>Download instantly</h3><p>Your processed image is ready on your device.</p></article></div></section>
    <section className="guides"><p className="eyebrow">HELPFUL HOW-TO GUIDES</p><h2>Find the right image settings</h2><div><a href="/compress-image-to-50kb"><b>Compress image to 50KB or 100KB</b><span>Learn how to meet a file-size limit.</span></a><a href="/resize-photo-for-online-form"><b>Resize photo for an online form</b><span>Set the exact pixel width and height.</span></a><a href="/signature-resizer"><b>Resize a signature image</b><span>Prepare a readable signature upload.</span></a><a href="/jpg-to-webp"><b>Convert JPG to WebP</b><span>Understand format conversion and compatibility.</span></a></div></section>
    <footer><a className="brand" href="/"> <span className="mark">P</span>pictospec</a><span>Simple image tools. Private by design.</span><a href="/privacy">Privacy Policy</a></footer>
  </main>;
}