"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Kind = "url-encoder-decoder" | "csv-json-converter" | "uuid-generator";
const details: Record<Kind,{title:string;description:string}> = {
 "url-encoder-decoder": {title:"URL Encoder and Decoder",description:"Encode special characters for URLs or decode percent-encoded text. Choose full URL or URL component mode."},
 "csv-json-converter": {title:"CSV to JSON Converter",description:"Convert CSV rows into JSON objects or turn JSON arrays into CSV. Supports quoted commas, quotes and line breaks."},
 "uuid-generator": {title:"UUID Generator",description:"Generate random version 4 UUIDs in your browser. Create one ID or a batch and copy the results."}
};
function parseCsv(input:string):string[][] {
 const rows:string[][]=[]; let row:string[]=[]; let field=""; let quoted=false;
 for(let i=0;i<input.length;i++){const c=input[i];
  if(quoted){if(c==='"'&&input[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=false;}else{field+=c;}}
  else if(c==='"'&&field===""){quoted=true;}
  else if(c===","){row.push(field);field="";}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&input[i+1]==="\n")i++;row.push(field);if(row.some(v=>v!==""))rows.push(row);row=[];field="";}
  else{field+=c;}
 }
 if(quoted)throw new Error("CSV has an unclosed quoted field.");
 row.push(field);if(row.some(v=>v!==""))rows.push(row);return rows;
}
function toCsv(value:unknown):string {
 if(!Array.isArray(value)||value.some(v=>!v||typeof v!=="object"||Array.isArray(v)))throw new Error("JSON must be an array of objects to convert to CSV.");
 const objects=value as Record<string,unknown>[];const headers=Array.from(new Set(objects.flatMap(o=>Object.keys(o))));
 const cell=(v:unknown)=>{const s=v==null?"":typeof v==="object"?JSON.stringify(v):String(v);return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 return [headers.map(cell).join(","),...objects.map(o=>headers.map(h=>cell(o[h])).join(","))].join("\r\n");
}
export default function DeveloperTool({kind}:{kind:Kind}){
 const [input,setInput]=useState("");const [output,setOutput]=useState("");const [error,setError]=useState("");const [mode,setMode]=useState(kind==="csv-json-converter"?"csv-json":"encode");const [urlMode,setUrlMode]=useState("component");const [count,setCount]=useState("5");
 function run(){setError("");setOutput("");try{
  if(kind==="url-encoder-decoder"){const value=mode==="encode"?(urlMode==="full"?encodeURI(input):encodeURIComponent(input)):(urlMode==="full"?decodeURI(input.trim()):decodeURIComponent(input.trim()));setOutput(value);}
  else if(kind==="csv-json-converter"){if(!input.trim())throw new Error("Paste CSV or JSON data first.");if(mode==="csv-json"){const rows=parseCsv(input);if(rows.length<2)throw new Error("Add a header row and at least one data row.");const headers=rows[0].map((h,i)=>h.trim()||"column_"+(i+1));const objects=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]??""])));setOutput(JSON.stringify(objects,null,2));}else{const parsed=JSON.parse(input);setOutput(toCsv(parsed));}}
  else{const n=Math.max(1,Math.min(100,Math.floor(Number(count)||1)));if(!globalThis.crypto?.getRandomValues)throw new Error("Secure random generation is not available in this browser.");const ids=Array.from({length:n},()=>globalThis.crypto.randomUUID?globalThis.crypto.randomUUID():fallbackUuid());setOutput(ids.join("\n"));}
 }catch(e){setError(e instanceof Error?e.message:"Could not process this input.");}}
 function fallbackUuid(){const b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);}
 async function copy(){try{await navigator.clipboard.writeText(output);}catch{setError("Clipboard access failed. Select the result and copy it manually.");}}
 return <main style={{maxWidth:850,margin:"40px auto",padding:"20px",color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>{details[kind].title}</h1><p style={{color:"#75847c",lineHeight:1.7}}>{details[kind].description}</p>
 {kind==="uuid-generator"?<label style={{display:"block",marginTop:22,fontWeight:700}}>Number of UUIDs<input type="number" min="1" max="100" value={count} onChange={e=>setCount(e.target.value)} style={field}/></label>:<><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:22}}>{kind==="url-encoder-decoder"?<><select value={mode} onChange={e=>setMode(e.target.value)} style={field}><option value="encode">Encode</option><option value="decode">Decode</option></select><select value={urlMode} onChange={e=>setUrlMode(e.target.value)} style={field}><option value="component">URL component</option><option value="full">Full URL</option></select></>:<select value={mode} onChange={e=>setMode(e.target.value)} style={field}><option value="csv-json">CSV to JSON</option><option value="json-csv">JSON to CSV</option></select>}</div><textarea value={input} onChange={e=>{setInput(e.target.value);setOutput("");setError("");}} placeholder={kind==="url-encoder-decoder"?"Paste text or a URL here…":mode==="csv-json"?"name,city\nAsha,Delhi\nRavi,Mumbai":'[{"name":"Asha","city":"Delhi"}]'} rows={9} style={{width:"100%",marginTop:12,padding:15,border:"1px solid #dce7df",borderRadius:12,fontSize:14,lineHeight:1.6}}/></>}
 <button onClick={run} style={btn}>{kind==="uuid-generator"?"Generate UUIDs":kind==="csv-json-converter"?"Convert data":"Run conversion"}</button>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}{output&&<section style={{marginTop:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><b>Result</b><button onClick={copy} style={btn}>Copy result</button></div><textarea readOnly value={output} rows={Math.min(14,Math.max(4,output.split("\n").length))} style={{width:"100%",marginTop:10,padding:14,border:"1px solid #dce7df",borderRadius:10,fontSize:14,lineHeight:1.6}}/></section>}
 <p style={{fontSize:12,color:"#75847c",lineHeight:1.7,marginTop:22}}>This tool runs in your browser. Avoid pasting private tokens, passwords or confidential data on shared devices.</p></main>;
}
const btn:React.CSSProperties={marginTop:14,border:0,background:"#14634b",color:"#fff",padding:"12px 18px",borderRadius:8,fontWeight:700,cursor:"pointer"};
const field:React.CSSProperties={padding:11,border:"1px solid #d5e4da",borderRadius:8,background:"#fff",fontSize:14};
