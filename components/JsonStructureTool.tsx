"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Mode = "schema" | "typescript";
const sample = '{\n  "name": "PicToSpec",\n  "version": 1,\n  "active": true,\n  "features": ["image tools", "PDF tools"],\n  "owner": { "country": "India" }\n}';
const inputStyle={width:"100%",minHeight:300,padding:15,border:"1px solid #dce7df",borderRadius:12,fontSize:13,lineHeight:1.65,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace",resize:"vertical" as const};
const buttonStyle={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer" as const};
function inferSchema(value:unknown):Record<string,unknown>{
 if(value===null)return {type:"null"};
 if(Array.isArray(value)){
  if(!value.length)return {type:"array",items:{}};
  const variants=value.map(inferSchema);
  const unique=new Map(variants.map(v=>[JSON.stringify(v),v]));
  const schemas=Array.from(unique.values());
  return {type:"array",items:schemas.length===1?schemas[0]:{anyOf:schemas}};
 }
 if(typeof value==="object"){
  const entries=Object.entries(value as Record<string,unknown>);
  return {type:"object",properties:Object.fromEntries(entries.map(([k,v])=>[k,inferSchema(v)])),...(entries.length?{required:entries.map(([k])=>k)}:{}),additionalProperties:false};
 }
 return {type:typeof value};
}
function typeName(value:unknown,depth=0):string{
 if(value===null)return "null";
 if(Array.isArray(value)){if(!value.length)return "unknown[]";const types=Array.from(new Set(value.map(v=>typeName(v,depth+1))));return (types.length>1?"("+types.join(" | ")+")":types[0])+"[]";}
 if(typeof value==="object"){const entries=Object.entries(value as Record<string,unknown>);if(!entries.length)return "Record<string, unknown>";return "{\n"+entries.map(([k,v])=>"  ".repeat(depth+1)+(/^[A-Za-z_$][\\w$]*$/.test(k)?k:JSON.stringify(k))+": "+typeName(v,depth+1)+";").join("\n")+"\n"+"  ".repeat(depth)+"}";}
 return typeof value;
}
function generate(value:unknown,mode:Mode):string{
 if(mode==="schema")return JSON.stringify({$schema:"https://json-schema.org/draft/2020-12/schema",...inferSchema(value)},null,2);
 if(value===null||Array.isArray(value)||typeof value!=="object")return "export type Root = "+typeName(value)+";\n";
 return "export interface Root "+typeName(value)+"\n";
}
export default function JsonStructureTool({mode}:{mode:Mode}){
 const title=mode==="schema"?"JSON Schema Generator":"JSON to TypeScript";
 const description=mode==="schema"?"Create a JSON Schema (Draft 2020-12) from a sample JSON value. Infer object properties, required fields, arrays and data types locally.":"Convert a JSON sample into a TypeScript type or interface with inferred property and array types.";
 const [source,setSource]=useState(sample);const [output,setOutput]=useState("");const [error,setError]=useState("");const [copied,setCopied]=useState(false);
 function run(){setError("");setOutput("");try{if(!source.trim())throw new Error("Paste a JSON sample first.");const parsed:unknown=JSON.parse(source);setOutput(generate(parsed,mode));}catch(e){setError(e instanceof Error?e.message:"Could not parse this JSON.");}}
 async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}catch{setError("Clipboard access is unavailable. Select and copy the output manually.");}}
 function download(){const blob=new Blob([output],{type:mode==="schema"?"application/schema+json":"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=mode==="schema"?"schema.json":"types.ts";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:1050,margin:"36px auto",padding:20,color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{description}</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,390px),1fr))",gap:18,marginTop:22}}><label style={{display:"grid",gap:8,fontWeight:700}}>Sample JSON<textarea value={source} onChange={e=>{setSource(e.target.value);setOutput("");setError("");}} spellCheck={false} placeholder="Paste JSON here…" style={inputStyle}/></label><label style={{display:"grid",gap:8,fontWeight:700}}>Generated {mode==="schema"?"JSON Schema":"TypeScript"}<textarea readOnly value={output} placeholder="Your generated output will appear here…" spellCheck={false} style={{...inputStyle,background:"#f7faf8"}}/></label></div><div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:15}}><button type="button" style={buttonStyle} onClick={run}>{mode==="schema"?"Generate JSON Schema":"Generate TypeScript"}</button><button type="button" style={{...buttonStyle,background:"#eaf2ed",color:"#174c39"}} onClick={()=>{setSource(sample);setOutput("");setError("");}}>Load sample</button><button type="button" disabled={!output} style={{...buttonStyle,background:"#334155",opacity:output?1:.45}} onClick={copy}>{copied?"Copied":"Copy output"}</button><button type="button" disabled={!output} style={{...buttonStyle,background:"#334155",opacity:output?1:.45}} onClick={download}>Download file</button></div>{error&&<p role="alert" style={{color:"#b42318",fontWeight:600,marginTop:14}}>{error}</p>}<p style={{marginTop:24,color:"#607168",fontSize:13,lineHeight:1.6}}>Runs entirely in your browser. Generated structures are inferred from the sample only; optional fields, validation rules and business constraints cannot be reliably inferred from one example.</p></main>;
}
