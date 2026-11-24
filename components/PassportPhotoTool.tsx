"use client";
import { useEffect, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

const presets = [
  { name: "Custom 35 × 45 mm", w: 413, h: 531 },
  { name: "US 2 × 2 inch", w: 600, h: 600 },
  { name: "Square 600 × 600 px", w: 600, h: 600 }
];
export default function PassportPhotoTool() {
  const [file,setFile]=useState<File|null>(null);
  const [width,setWidth]=useState("413"),[height,setHeight]=useState("531");
  const [copies,setCopies]=useState("8"),[paper,setPaper]=useState("4x6");
  const [background,setBackground]=useState("#ffffff"),[status,setStatus]=useState(""),[error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [previewUrl,setPreviewUrl]=useState("");
  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl)},[previewUrl]);
  async function generate(){
    if(!file){setError("Choose a photo first.");return;}
    const w=Number(width),h=Number(height),n=Number(copies);
    if(!Number.isInteger(w)||!Number.isInteger(h)||w<50||h<50||w>2000||h>2000){setError("Enter dimensions from 50 to 2000 pixels.");return;}
    if(!Number.isInteger(n)||n<1||n>40){setError("Choose 1 to 40 copies.");return;}
    setBusy(true);setError("");setStatus("");
    const url=URL.createObjectURL(file);
    try{
      const img=new Image();await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(new Error("Could not open this image."));img.src=url;});
      if(img.naturalWidth*img.naturalHeight>40000000)throw new Error("Image exceeds the 40-megapixel safety limit.");
      const photo=document.createElement("canvas");photo.width=w;photo.height=h;
      const pc=photo.getContext("2d");if(!pc)throw new Error("Canvas is unavailable.");
      pc.fillStyle=background;pc.fillRect(0,0,w,h);
      const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight),sw=w/scale,sh=h/scale;
      pc.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,0,0,w,h);
      const sheet=document.createElement("canvas");
      const cols=paper==="4x6"?2:3,rows=Math.ceil(n/cols),gap=24,margin=32;
      const cellW=paper==="4x6"?600:794,cellH=paper==="4x6"?900:1123;
      const slotW=(cellW-margin*2-gap*(cols-1))/cols,slotH=(cellH-margin*2-gap*(rows-1))/rows;
      const fit=Math.min(slotW/w,slotH/h),drawW=w*fit,drawH=h*fit;
      sheet.width=cellW;sheet.height=Math.max(cellH,margin*2+rows*slotH+gap*(rows-1));
      const ctx=sheet.getContext("2d");if(!ctx)throw new Error("Canvas is unavailable.");
      ctx.fillStyle="#fff";ctx.fillRect(0,0,sheet.width,sheet.height);
      for(let i=0;i<n;i++){const x=margin+(i%cols)*(slotW+gap)+(slotW-drawW)/2;const y=margin+Math.floor(i/cols)*(slotH+gap)+(slotH-drawH)/2;ctx.drawImage(photo,x,y,drawW,drawH);}
      const blob=await new Promise<Blob>((resolve,reject)=>sheet.toBlob(b=>b?resolve(b):reject(new Error("Could not create the print sheet.")),"image/jpeg",0.94));
      const resultUrl=URL.createObjectURL(blob);setPreviewUrl(old=>{if(old)URL.revokeObjectURL(old);return resultUrl;});
      setStatus("Print sheet ready. Check the crop and print at actual size; this is not an official photo compliance check.");
    }catch(e){setError(e instanceof Error?e.message:"Could not prepare the photo.");}
    finally{URL.revokeObjectURL(url);setBusy(false);}
  }
  function download(){if(!previewUrl)return;const a=document.createElement("a");a.href=previewUrl;a.download="pictospec-passport-photo-sheet.jpg";a.click();}
  return <main className="seo-page"><div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch/></div>
    <p className="kicker">FREE PHOTO PRINT TOOL</p><h1>Passport Photo Maker & Print Sheet</h1>
    <p className="lead">Crop a photo to a chosen pixel ratio and arrange multiple copies on a 4×6 inch-style or A4 print sheet. Processing stays in your browser.</p>
    <p className="note">Photo dimensions, background colour and print layouts vary by country and application. This tool does not guarantee passport-office or visa acceptance. Confirm the official photo rules before printing.</p>
    <section className="workspace" style={{margin:"24px 0",padding:20}}>
      <h2>1. Choose your photo</h2><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{setFile(e.target.files?.[0]||null);setStatus("");setError("");}}/>
      <h2>2. Set photo dimensions</h2><div className="presets">{presets.map(p=><button type="button" key={p.name} onClick={()=>{setWidth(String(p.w));setHeight(String(p.h));}}><b>{p.name}</b><span>{p.w} × {p.h} px</span></button>)}</div>
      <div className="quick-grid" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}><label>Width px<input type="number" value={width} onChange={e=>setWidth(e.target.value)}/></label><label>Height px<input type="number" value={height} onChange={e=>setHeight(e.target.value)}/></label><label>Copies<input type="number" min="1" max="40" value={copies} onChange={e=>setCopies(e.target.value)}/></label><label>Sheet<select value={paper} onChange={e=>setPaper(e.target.value)}><option value="4x6">4 × 6 inch-style sheet</option><option value="a4">A4 sheet</option></select></label><label>Background<select value={background} onChange={e=>setBackground(e.target.value)}><option value="#ffffff">White</option><option value="#dbeafe">Light blue</option><option value="#e5e7eb">Light grey</option></select></label></div>
      <button className="primary" disabled={busy} onClick={generate}>{busy?"Preparing…":"Create photo print sheet"}</button>
      {error&&<p className="error" role="alert">{error}</p>}{status&&<p className="result" role="status">{status}</p>}
      {previewUrl&&<><img src={previewUrl} alt="Generated passport photo print sheet preview" style={{display:"block",maxWidth:"100%",height:"auto",marginTop:18,border:"1px solid #ddd"}}/><button className="primary" onClick={download} style={{marginTop:12}}>Download print sheet</button></>}
    </section>
    <h2>How to use the passport photo maker</h2><ol><li>Choose a clear, front-facing image.</li><li>Select the exact dimensions required by the authority or application.</li><li>Choose the number of copies and print-sheet layout.</li><li>Download and inspect the sheet before printing.</li></ol>
    <h2>Important print tips</h2><p>Use high-quality photo paper and select actual size or 100% scale in the printer dialog. Disable fit-to-page scaling if exact physical dimensions matter. The crop is centre-based; adjust the source image beforehand if the face is not centred.</p>
    <h2>Frequently asked questions</h2><div className="faq"><h3>Does this tool remove the background?</h3><p>No. It fills the output with the selected background colour but does not accurately separate a person from the original background.</p></div><div className="faq"><h3>Are these official passport dimensions?</h3><p>The presets are examples only. Requirements differ by issuing authority, country and application. Enter the dimensions from the official instructions.</p></div>
  </main>;
}
