"use client";

import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function OCRTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  function chooseFile(next: File | null) {
    setText("");
    setError("");
    setProgress(0);
    if (!next) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(next.type)) {
      setFile(null);
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (next.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Choose an image smaller than 12 MB.");
      return;
    }
    setFile(next);
  }

  async function run() {
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Choose a JPG, PNG or WebP image smaller than 12 MB.");
      return;
    }

    setBusy(true);
    setError("");
    setText("");
    setProgress(0);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: message => {
          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        }
      });
      try {
        const result = await worker.recognize(file);
        const recognized = result.data.text.trim();
        setText(recognized);
        if (!recognized) {
          setError("No readable text found. Try a sharper, brighter image.");
        }
      } finally {
        await worker.terminate();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR could not process this image.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!text) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setError("Text copied to clipboard.");
    } catch {
      setError("Copy was blocked by the browser; select the text and copy it manually.");
    }
  }

  function download() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pictospec-extracted-text.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return (
    <main className="seo-page">
      <div className="tool-page-top">
        <a className="back" href="/">← PicToSpec home</a>
        <ToolSearch />
      </div>
      <p className="kicker">IMAGE TEXT RECOGNITION</p>
      <h1>Image to Text (OCR) Converter</h1>
      <p className="lead">Extract editable English text from a photo, screenshot or scanned image. OCR runs in your browser; review the result because image recognition can make mistakes.</p>
      <p className="note">English OCR is enabled in this first version. Hindi and other language packs are not yet supported. Your image is processed locally, while the OCR engine and language data may be downloaded from the provider.</p>
      <section className="workspace" style={{ margin: "24px 0", padding: 20 }}>
        <h2>1. Upload an image</h2>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={busy}
          onChange={event => {
            chooseFile(event.target.files?.[0] || null);
            event.currentTarget.value = "";
          }}
        />
        {file && <p>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
        <h2>2. Extract text</h2>
        <button className="primary" disabled={busy || !file} onClick={run}>
          {busy ? "Recognizing… " + progress + "%" : "Extract text from image"}
        </button>
        {busy && <progress value={progress} max="100" style={{ width: "100%", marginTop: 12 }} />}
        {error && <p role="status" className="error">{error}</p>}
        {text && <>
          <h2>Extracted text</h2>
          <textarea value={text} onChange={event => setText(event.target.value)} rows={12} style={{ width: "100%", padding: 12, border: "1px solid #dbe5dd", borderRadius: 8 }} />
          <div className="quick-grid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))", marginTop: 12 }}>
            <button className="primary" onClick={copy}>Copy text</button>
            <button className="primary download-action" onClick={download}>↓ Download TXT</button>
          </div>
        </>}
      </section>
      <h2>How to convert image to text</h2>
      <ol>
        <li>Choose a clear JPG, PNG or WebP image.</li>
        <li>Run OCR and wait for text recognition to finish.</li>
        <li>Correct spelling, numbers and punctuation in the editable result.</li>
        <li>Copy the text or download it as a TXT file.</li>
      </ol>
      <h2>Tips for better OCR</h2>
      <ul>
        <li>Use a sharp, straight image with good lighting and contrast.</li>
        <li>Keep the text large and avoid shadows or glare.</li>
        <li>Check names, dates, account numbers and other critical details manually.</li>
      </ul>
      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Can OCR read handwritten notes?</h3><p>Printed English text is the intended use. Handwriting recognition is less reliable and may not work well.</p></div>
      <div className="faq"><h3>Does OCR guarantee exact text?</h3><p>No. OCR can misread similar characters, punctuation and low-quality text. Always proofread the result.</p></div>
    </main>
  );
}
