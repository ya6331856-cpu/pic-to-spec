"use client";
import { useEffect, useState } from "react";
import UuidGeneratorGuide from "@/components/UuidGeneratorGuide";
import ToolSearch from "@/components/ToolSearch";
import { parseCsv, toCsv } from "@/lib/csv-conversion.mjs";

type Kind = "url-encoder-decoder" | "csv-json-converter" | "uuid-generator";
const details: Record<Kind,{title:string;description:string}> = {
 "url-encoder-decoder": {title:"URL Encoder and Decoder",description:"Encode special characters for URLs or decode percent-encoded text. Choose full URL or URL component mode."},
 "csv-json-converter": {title:"CSV to JSON Converter",description:"Convert CSV rows into JSON objects or turn JSON arrays into CSV. Supports quoted commas, quotes and line breaks."},
 "uuid-generator": {title:"Online UUID Generator",description:"Generate random UUID v4 identifiers online. Create a single ID or a batch of up to 100 random UUIDs, then copy them instantly."}
};
const guides:Record<Kind,{example:string;steps:string[];tips:string[];caveat:string}> = {
 "url-encoder-decoder":{
  example:"A space in a query value is commonly represented as %20 when percent-encoded. For example, “hello world” becomes “hello%20world” with component encoding.",
  steps:["Choose encode or decode.","Choose URL component mode for an individual value, or full URL mode when you need URL-level encoding.","Paste the text and run the conversion.","Check the result in the application or URL where it will be used."],
  tips:["Use component encoding for query parameters and individual values; it safely encodes reserved characters within that value.","Do not repeatedly encode already encoded text unless double encoding is intended.","Keep the URL scheme, host and path structure intact when building a complete web address."],
  caveat:"URL encoding is not encryption and does not make a private URL secure. Decoding can fail when percent escapes are incomplete or malformed. The tool does not verify that a URL exists or is safe to visit."
 },
 "csv-json-converter":{
  example:'CSV rows such as name,city followed by Asha,Delhi can be converted into a JSON array of objects with name and city properties. In the reverse direction, an array of objects can be exported as CSV columns.',
  steps:["Choose CSV to JSON or JSON to CSV.","Paste data with a header row for CSV input, or an array of objects for JSON input.","Run conversion and read any validation message carefully.","Review column names, empty values, quotes and line breaks in the output before importing it elsewhere."],
  tips:["Use unique column headers so each value maps to one JSON property.","Quote CSV fields that contain commas, double quotes or line breaks.","Keep each CSV data row aligned with the header column count.","When opening exported CSV in spreadsheet software, leave formula-safety enabled unless you have a trusted reason to disable it."],
  caveat:"The converter supports common CSV quoting rules and JSON arrays of objects. It does not infer data types: CSV values become strings. Spreadsheet formula protection adds a leading apostrophe to formula-like values, but spreadsheet applications can handle imported data differently; review untrusted files before opening."
 },
 "uuid-generator":{
  example:"An online UUID generator creates random version 4 identifiers for apps, databases, test records and development workflows. A UUID v4 has 128 bits; its version and variant fields follow the UUID format. Example: 550e8400-e29b-41d4-a716-446655440000.",
  steps:["Choose how many random UUIDs you need, from 1 to 100.","Select Generate UUIDs to create version 4 identifiers using your browser cryptographic random API.","Use Copy result to copy the generated UUID list.","Paste the identifiers into your app, database seed, test data or development workflow."],
  tips:["Use this random UUID generator for identifiers, test records and application data—not as a password or authentication secret.","A standard UUID string contains hexadecimal characters and hyphens in an 8-4-4-4-12 pattern.","Check whether your database expects UUID values in a native UUID column or as text.","UUIDs make accidental collisions very unlikely, but they do not prove identity or authenticity."],
  caveat:"This page generates random version 4 UUIDs using the browser cryptographic random API when available. UUIDs are designed to make collisions very unlikely, not mathematically impossible. They are not a substitute for access control or secret management."
 }
};
export default function DeveloperTool({kind,initialMode}:{kind:Kind;initialMode?:"csv-json"|"json-csv"}){
 const [input,setInput]=useState("");const [output,setOutput]=useState("");const [error,setError]=useState("");const [mode,setMode]=useState(kind==="csv-json-converter"?(initialMode||"csv-json"):"encode");const [urlMode,setUrlMode]=useState("component");const [count,setCount]=useState("5");
 const [uppercase,setUppercase]=useState(false);const [removeHyphens,setRemoveHyphens]=useState(false);const [braces,setBraces]=useState(false);
 const [generatedUuids,setGeneratedUuids]=useState<string[]>([]);const [copied,setCopied]=useState(false);
 const [spreadsheetSafe,setSpreadsheetSafe]=useState(true);const [delimiter,setDelimiter]=useState(",");const [flattenNested,setFlattenNested]=useState(false); const [bom,setBom]=useState(false);
 useEffect(()=>{
  if(kind!=="uuid-generator"||generatedUuids.length===0)return;
  const formatted=generatedUuids.map(id=>{
   let value=removeHyphens?id.replace(/-/g,""):id;
   if(uppercase)value=value.toUpperCase();
   if(braces)value="{"+value+"}";
   return value;
  });
  setOutput(formatted.join("\n"));
 },[kind,generatedUuids,uppercase,removeHyphens,braces]);
 function run(){setError("");setOutput("");try{
  if(kind==="url-encoder-decoder"){const value=mode==="encode"?(urlMode==="full"?encodeURI(input):encodeURIComponent(input)):(urlMode==="full"?decodeURI(input.trim()):decodeURIComponent(input.trim()));setOutput(value);}
  else if(kind==="csv-json-converter"){if(!input.trim())throw new Error("Paste CSV or JSON data first.");if(mode==="csv-json"){const rows=parseCsv(input,delimiter);if(rows.length<2)throw new Error("Add a header row and at least one data row.");const headers=rows[0].map((h,i)=>h.trim()||"column_"+(i+1));if(new Set(headers).size!==headers.length)throw new Error("Column names must be unique. Rename duplicate headers and try again.");const mismatched=rows.slice(1).findIndex(row=>row.length!==headers.length);if(mismatched!==-1)throw new Error("CSV row "+(mismatched+2)+" has a different number of columns than the header row.");const objects=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]])));setOutput(JSON.stringify(objects,null,2));}else{const parsed=JSON.parse(input);setOutput(toCsv(parsed,spreadsheetSafe,{delimiter,flattenNested,bom}));}}
  else{
   const n=Number(count);
   if(!Number.isInteger(n)||n<1||n>100)throw new Error("Enter a whole number from 1 to 100.");
   if(!globalThis.crypto?.getRandomValues)throw new Error("Secure random generation is not available in this browser.");
   const ids=Array.from({length:n},()=>globalThis.crypto.randomUUID?globalThis.crypto.randomUUID():fallbackUuid());
   setGeneratedUuids(ids);
  }
 }catch(e){setError(e instanceof Error?e.message:"Could not process this input.");}}
 function download(){
  const isCsv=kind==="csv-json-converter"&&mode==="json-csv";
  const blob=new Blob([output],{type:isCsv?"text/csv;charset=utf-8":"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=isCsv?"pictospec-export.csv":"pictospec-export.json";a.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function downloadUuid(format:"txt"|"json"){
  const values=output.split("\n").filter(Boolean);
  const content=format==="json"?JSON.stringify(values,null,2):output+"\n";
  const blob=new Blob([content],{type:format==="json"?"application/json;charset=utf-8":"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="pictospec-uuids."+format;a.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
  function fallbackUuid(){const b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);}
 async function copy(){
  try{
   await navigator.clipboard.writeText(output);
   setCopied(true);
   window.setTimeout(()=>setCopied(false),1600);
  }catch{setError("Clipboard access failed. Select the result and copy it manually.");}
 }
 return <main style={{maxWidth:850,margin:"40px auto",padding:"20px",color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>{details[kind].title}</h1><p style={{color:"#75847c",lineHeight:1.7}}>{details[kind].description}</p>
 {kind==="uuid-generator"?<section style={{display:"grid",gap:16,marginTop:22}}>
  <label style={{display:"grid",gap:8,fontWeight:700}}>Number of UUIDs
   <input type="number" min="1" max="100" value={count} onChange={e=>setCount(e.target.value)} style={{...field,width:"100%"}}/>
   <small style={{fontWeight:400,color:"#75847c"}}>Generate between 1 and 100 random UUID v4 identifiers in one batch.</small>
  </label>
  <div style={{display:"grid",gap:10,padding:15,border:"1px solid #dce7df",borderRadius:12,background:"#f8fbf8"}}>
   <b>Output format</b>
   <label style={{display:"flex",gap:9,alignItems:"center",fontWeight:500,fontSize:14}}><input type="checkbox" checked={uppercase} onChange={e=>setUppercase(e.target.checked)}/> Uppercase letters</label>
   <label style={{display:"flex",gap:9,alignItems:"center",fontWeight:500,fontSize:14}}><input type="checkbox" checked={removeHyphens} onChange={e=>setRemoveHyphens(e.target.checked)}/> Remove hyphens</label>
   <label style={{display:"flex",gap:9,alignItems:"center",fontWeight:500,fontSize:14}}><input type="checkbox" checked={braces} onChange={e=>setBraces(e.target.checked)}/> Wrap in braces (GUID-style)</label>
  </div>
  <p style={{margin:0,fontSize:12,lineHeight:1.6,color:"#75847c"}}>UUIDs are generated in this browser using cryptographic randomness. Formatting options only change how each identifier is displayed.</p>
 </section>:<><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:22}}>{kind==="url-encoder-decoder"?<><select value={mode} onChange={e=>setMode(e.target.value)} style={field}><option value="encode">Encode</option><option value="decode">Decode</option></select><select value={urlMode} onChange={e=>setUrlMode(e.target.value)} style={field}><option value="component">URL component</option><option value="full">Full URL</option></select></>:<select value={mode} onChange={e=>setMode(e.target.value)} style={field}><option value="csv-json">CSV to JSON</option><option value="json-csv">JSON to CSV</option></select>}</div>{kind==="csv-json-converter"&&mode==="json-csv"&&<label style={{display:"flex",gap:9,alignItems:"flex-start",marginTop:12,fontSize:13,lineHeight:1.5,color:"#557361"}}><input type="checkbox" checked={spreadsheetSafe} onChange={e=>setSpreadsheetSafe(e.target.checked)}/> Make CSV safer for Excel and spreadsheet apps (adds a leading apostrophe to formula-like cells)</label>}<textarea value={input} onChange={e=>{setInput(e.target.value);setOutput("");setError("");}} placeholder={kind==="url-encoder-decoder"?"Paste text or a URL here…":mode==="csv-json"?"name,city\nAsha,Delhi\nRavi,Mumbai":'[{"name":"Asha","city":"Delhi"}]'} rows={9} style={{width:"100%",marginTop:12,padding:15,border:"1px solid #dce7df",borderRadius:12,fontSize:14,lineHeight:1.6}}/></>}
 <button onClick={run} style={btn}>{kind==="uuid-generator"?"Generate UUIDs":kind==="csv-json-converter"?"Convert data":"Run conversion"}</button>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}{output&&<section style={{marginTop:20,padding:16,border:"1px solid #dce7df",borderRadius:14,background:"#fff"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
   <div><b>{kind==="uuid-generator"?"Generated UUIDs":"Result"}</b>{kind==="uuid-generator"&&<small style={{display:"block",marginTop:4,color:"#75847c"}}>{output.split("\n").filter(Boolean).length} identifier(s) ready</small>}</div>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <button onClick={copy} style={btn}>{copied?(kind==="uuid-generator"?"Copied!":"Copied"):(kind==="uuid-generator"?"Copy all":"Copy result")}</button>
    {kind==="csv-json-converter"&&<button onClick={download} style={btn}>Download {mode==="json-csv"?"CSV":"JSON"} ↓</button>}
    {kind==="uuid-generator"&&<><button onClick={()=>downloadUuid("txt")} style={btn}>Download .txt ↓</button><button onClick={()=>downloadUuid("json")} style={btn}>Download .json ↓</button></>}
   </div>
  </div>
  <textarea aria-label={kind==="uuid-generator"?"Generated UUID list":"Conversion result"} readOnly value={output} rows={Math.min(14,Math.max(4,output.split("\n").length))} style={{width:"100%",marginTop:10,padding:14,border:"1px solid #dce7df",borderRadius:10,fontSize:14,lineHeight:1.6}}/>
 </section>}
 <p style={{fontSize:12,color:"#75847c",lineHeight:1.7,marginTop:22}}>This tool runs in your browser. Avoid pasting private tokens, passwords or confidential data on shared devices.</p>{kind==="uuid-generator"?<UuidGeneratorGuide />:<><section className="tool-content"><h2>{details[kind].title}: practical guide</h2><p>{details[kind].description} Your input is processed locally in this browser session.</p><h3>Example</h3><p>{guides[kind].example}</p><h3>How to use this tool</h3><ol>{guides[kind].steps.map(step=><li key={step}>{step}</li>)}</ol><h3>Tips for accurate results</h3><ul>{guides[kind].tips.map(tip=><li key={tip}>{tip}</li>)}</ul><h3>Important limitations</h3><p>{guides[kind].caveat}</p><h3>Frequently asked questions</h3>{(kind==="url-encoder-decoder"?[{q:"When should I use URL component encoding?",a:"Use component encoding for an individual query value or piece of text. Full URL encoding is intended for a complete URL and preserves URL separators."},{q:"Why can decoding fail?",a:"A malformed percent escape is not valid encoded text. Check that the source string is complete and has valid percent-encoded bytes."}]:kind==="csv-json-converter"?[{q:"Does the CSV converter support quoted commas?",a:"Yes. Quoted fields can contain commas, line breaks and escaped double quotes. Every data row must have the same number of columns as the header."},{q:"Can JSON be converted to CSV?",a:"Yes. Choose JSON to CSV and provide an array of objects. Object keys are used as the CSV column headings."}]:[{q:"Is this an online random UUID generator?",a:"Yes. It creates random version 4 UUID identifiers directly in your browser using the browser cryptographic random API."},{q:"Can I generate multiple UUIDs at once?",a:"Yes. Choose any whole number from 1 to 100, generate the list and copy all identifiers together."},{q:"Can I use a UUID as a password?",a:"No. UUIDs are identifiers, not a replacement for passwords, access tokens or authentication secrets."}]).map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section><section className="tool-content"><h3>Related tools</h3><ul>{(kind==="uuid-generator"?[{label:"JSON Formatter and Validator",href:"/json-formatter"},{label:"JSON Diff Tool",href:"/json-diff"},{label:"Password Generator",href:"/password-generator"}]:kind==="csv-json-converter"?[{label:"XML to CSV Converter",href:"/xml-to-csv-converter"},{label:"JSON to CSV Converter",href:"/json-to-csv-converter"},{label:"JSON to Excel Converter",href:"/json-to-excel-converter"}]:[{label:"URL Parser",href:"/url-parser"},{label:"URL Slug Generator",href:"/url-slug-generator"},{label:"Base64 Encoder and Decoder",href:"/base64-encoder-decoder"}]).map(link=><li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></section></> }</main>;
}
const btn:React.CSSProperties={marginTop:14,border:0,background:"#14634b",color:"#fff",padding:"12px 18px",borderRadius:8,fontWeight:700,cursor:"pointer"};
const field:React.CSSProperties={padding:11,border:"1px solid #d5e4da",borderRadius:8,background:"#fff",fontSize:14};
