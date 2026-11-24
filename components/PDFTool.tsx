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
const MAX_OUTPUT_PAGES = 500;
const MAX_IMAGE_PIXELS = 40000000;
const guides:Record<Kind,{intro:string;useCases:string[];tips:string[];limits:string[]}> = {
 merge:{
  intro:"A PDF merger combines separate PDF documents into one file. This is useful when forms, scanned pages, invoices or reports have been saved as separate documents but need to be shared or stored together. PicToSpec combines files in the order you select them and creates the output in your browser.",
  useCases:["Combine supporting documents before submitting an application, when the receiving organisation permits a single PDF.","Join separate invoice or receipt PDFs for a monthly record.","Put a cover sheet and report together for easier sharing."],
  tips:["Select files in the order you want them to appear; check the selected file list before merging.","Use clear file names so you can identify the correct documents.","Open the downloaded PDF and review page order, orientation and readability before sending it.","Keep an original copy of every source document."],
  limits:["Select at least 2 and no more than 20 PDF files in one operation.","The combined input size is limited to 100 MB and the output is limited to 500 pages.","Some encrypted, damaged or unusually complex PDFs may fail to open in the browser."]
 },
 split:{
  intro:"A PDF splitter extracts a continuous page range from one PDF and saves those pages as a separate document. It is useful when you only need to share selected pages or separate a section from a longer report. Page numbers are counted from 1, and both the first and last page you enter are included.",
  useCases:["Extract a particular chapter or section from a long report.","Create a smaller copy containing only the pages requested on an application form.","Separate selected pages from a manual or statement for easier reference."],
  tips:["Open the source PDF first and confirm the page numbers you need.","Enter the first and last page as whole numbers; the first page must not be greater than the last.","After downloading, open the new PDF and confirm that the first and last pages are correct.","Keep the original PDF because splitting creates a new copy and does not alter the source."],
  limits:["This tool extracts one continuous page range per operation; it does not reorder or delete scattered pages.","The output range is limited to 500 pages per operation.","Encrypted or damaged PDFs may not be supported."]
 },
 jpg:{
  intro:"JPG to PDF conversion places each selected JPG or PNG image on its own A4-sized PDF page. The image is scaled proportionally to fit inside the page area and centred, rather than stretched to fill the page. This is useful for turning photographs or scanned page images into a document that is easier to share or print.",
  useCases:["Combine photographed pages into one PDF for a digital submission, if the recipient accepts image-based PDFs.","Create a printable PDF from JPG or PNG scans.","Put several related images into one document in the order selected."],
  tips:["Choose clear, well-lit images and check that all text is readable before converting.","Select images in the order you want the pages to appear.","Use portrait or landscape source images as appropriate; each is fitted within an A4 page.","Review the PDF at normal zoom and print preview before submitting it."],
  limits:["Only JPG and PNG images are accepted; other formats must be converted first.","Each image becomes a separate A4 page; this tool does not run OCR or make text inside photos searchable.","Images above 40 megapixels are rejected, and the combined input size is limited to 100 MB."]
 }
};
const faqs:Record<Kind,{q:string;a:string}[]> = {
 merge:[{q:"Can I merge more than two PDFs?",a:"Yes. Select up to 20 PDF files. They are combined in the order shown by your file selection."},{q:"Are my PDFs uploaded?",a:"No. This tool processes the selected files in your browser. Large or encrypted PDFs may not be supported."}],
 split:[{q:"Are the first and last pages included?",a:"Yes. The page range is inclusive, so both the first and last page numbers are included in the new PDF."},{q:"Can I split a password-protected PDF?",a:"Encrypted PDFs may fail to open in this browser tool. Use an authorized, unencrypted copy if processing fails."}],
 jpg:[{q:"Can I convert PNG images too?",a:"Yes. The converter accepts JPG and PNG files and places each image on its own A4 PDF page."},{q:"Will the image be stretched to fill the page?",a:"No. The image is scaled proportionally to fit inside the page area and is centered."}]
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
  if(kind==="split"&&chosen.length!==1){setFiles([]);setError("Choose exactly one PDF file to split.");return;}
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
    for(const file of files){
     const source=await PDFDocument.load(await file.arrayBuffer());
     if(output.getPageCount()+source.getPageCount()>MAX_OUTPUT_PAGES)throw new Error("The merged PDF would exceed 500 pages. Split the job into smaller batches.");
     const pages=await output.copyPages(source,source.getPageIndices());pages.forEach(page=>output.addPage(page));
    }
   }else if(kind==="split"){
    if(files.length!==1)throw new Error("Choose exactly one PDF file.");
    const source=await PDFDocument.load(await files[0].arrayBuffer());
    const first=Number(start),last=Number(end);
    if(!Number.isInteger(first)||!Number.isInteger(last)||first<1||last<first||last>source.getPageCount())throw new Error("Enter a valid page range. Page numbers start at 1 and must be within the PDF.");
    if(last-first+1>MAX_OUTPUT_PAGES)throw new Error("Choose a range of 500 pages or fewer at a time.");
    const pages=await output.copyPages(source,Array.from({length:last-first+1},(_,i)=>first-1+i));pages.forEach(page=>output.addPage(page));
   }else{
    for(const file of files){
     const bytes=await file.arrayBuffer();
     const image=file.type==="image/png"?await output.embedPng(bytes):await output.embedJpg(bytes);
     if(!Number.isFinite(image.width*image.height)||image.width*image.height>MAX_IMAGE_PIXELS)throw new Error(file.name+" is too large to place safely. Choose an image with 40 megapixels or fewer.");
     const page=output.addPage([595.28,841.89]);
     const scale=Math.min(555/image.width,801/image.height);
     const width=image.width*scale,height=image.height*scale;
     page.drawImage(image,{x:(595.28-width)/2,y:(841.89-height)/2,width,height});
    }
   }
   const bytes=await output.save();
   const blob=new Blob([bytes as BlobPart],{type:"application/pdf"});
   const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=kind==="merge"?"merged-pdf.pdf":kind==="split"?"split-pages.pdf":"images-to-pdf.pdf";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),60000);
   setMessage("Your PDF is ready and the download has started.");
  }catch(e){setError(e instanceof Error?e.message:"Could not process these files. Please check the files and try again.");}
  finally{setBusy(false);}
 }
 return <main style={{maxWidth:780,margin:"42px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch /></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE PDF TOOL</p>
  <h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>{copy[kind].title}</h1>
  <p style={{color:"#75847c",lineHeight:1.7}}>{copy[kind].description}</p>
  <section onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();pick(e.dataTransfer.files);}} style={{marginTop:25,padding:22,border:"1px solid #e2eae4",borderRadius:14}}>
   <label style={{display:"block",fontWeight:700}}>{kind==="jpg"?"Choose JPG or PNG images (or drop them here)":kind==="split"?"Choose one PDF file (or drop it here)":"Choose PDF files (or drop them here)"}
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
  <p style={{fontSize:12,color:"#75847c",lineHeight:1.7}}>Files are processed in your browser and are not uploaded to PicToSpec. Very large or encrypted PDFs may fail or require a modern browser. The JPG-to-PDF tool currently supports JPG and PNG images only.</p><section className="tool-content"><h2>{kind==="merge"?"How to merge PDF files":kind==="split"?"How to split PDF pages":"How to convert JPG or PNG images to PDF"}</h2><p>{guides[kind].intro}</p><h3>Common uses</h3><ul>{guides[kind].useCases.map(item=><li key={item}>{item}</li>)}</ul><h3>Tips for a better result</h3><ul>{guides[kind].tips.map(item=><li key={item}>{item}</li>)}</ul><h3>File limits and compatibility</h3><ul>{guides[kind].limits.map(item=><li key={item}>{item}</li>)}</ul><h3>Privacy and processing</h3><p>Processing happens locally in your browser. Your selected files are not uploaded to a PicToSpec processing server. The browser still needs enough available memory to read and create the PDF, so very large or complex documents may not work on every device. Close other heavy tabs and try a smaller batch if processing fails.</p><h3>Frequently asked questions</h3>{faqs[kind].map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>
 </main>;
}
const fieldStyle:React.CSSProperties={display:"block",width:"100%",marginTop:7,padding:12,border:"1px solid #dce7df",borderRadius:8,fontSize:16};
