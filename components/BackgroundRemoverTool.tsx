"use client";

import { useEffect, useRef, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type OutputBackground = "transparent" | "white" | "light" | "black";

export default function BackgroundRemoverTool() {
  const [file,setFile]=useState<File|null>(null);
  const [sourceUrl,setSourceUrl]=useState("");
  const [resultUrl,setResultUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState(0);
  const [stage,setStage]=useState("");
  const [error,setError]=useState("");
  const [background,setBackground]=useState<OutputBackground>("transparent");
  const [details,setDetails]=useState("");
  const sourceRef=useRef("");
  const resultRef=useRef("");
  const controllerRef=useRef<AbortController|null>(null);
  const outputRef=useRef<HTMLDivElement>(null);

  useEffect(()=>()=> {
    controllerRef.current?.abort();
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    if(resultRef.current) URL.revokeObjectURL(resultRef.current);
  },[]);

  function chooseFile(next:File|null) {
    setError(""); setDetails(""); setResultUrl(""); setProgress(0); setStage("");
    if(resultRef.current) URL.revokeObjectURL(resultRef.current);
    resultRef.current="";
    if(sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    sourceRef.current="";
    setFile(null); setSourceUrl("");
    if(!next) return;
    if(!["image/jpeg","image/png","image/webp"].includes(next.type)) {setError("Please choose a JPG, PNG or WebP image.");return;}
    if(next.size>25*1024*1024) {setError("Please choose an image smaller than 25 MB for reliable browser processing.");return;}
    sourceRef.current=URL.createObjectURL(next);
    setSourceUrl(sourceRef.current); setFile(next);
  }

  async function makeBackground() {
    if(!file) {setError("Choose an image first.");return;}
    setBusy(true); setError(""); setDetails(""); setProgress(0); setStage("Loading background-removal engine…");
    const controller=new AbortController(); controllerRef.current=controller;
    try {
      const engine=await import("@bg0/browser");
      const result=await engine.removeBackground(file,{
        quality:"quality",
        signal:controller.signal,
        onProgress:(event)=>{setProgress(Math.max(0,Math.min(100,Math.round(event.progress*100))));setStage(event.message||event.stage||"Processing image…");}
      });
      let outputBlob=result.blob;
      if(background!=="transparent") {
        const bitmap=await createImageBitmap(result.blob);
        const canvas=document.createElement("canvas");
        try {
          if(bitmap.width*bitmap.height>40000000) throw new Error("The processed image exceeds the 40-megapixel safety limit.");
          canvas.width=bitmap.width; canvas.height=bitmap.height;
          const ctx=canvas.getContext("2d");
          if(!ctx) throw new Error("Your browser could not prepare the final image.");
          const colors:Record<Exclude<OutputBackground,"transparent">,string>={white:"#ffffff",light:"#f1f5f9",black:"#111827"};
          ctx.fillStyle=colors[background]; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(bitmap,0,0);
          outputBlob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Could not export the image.")),"image/png"));
        } finally {
          bitmap.close();
          canvas.width=0; canvas.height=0;
        }
      }
      if(controller.signal.aborted) throw new Error("Processing cancelled.");
      const url=URL.createObjectURL(outputBlob);
      if(resultRef.current) URL.revokeObjectURL(resultRef.current);
      resultRef.current=url; setResultUrl(url);
      setDetails(result.provider+" · "+(result.durationMs/1000).toFixed(1)+" seconds");
      setStage("Background removed successfully.");
      setProgress(100);
      requestAnimationFrame(()=>outputRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}));
    } catch(e) {
      const message=e instanceof Error?e.message:"Background removal could not be completed.";
      setError(controller.signal.aborted?"Processing cancelled. You can try again.":message+" If the model failed to load, reload this page and retry.");
      setStage("");
    } finally {setBusy(false);controllerRef.current=null;}
  }

  return <main className="seo-page">
    <div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch /></div>
    <p className="kicker">FREE AI BACKGROUND REMOVER</p>
    <h1>Remove Image Background</h1>
    <p className="lead">Remove a photo background and create a transparent PNG in your browser. No account, API key or image upload to a PicToSpec processing server.</p>
    <p className="note">The first use downloads an AI model. Depending on your device, the model may be about 94 MiB or as large as 452 MiB; your browser may cache it for later use. Processing speed depends on your device and browser. Use a recent browser and keep this tab open while it works.</p>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>1. Choose an image</h2>
      <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{chooseFile(e.target.files?.[0]||null);e.currentTarget.value="";}}/>
      <p style={{fontSize:12,color:"#64748b"}}>JPG, PNG or WebP · Maximum 25 MB</p>
      {file&&<p><b>{file.name}</b> · {(file.size/1024/1024).toFixed(2)} MB</p>}
      {sourceUrl&&<div style={{margin:"14px 0",padding:10,border:"1px solid #e2e8f0",borderRadius:14,background:"#f8fafc"}}><img src={sourceUrl} alt="Original image preview" style={{display:"block",maxWidth:"100%",maxHeight:260,objectFit:"contain",margin:"auto"}}/><p style={{textAlign:"center",fontSize:12,color:"#64748b",marginBottom:0}}>Original image</p></div>}
      <h2>2. Choose the output background</h2>
      <select value={background} disabled={busy} onChange={e=>setBackground(e.target.value as OutputBackground)} style={{width:"100%",maxWidth:320,padding:12,borderRadius:10,border:"1px solid #cbd5e1",background:"#fff"}}>
        <option value="transparent">Transparent PNG</option><option value="white">White background</option><option value="light">Light grey background</option><option value="black">Black background</option>
      </select>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
        <button className="primary" disabled={!file||busy} onClick={makeBackground}>{busy?"Removing background…":"Remove Background →"}</button>
        {busy&&<button type="button" onClick={()=>controllerRef.current?.abort()} style={{padding:"10px 16px",borderRadius:10,border:"1px solid #cbd5e1",background:"#fff"}}>Cancel</button>}
      </div>
      {busy&&<div style={{marginTop:16}}><p role="status" aria-live="polite">{stage||"Working…"} {progress>0&&progress+"%"}</p><div style={{height:9,background:"#e2e8f0",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#0d9488,#2563eb)",transition:"width .2s"}}/></div></div>}
      {error&&<p className="error" role="alert">{error}</p>}
      {resultUrl&&<div className="result result-ready" ref={outputRef} style={{marginTop:20}}>
        <div className="result-ready-heading"><span className="result-check">✓</span><div><b>Your image is ready!</b><p>{details}</p></div></div>
        <div style={{padding:12,borderRadius:12,background:background==="transparent"?"repeating-conic-gradient(#e2e8f0 0% 25%,#fff 0% 50%) 50% / 20px 20px":background==="black"?"#111827":background==="white"?"#fff":"#f1f5f9",border:"1px solid #dbe3ec"}}><img src={resultUrl} alt="Background removed result preview" style={{display:"block",maxWidth:"100%",maxHeight:340,objectFit:"contain",margin:"auto"}}/></div>
        <a className="result-download" href={resultUrl} download="pictospec-background-removed.png">↓ Download PNG</a>
      </div>}
    </section>
    <section className="tool-content">
      <h2>How to remove a photo background</h2>
      <ol><li>Choose a JPG, PNG or WebP image from your device.</li><li>Select transparent, white, light grey or black as the final background.</li><li>Press Remove Background and wait for the model to finish.</li><li>Preview the cutout, then download the PNG.</li></ol>
      <h2>What images work best?</h2>
      <p>Use a clear photo where the main subject is easy to distinguish from the background. Portraits, product photos and objects with visible edges are good starting points. Hair, fur, transparent objects, motion blur and subjects that blend into the background can be harder to separate perfectly.</p>
      <h2>Is my photo uploaded?</h2>
      <p>The selected image is processed locally in your browser. The background-removal model files are downloaded from the model provider on first use, but your selected photo is not sent to a PicToSpec image-processing server. Browser memory and device capability affect the maximum practical image size.</p>
      <h2>Why is the first run slower?</h2>
      <p>The browser needs to download and initialize an AI model. Depending on device capability, the selected model may be about 94 MiB or up to 452 MiB. The model may be cached for later visits, but browser storage can be cleared or evicted. WebGPU-capable devices may process faster; other devices can use the WebAssembly fallback.</p>
      <h2>Frequently asked questions</h2>
      <div className="faq"><h3>Does it create a transparent PNG?</h3><p>Yes. Transparent PNG is the default. You can also place the cutout on a white, light grey or black background.</p></div>
      <div className="faq"><h3>Can I remove the background from a product photo?</h3><p>Yes, product photos are a useful case. Inspect small edges, shadows, handles and reflective parts before publishing the result.</p></div>
      <div className="faq"><h3>Will every image be perfect?</h3><p>No. AI segmentation can leave halos or remove parts of a subject, especially around fine hair, glass, similar colours or complicated scenes. Check the preview before using the result.</p></div>
      <div className="faq"><h3>Why does it not work on my phone?</h3><p>AI processing needs device memory and browser support. Close unused tabs, try a smaller image, use a recent browser, or retry after reloading if the model fails to initialize.</p></div>
    </section>
    <p className="note">Open-source notices: the browser library is Apache-2.0 and the BiRefNet model weights are MIT-licensed. Review the <a href="https://github.com/opencoredev/bg0/blob/main/packages/browser/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">third-party license notices</a>.</p>
    <section className="guides"><a href="/image-compressor">Image Compressor</a><a href="/image-cropper">Image Cropper</a><a href="/image-to-text">Image to Text OCR</a><a href="/passport-photo-maker">Passport Photo Maker</a></section>
  </main>;
}
