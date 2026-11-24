"use client";

import { useMemo, useRef, useState } from "react";
import JSZip from "jszip";

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";
type Item = { id: string; file: File; status: "queued" | "processing" | "done" | "error"; output?: Blob; outputName?: string; saved?: number; message?: string };
const MAX_FILES = 20;
const MAX_BYTES = 5 * 1024 * 1024;

function formatBytes(value: number) {
  return value < 1024 ? value + " B" : value < 1048576 ? (value / 1024).toFixed(1) + " KB" : (value / 1048576).toFixed(2) + " MB";
}
function safeBase(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "image";
}
function extension(type: string) { return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp"; }
function uniqueName(name: string, used: Set<string>) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let candidate = name, index = 2;
  while (used.has(candidate.toLowerCase())) candidate = base + "-" + index++ + ext;
  used.add(candidate.toLowerCase());
  return candidate;
}
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image could not be opened.")); };
    img.src = url;
  });
}
function encode(canvas: HTMLCanvasElement, type: OutputFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Browser could not create the compressed image.")), type, quality));
}

export default function BatchImageCompressor() {
  const picker = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(82);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");
  const [zipBusy, setZipBusy] = useState(false);
  const totalSaved = useMemo(() => items.reduce((sum, item) => sum + (item.saved || 0), 0), [items]);
  const completed = items.filter(item => item.status === "done").length;

  function addFiles(fileList: FileList | File[]) {
    if (busy) {
      setNotice("Please wait for the current batch to finish before adding more images.");
      return;
    }
    const incoming = Array.from(fileList);
    const known = new Set(items.map(item => item.file.name + ":" + item.file.size));
    const accepted: File[] = [];
    let message = "";
    for (const file of incoming) {
      if (items.length + accepted.length >= MAX_FILES) {
        message = "You can add up to 20 images per batch.";
        break;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        message = file.name + ": use JPG, PNG or WebP.";
        continue;
      }
      if (file.size > MAX_BYTES) {
        message = file.name + ": file is larger than 5 MB.";
        continue;
      }
      const key = file.name + ":" + file.size;
      if (known.has(key)) continue;
      known.add(key);
      accepted.push(file);
    }
    setNotice(message);
    if (accepted.length) {
      setItems(current => {
        const next = [...current];
        for (const file of accepted) {
          if (next.length >= MAX_FILES) break;
          if (next.some(item => item.file.name === file.name && item.file.size === file.size)) continue;
          next.push({
            id: (typeof crypto !== "undefined" && "randomUUID" in crypto)
              ? crypto.randomUUID()
              : file.name + "-" + file.size + "-" + next.length,
            file,
            status: "queued"
          });
        }
        return next;
      });
    }
  }

  async function compressAll() {
    if (!items.length || busy) return;
    setBusy(true); setProgress(0); setNotice("");
    const working: Item[] = items.map(item => ({ ...item, status: "queued", output: undefined, outputName: undefined, saved: undefined, message: undefined }));
    setItems(working);
    for (let index = 0; index < working.length; index++) {
      const item = working[index];
      setItems(current => current.map(row => row.id === item.id ? { ...row, status: "processing" } : row));
      try {
        const img = await loadImage(item.file);
        const pixels = img.naturalWidth * img.naturalHeight;
        if (!Number.isFinite(pixels) || pixels > 40000000) throw new Error("Image exceeds the 40-megapixel safety limit.");
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is not available in this browser.");
        if (format === "image/jpeg") { context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); }
        context.drawImage(img, 0, 0);
        let output = await encode(canvas, format, quality / 100);
        let outputType = format;
        let outputName = safeBase(item.file.name) + "-pictospec." + extension(format);
        if (output.size >= item.file.size) {
          output = item.file;
          outputType = item.file.type as OutputFormat;
          outputName = safeBase(item.file.name) + "-original." + extension(outputType);
        }
        const saved = Math.max(0, item.file.size - output.size);
        const result: Item = { ...item, status: "done", output, outputName, saved, message: output === item.file ? "Already optimized — original kept" : "Compressed successfully" };
        working[index] = result;
        setItems(current => current.map(row => row.id === item.id ? result : row));
      } catch (error) {
        const result: Item = { ...item, status: "error", message: error instanceof Error ? error.message : "Could not compress this image." };
        working[index] = result;
        setItems(current => current.map(row => row.id === item.id ? result : row));
      }
      setProgress(Math.round(((index + 1) / working.length) * 100));
    }
    setBusy(false);
  }

  async function downloadZip() {
    const ready = items.filter(item => item.status === "done" && item.output && item.outputName);
    if (!ready.length || zipBusy) return;
    setZipBusy(true);
    try {
      const zip = new JSZip();
      const used = new Set<string>();
      for (const item of ready) zip.file(uniqueName(item.outputName!, used), item.output!);
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 4 } });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "pictospec-compressed-images.zip"; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { setNotice("ZIP could not be created. Try downloading the images individually."); }
    finally { setZipBusy(false); }
  }

  function downloadOne(item: Item) {
    if (!item.output || !item.outputName) return;
    const url = URL.createObjectURL(item.output);
    const link = document.createElement("a"); link.href = url; link.download = item.outputName; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return <section className="batch-compressor" aria-label="Batch image compressor">
    <div className="batch-heading"><div><span className="batch-kicker">PICTOSPEC · BATCH WORKSPACE</span><h2>Compress a whole batch</h2><p>Less file weight. More room to create. All processing stays on your device.</p></div><div className="batch-count"><strong>{items.length.toString().padStart(2, "0")}</strong><span>/ 20 files</span></div></div>
    <div className="batch-layout">
      <div className="batch-main">
        <input ref={picker} hidden type="file" multiple disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={event => { if (event.currentTarget.files) addFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
        <button type="button" className="batch-drop" disabled={busy} onClick={() => picker.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addFiles(event.dataTransfer.files); }}>
          <span className="batch-upload-icon">↑</span><strong>Drop your images here</strong><span>or choose files from your device</span><small>JPG · PNG · WebP &nbsp; / &nbsp; UP TO 5 MB EACH</small><b>SELECT IMAGES</b>
        </button>
        {notice && <p className="batch-notice" role="alert">{notice}</p>}
        {items.length > 0 && <div className="batch-list-head"><div><b>Your images</b><span>{items.length} selected · {completed} ready</span></div><button type="button" disabled={busy} onClick={() => { setItems([]); setProgress(0); setNotice(""); }}>Clear all</button></div>}
        <div className="batch-file-list">{items.map(item => <article className="batch-file" key={item.id}>
          <span className="batch-file-icon">{extension(item.file.type).toUpperCase()}</span>
          <div className="batch-file-info"><b title={item.file.name}>{item.file.name}</b><span>{formatBytes(item.file.size)}{item.output ? " → " + formatBytes(item.output.size) : ""}</span>{item.message && <small className={item.status === "error" ? "is-error" : "is-success"}>{item.message}</small>}</div>
          <div className="batch-file-state">{item.status === "queued" ? "Queued" : item.status === "processing" ? "Working…" : item.status === "error" ? "Failed" : item.saved ? "−" + formatBytes(item.saved) : "Ready"}</div>
          {item.status === "done" && <button className="batch-single-download" type="button" aria-label={"Download " + item.file.name} onClick={() => downloadOne(item)}>↓</button>}
        </article>)}</div>
        {busy && <div className="batch-progress" role="status"><div><span>Optimizing images…</span><b>{progress}%</b></div><i><span style={{ width: progress + "%" }} /></i></div>}
        {items.length > 0 && <button type="button" className="batch-run" disabled={busy || items.length === 0} onClick={compressAll}>{busy ? "Processing batch…" : completed === items.length ? "Compress again" : "Compress " + items.length + " images"} <span>→</span></button>}
        {completed > 0 && !busy && <div className="batch-success"><div><b>{formatBytes(totalSaved)}</b><span> total space saved</span></div><button type="button" onClick={downloadZip} disabled={zipBusy}>{zipBusy ? "Preparing ZIP…" : "↓  Download all (ZIP)"}</button></div>}
      </div>
      <aside className="batch-settings"><span className="batch-kicker">YOUR OUTPUT</span><h3>Fine-tune compression</h3><label htmlFor="batch-format">Output format</label><select id="batch-format" value={format} disabled={busy} onChange={event => setFormat(event.target.value as OutputFormat)}><option value="image/webp">WebP · smaller files</option><option value="image/jpeg">JPG · widely supported</option><option value="image/png">PNG · keep transparency</option></select><div className="batch-quality-label"><label htmlFor="batch-quality">Image quality</label><b>{format === "image/png" ? "Lossless PNG" : quality + "%"}</b></div><input id="batch-quality" className="batch-quality" type="range" min="45" max="95" step="1" value={quality} disabled={busy || format === "image/png"} aria-describedby="batch-quality-help" onChange={event => setQuality(Number(event.target.value))}/><div className="batch-quality-ends" id="batch-quality-help"><span>{format === "image/png" ? "PNG quality is not adjustable" : "Smaller file"}</span><span>{format === "image/png" ? "Transparency preserved" : "Sharper image"}</span></div><p className="batch-limit-note">Up to 20 images, 5 MB each. Very large images above 40 megapixels are skipped for safety. If compression would make a file larger, the original is kept.</p></aside>
    </div>
  </section>;
}
