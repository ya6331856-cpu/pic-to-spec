"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
const area={width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace"} as const;
const primary={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer"} as const;
function scalar(value:unknown):string {
 if(typeof value==="string")return JSON.stringify(value);
 if(value===null)return "null";
 return String(value);
}
function toYaml(value:unknown,level=0):string {
 const emit=(item:unknown,indent:number):string=>{
  const prefix=" ".repeat(indent);
  if(Array.isArray(item)){
   if(item.length===0)return prefix+"[]";
   return item.map(entry=>entry!==null&&typeof entry==="object"
    ?prefix+"-\\n"+emit(entry,indent+2)
    :prefix+"- "+scalar(entry)).join("\\n");
  }
  if(item!==null&&typeof item==="object"){
   const entries=Object.entries(item as Record<string,unknown>);
   if(entries.length===0)return prefix+"{}";
   return entries.map(([key,entry])=>entry!==null&&typeof entry==="object"
    ?prefix+JSON.stringify(key)+":\\n"+emit(entry,indent+2)
    :prefix+JSON.stringify(key)+": "+scalar(entry)).join("\\n");
  }
  return prefix+scalar(item);
 };
 return emit(value,level);
}
const sample=`{
  "name": "PicToSpec",
  "tools": ["JSON", "CSS", "HTML"],
  "active": true,
  "limits": { "free": 10, "pro": null }
}`;
export default function JsonYamlTool(){
 const [source,setSource]=useState(sample);const [copied,setCopied]=useState(false);
 const result=useMemo(()=>{try{return {yaml:toYaml(JSON.parse(source)),error:""};}catch(e){return {yaml:"",error:e instanceof Error?e.message:"Invalid JSON"};}},[source]);
 async function copy(){try{await navigator.clipboard.writeText(result.yaml);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 function download(){const blob=new Blob([result.yaml],{type:"text/yaml"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="converted.yaml";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>JSON to YAML Converter</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>Convert valid JSON into readable YAML online. Nested objects, arrays, strings, numbers, booleans and null values are supported. Your data stays in your browser.</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>JSON input<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...area,minHeight:250}} placeholder="Paste JSON here…"/></label>
   {result.error?<p role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24",fontSize:13}}>Invalid JSON: {result.error}</p>:<p role="status" style={{color:"#14634b",fontSize:13,fontWeight:700}}>Valid JSON — YAML output is ready.</p>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>setSource(sample)}>Load sample</button><button style={primary} onClick={copy} disabled={!!result.error}>{copied?"Copied":"Copy YAML"}</button><button style={{...primary,background:"#334155"}} onClick={download} disabled={!!result.error}>Download .yaml</button><button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>YAML output<textarea readOnly value={result.yaml} spellCheck={false} style={{...area,minHeight:250,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>String values and keys are emitted with double quotes to avoid YAML type ambiguity. This converter handles standard JSON data only; comments, dates and YAML-specific features are not part of JSON and are not generated.</p>
  </section>
 </main>;
}
