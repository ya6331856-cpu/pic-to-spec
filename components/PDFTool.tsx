"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolSearch from "@/components/ToolSearch";

type Kind = "merge" | "split" | "jpg";
const copy: Record<Kind,{title:string;description:string}> = {
 merge:{title:"Merge PDF Files",description:"Combine multiple PDF files into one document. Files are processed locally in your browser."},
 split:{title:"Split PDF Pages",description:"Extract a page range from a PDF and save it as a separate PDF file."},
 jpg:{title:"JPG to PDF Converter",description:"Turn JPG or PNG images into a PDF document, with one image per page."}
};
export default function PDFTool({kind}:{kind:Kind}){
 const [files,setFiles]=useState<File[]>([]);
 const [start,setStart]=useState("1");
 const [end,setEnd]=useState("1");
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 function pick(list:FileList|null){
  if(!list)return;
  const chosen=Array.from(list);
  setMessage("");setError("");
  if(chosen.length>20){setFiles([]);setError("Choose no more than 20 files at a time.");return;}
  if(chosen.reduce((total,file)=>total+file.size,0)>100*1024*1024){setFiles([]);setError("The combined file size must be 100 MB or smaller.");return;}
  const isValid=(file:File)=>kind==="jpg"
    ? file.type==="image/jpeg"||file.type==="image/png"
    : file.type==="application/pdf"||file.name.toLowerCase().endsWith(".pdf");
  const invalid=chosen.filter(file=>!isValid(file));
  if(invalid.length){
    setFiles([]);
    setError(kind==="jpg"
      ? "One or more selected files are not JPG or PNG images. Please select only supported images."
      : "One or more selected files are not PDFs. Please select only PDF files.");
    return;
  }
  setFiles(chosen);
 }
 async function process(){
  setBusy(true);setError("");setMessage("");
  try{
   if(!files.length)throw new Error(kind==="jpg"?"Choose at least one image.":"Choose at least one PDF file.");
   const output=await PDFDocument.create();
   if(kind==="merge"){
    if(files.length<2)throw new Error("Choose at least two PDF files to merge.");
    for(const file of files){const source=await PDFDocument.load(await file.arrayBuffer());const pages=await output.copyPages(source,source.getPageIndices());pages.forEach(page=>output.addPage(page));}
   }else if(kind==="split"){
    if(files.length!==1)throw new Error("Choose exactly one PDF file.");
    const source=await PDFDocument.load(await files[0].arrayBuffer());
    const first=Math.floor(Number(start)),last=Math.floor(Number(end));
    if(!Number.isInteger(first)||!Number.isInteger(last)||first<1||last<first||last>source.getPageCount())throw new Error("Enter a valid page range. Page numbers start at 1 and must be within the PDF.");
    const pages=await output.copyPages(source,Array.from({length:last-first+1},(_,i)=>first-1+i));pages.forEach(page=>output.addPage(page));
   }else{
    for(const file of files){
     const bytes=await file.arrayBuffer();
     const image=file.type==="image/png"?await output.embedPng(bytes):await output.embedJpg(bytes);
     const page=output.addPage([595.28,841.89]);
     const scale=Math.min(555/image.width,801/image.height);
     const width=image.width*scale,height=image.height*scale;
     page.drawImage(image,{x:(595.28-width)/2,y:(841.89-height)/2,width,height});
    }
   }
   const bytes=await output.save();
   const blob=new Blob([bytes as BlobPart],{type:"application/pdf"});
   const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=kind==="merge"?"merged-pdf.pdf":kind==="split"?"split-pages.pdf":"images-to-pdf.pdf";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),30000);
   setMessage("Your PDF is ready and the download has started.");
  }catch(e){setError(e instanceof Error?e.message:"Could not process these files. Please check the files and try again.");}
  finally{setBusy(false);}
 }
 return <main style={{maxWidth:780,margin:"42px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch /></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE PDF TOOL</p>
  <h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>{copy[kind].title}</h1>
  <p style={{color:"#75847c",lineHeight:1.7}}>{copy[kind].description}</p>
  <section style={{marginTop:25,padding:22,border:"1px solid #e2eae4",borderRadius:14}}>
   <label style={{display:"block",fontWeight:700}}>{kind==="jpg"?"Choose JPG or PNG images":kind==="split"?"Choose one PDF file":"Choose PDF files"}
    <input type="file" accept={kind==="jpg"?"image/jpeg,image/png":".pdf,application/pdf"} multiple={kind!=="split"} onChange={e=>{pick(e.target.files);e.currentTarget.value="";}} style={{display:"block",width:"100%",marginTop:12,padding:12,border:"1px dashed #b9cbbf",borderRadius:9}}/>
   </label>
   {files.length>0&&<p style={{fontSize:13,color:"#557361",marginTop:12}}>{files.length} file(s) selected: {files.map(f=>f.name).join(", ")}</p>}
   {kind==="split"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:18}}>
    <label style={{fontSize:13,fontWeight:700}}>First page<input type="number" min="1" value={start} onChange={e=>setStart(e.target.value)} style={fieldStyle}/></label>
    <label style={{fontSize:13,fontWeight:700}}>Last page<input type="number" min="1" value={end} onChange={e=>setEnd(e.target.value)} style={fieldStyle}/></label>
   </div>}
   <button disabled={busy} onClick={process} style={{width:"100%",marginTop:20,padding:14,border:0,borderRadius:9,background:busy?"#8ba99a":"#14634b",color:"white",fontWeight:800,fontSize:15,cursor:busy?"wait":"pointer"}}>{busy?"Processing…":kind==="merge"?"Merge PDF files":kind==="split"?"Extract selected pages":"Convert images to PDF"}</button>
   {error&&<p role="alert" style={{color:"#b42318",fontSize:13,marginTop:14}}>{error}</p>}
   {message&&<p role="status" style={{color:"#14634b",fontSize:13,marginTop:14}}>{message}</p>}
  </section>
  <h2 style={{marginTop:30}}>How to use this tool</h2>
  <ol style={{color:"#66776d",lineHeight:1.9}}>{(kind==="merge"?["Select at least two PDF files.","The files are combined in the order selected.","Download the merged PDF."]:kind==="split"?["Select one PDF file.","Enter the first and last page numbers to extract.","Download the new PDF containing only those pages."]:["Select one or more JPG or PNG images.","Each image is placed on its own A4-sized PDF page.","Download the generated PDF."]).map(x=><li key={x}>{x}</li>)}</ol>
  <p style={{fontSize:12,color:"#75847c",lineHeight:1.7}}>Files are processed in your browser and are not uploaded to PicToSpec. Very large or encrypted PDFs may fail or require a modern browser. The JPG-to-PDF tool currently supports JPG and PNG images only.</p>
 </main>;
}
const fieldStyle:React.CSSProperties={display:"block",width:"100%",marginTop:7,padding:12,border:"1px solid #dce7df",borderRadius:8,fontSize:16};
