"use client";
import { useMemo, useState } from "react";
import JSZip from "jszip";
import ToolSearch from "@/components/ToolSearch";

const area: React.CSSProperties = { width:"100%", minHeight:230, padding:14, border:"1px solid #dce7df", borderRadius:12, fontSize:14, lineHeight:1.6, color:"#17251e", background:"#fff", fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace" };
const primary: React.CSSProperties = { border:0, background:"#14634b", color:"#fff", padding:"12px 17px", borderRadius:9, fontWeight:700, cursor:"pointer" };
const secondary: React.CSSProperties = { border:"1px solid #d5e4da", background:"#fff", color:"#234b39", padding:"11px 15px", borderRadius:9, fontWeight:700, cursor:"pointer" };
const sample = `[
  {"name":"Asha","city":"Delhi","active":true,"score":92},
  {"name":"Ravi","city":"Mumbai","active":false,"score":87}
]`;
function flatten(value:Record<string,unknown>,prefix="",out:Record<string,unknown>={}) {
  for (const [key,item] of Object.entries(value)) {
    const path=prefix?prefix+"."+key:key;
    if(item && typeof item==="object" && !Array.isArray(item)) flatten(item as Record<string,unknown>,path,out);
    else out[path]=item;
  }
  return out;
}
function xmlEscape(value:string) { return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"); }
function columnName(index:number) { let n=index+1,s=""; while(n){const r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26);}return s; }
function cellXml(value:unknown,ref:string) {
  if(typeof value==="number" && Number.isFinite(value)) return `<c r="${ref}"><v>${value}</v></c>`;
  if(typeof value==="boolean") return `<c r="${ref}" t="b"><v>${value?1:0}</v></c>`;
  const text=value==null?"":typeof value==="object"?JSON.stringify(value):String(value);
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
}
export default function JsonToExcelTool() {
 const [source,setSource]=useState(sample),[error,setError]=useState(""),[busy,setBusy]=useState(false),[flattenNested,setFlattenNested]=useState(true);
 const parsed=useMemo(()=>{try{const value=JSON.parse(source);if(!Array.isArray(value)||value.some((row)=>!row||typeof row!=="object"||Array.isArray(row)))throw new Error("JSON must be an array of objects, for example [{\"name\":\"Asha\"}].");return {rows:value as Record<string,unknown>[],message:""};}catch(e){return {rows:[] as Record<string,unknown>[],message:e instanceof Error?e.message:"Invalid JSON"};}},[source]);
 async function download() {
  setError("");setBusy(true);
  try {
   if(parsed.message) throw new Error(parsed.message);
   if(!parsed.rows.length) throw new Error("Add at least one JSON object before exporting.");
   const records=flattenNested?parsed.rows.map(row=>flatten(row)):parsed.rows;
   const headers=Array.from(new Set(records.flatMap(row=>Object.keys(row))));
   if(!headers.length) throw new Error("No columns found. Add at least one property to your JSON objects.");
   const rows=[headers,...records.map(record=>headers.map(header=>record[header]))];
   const sheetRows=rows.map((row,rowIndex)=>`<row r="${rowIndex+1}">${row.map((value,colIndex)=>cellXml(value,`${columnName(colIndex)}${rowIndex+1}`)).join("")}</row>`).join("");
   const zip=new JSZip();
   zip.file("[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
   zip.file("_rels/.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
   zip.file("xl/workbook.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Export" sheetId="1" r:id="rId1"/></sheets></workbook>');
   zip.file("xl/_rels/workbook.xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
   zip.file("xl/worksheets/sheet1.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`);
   const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
   const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="pictospec-export.xlsx";a.click();URL.revokeObjectURL(url);
  } catch(e) { setError(e instanceof Error?e.message:"Could not create the Excel file."); } finally { setBusy(false); }
 }
 async function copyJson(){try{await navigator.clipboard.writeText(JSON.stringify(parsed.rows,null,2));}catch{setError("Clipboard access failed. Select the input and copy it manually.");}}
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>JSON to Excel Converter</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>Convert a JSON array into a real .xlsx Excel workbook. Export nested fields as separate columns, preserve numbers and boolean values, and download locally in your browser.</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>JSON input<textarea aria-label="JSON input" value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={area} placeholder="Paste an array of JSON objects…"/></label>
   <label style={{display:"flex",gap:9,alignItems:"center",fontSize:14,color:"#40594b"}}><input type="checkbox" checked={flattenNested} onChange={e=>setFlattenNested(e.target.checked)}/> Flatten nested objects into columns (e.g. address.city)</label>
   {parsed.message?<p role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24",fontSize:13}}>Check your JSON: {parsed.message}</p>:<p role="status" style={{color:"#14634b",fontSize:13,fontWeight:700}}>Valid JSON · {parsed.rows.length} data rows ready</p>}
   {error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={download} disabled={busy||!!parsed.message}>{busy?"Preparing Excel…":"Download Excel (.xlsx) ↓"}</button><button style={secondary} onClick={()=>setSource(sample)}>Load sample</button><button style={secondary} onClick={copyJson} disabled={!!parsed.message}>Copy formatted JSON</button><button style={secondary} onClick={()=>setSource("")}>Clear</button></div>
   <p style={{fontSize:13,color:"#607168",lineHeight:1.6}}>The workbook is generated in your browser. Each object becomes a spreadsheet row; property names become column headings. Strings are written as text cells, so content beginning with = is not treated as an Excel formula. JSON arrays of objects are supported; a single JSON object must be wrapped in an array.</p>
  </section>
  <section className="tool-content"><h2>How to convert JSON to Excel</h2><ol><li>Paste a valid JSON array containing objects with matching or different properties.</li><li>Keep nested flattening enabled to create columns such as profile.name, or disable it to keep nested values in one cell.</li><li>Download the .xlsx workbook and open it in Microsoft Excel, Google Sheets or compatible spreadsheet software.</li></ol><h3>Example JSON</h3><pre><code>{sample}</code></pre><h3>Frequently asked questions</h3><details><summary>Does this create a real Excel file?</summary><p>Yes. The download is an XLSX workbook, not a CSV file renamed with an Excel extension.</p></details><details><summary>Are numbers kept as numbers?</summary><p>Finite numeric values are written as numeric spreadsheet cells. Boolean values are written as boolean cells and text is kept as text.</p></details><details><summary>Is my JSON uploaded?</summary><p>No. Conversion and workbook generation run locally in your browser.</p></details></section>
 </main>;
}
