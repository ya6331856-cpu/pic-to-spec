"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
import {
  buildJsonDiff,
  createJsonDiffReport,
  type JsonDiffEntry,
} from "@/lib/json-diff.mjs";

type Mode="sql-json"|"json-diff";
const area={width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace"} as const;
const primary={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer"} as const;

function splitSql(source:string,separator:","|";"):string[]{
 const out:string[]=[];let start=0,quote="",depth=0;
 for(let i=0;i<source.length;i++){const ch=source[i];
  if(quote){if(ch===quote){if(source[i+1]===quote){i++;continue;}quote="";}else if(ch==="\\"&&quote!=="'")i++;continue;}
  if(ch==="'"||ch==='"'||ch==="`"){quote=ch;continue;}
  if(ch==="(")depth++;else if(ch===")")depth--;
  else if(ch===separator&&depth===0){out.push(source.slice(start,i).trim());start=i+1;}
 }
 out.push(source.slice(start).trim());return out.filter(Boolean);
}
function sqlLiteral(token:string):unknown{
 const t=token.trim();
 if(/^null$/i.test(t))return null;
 if(/^true$/i.test(t))return true;if(/^false$/i.test(t))return false;
 if((t.startsWith("'")&&t.endsWith("'"))||(t.startsWith('"')&&t.endsWith('"'))){
  const q=t[0];let v=t.slice(1,-1);
  if(q==="'")v=v.replace(/''/g,"'").replace(/\\'/g,"'");
  else v=v.replace(/\\"/g,'"').replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\t/g,"\t").replace(/\\\\/g,"\\");
  return v;
 }
 if(/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(t))return Number(t);
 if(/^0x[\da-f]+$/i.test(t))return Number.parseInt(t.slice(2),16);
 throw new Error("Unsupported SQL value: "+t+". Use strings, numbers, NULL, TRUE or FALSE; SQL functions and expressions are not evaluated.");
}
function sqlToJson(source:string):string{
 const cleaned=source.replace(/--[^\r\n]*/g,"").replace(/\/\*[\s\S]*?\*\//g,"");
 const statements=splitSql(cleaned.replace(/;\s*$/,""),";");const tables:Record<string,Record<string,unknown>[]>={};
 for(const statement of statements){
  const match=statement.match(/^\s*INSERT\s+INTO\s+([\w."\x60]+)\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+)$/i);
  if(!match)throw new Error("Only INSERT INTO table (columns) VALUES (...) statements are supported.");
  const table=match[1].replace(/["`]/g,"").split(".").pop()||match[1];
  const columns=splitSql(match[2],",").map(c=>c.trim().replace(/^["`]|["`]$/g,""));
  if(!columns.length||columns.some(c=>!c))throw new Error("Every INSERT statement needs column names.");
  const rowsText=match[3];let groups:string[]=[];let depth=0,quote="",start=-1;
  for(let i=0;i<rowsText.length;i++){const ch=rowsText[i];
   if(quote){if(ch===quote){if(rowsText[i+1]===quote){i++;continue;}quote="";}else if(ch==="\\"&&quote!=="'")i++;continue;}
   if(ch==="'"||ch==='"'||ch==="`"){quote=ch;continue;}
   if(ch==="("){if(depth===0)start=i+1;depth++;}
   else if(ch===")"){depth--;if(depth===0&&start>=0){groups.push(rowsText.slice(start,i));start=-1;}}
   else if(depth===0&&!/[\s,;]/.test(ch))throw new Error("Unexpected text after VALUES rows: "+rowsText.slice(i));
  }
  if(depth!==0||quote)throw new Error("Unclosed quote or parentheses in VALUES.");
  if(!groups.length)throw new Error("No VALUES rows found.");
  for(const group of groups){const values=splitSql(group,",");if(values.length!==columns.length)throw new Error("Column/value count mismatch in table "+table+".");
   const row:Record<string,unknown>={};columns.forEach((c,i)=>{row[c]=sqlLiteral(values[i]);});(tables[table]??=[]).push(row);
  }
 }
 return JSON.stringify(tables,null,2);
}
const sqlSample=`INSERT INTO users (id, name, active, score) VALUES
(1, 'Aisha', TRUE, 98.5),
(2, 'Rahul', FALSE, NULL);
INSERT INTO users (id, name, active, score) VALUES
(3, 'Mina', TRUE, 87);`;
const leftSample=`{
  "name": "PicToSpec",
  "tools": ["JSON", "CSS"],
  "active": true,
  "version": 1
}`;
const rightSample=`{
  "name": "PicToSpec",
  "tools": ["JSON", "XML"],
  "active": true,
  "description": "Online tools",
  "version": 2
}`;
export default function DataCompareTool({mode}:{mode:Mode}){
 const [source,setSource]=useState(sqlSample);
 const [left,setLeft]=useState(leftSample);
 const [right,setRight]=useState(rightSample);
 const [copied,setCopied]=useState(false);
 const [copiedPath,setCopiedPath]=useState("");
 const [diffFilter,setDiffFilter]=useState<"All"|"Added"|"Removed"|"Changed"|"Type changed">("All");
 const [pathSearch,setPathSearch]=useState("");

 const result=useMemo(()=>{
  if(mode==="sql-json"){
   try{return {output:sqlToJson(source),error:"",diff:[] as JsonDiffEntry[]};}
   catch(e){return {output:"",error:e instanceof Error?e.message:"Could not convert SQL.",diff:[] as JsonDiffEntry[]};}
  }
  let before:unknown;
  let after:unknown;
  try{before=JSON.parse(left);}
  catch(e){return {output:"",error:"Original JSON: "+(e instanceof Error?e.message:"Invalid JSON input."),diff:[] as JsonDiffEntry[]};}
  try{after=JSON.parse(right);}
  catch(e){return {output:"",error:"Updated JSON: "+(e instanceof Error?e.message:"Invalid JSON input."),diff:[] as JsonDiffEntry[]};}
  return {output:"",error:"",diff:buildJsonDiff(before,after)};
 },[mode,source,left,right]);

 const title=mode==="sql-json"?"SQL to JSON Converter":"JSON Diff Tool";
 const summary=useMemo(()=>({
  total:result.diff.length,
  added:result.diff.filter(item=>item.kind==="Added").length,
  removed:result.diff.filter(item=>item.kind==="Removed").length,
  changed:result.diff.filter(item=>item.kind==="Changed").length,
  typeChanged:result.diff.filter(item=>item.kind==="Type changed").length,
 }),[result.diff]);
 const visibleDiff=useMemo(()=>result.diff.filter(item=>{
  const matchesKind=diffFilter==="All"||item.kind===diffFilter;
  const query=pathSearch.trim().toLocaleLowerCase();
  const matchesPath=!query||item.path.toLocaleLowerCase().includes(query)||item.pointer.toLocaleLowerCase().includes(query);
  return matchesKind&&matchesPath;
 }),[result.diff,diffFilter,pathSearch]);

 async function copy(){
  const value=mode==="sql-json"?result.output:JSON.stringify(createJsonDiffReport(result.diff),null,2);
  try{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}
  catch{setCopied(false);}
 }
 function download(){
  const content=mode==="sql-json"?result.output:JSON.stringify(createJsonDiffReport(result.diff),null,2);
  const blob=new Blob([content],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=mode==="sql-json"?"sql-data.json":"pictospec-json-diff-report.json";
  a.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function formatBoth(){
  try{
   setLeft(JSON.stringify(JSON.parse(left),null,2));
   setRight(JSON.stringify(JSON.parse(right),null,2));
  }catch{
   // The live validation panel identifies the input that needs correction.
  }
 }
 async function copyPath(pointer:string){
  try{
   await navigator.clipboard.writeText(pointer);
   setCopiedPath(pointer||"$");
   window.setTimeout(()=>setCopiedPath(""),1400);
  }catch{setCopiedPath("");}
 }

 return <main style={{maxWidth:1050,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>{mode==="sql-json"?"Turn basic SQL INSERT statements into JSON records. Supports multiple rows, quoted strings, numbers, NULL and boolean literals. Processing happens in your browser.":"Compare two JSON documents structurally. Find added, removed, changed and type-changed values with JSONPath-style locations and RFC 6901 JSON Pointer paths. Comparison runs in your browser."}</p>

  {mode==="sql-json"?<section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>SQL INSERT statements<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...area,minHeight:280}} placeholder="INSERT INTO users (id, name) VALUES (1, 'Aisha');"/></label>
   {result.error?<p role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24"}}>{result.error}</p>:<p role="status" style={{padding:12,borderRadius:9,background:"#eaf7ef",color:"#14634b",fontWeight:700}}>SQL parsed — JSON output is ready.</p>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>setSource(sqlSample)}>Load sample</button><button style={primary} onClick={copy} disabled={!result.output}>{copied?"Copied":"Copy JSON"}</button><button style={{...primary,background:"#334155"}} onClick={download} disabled={!result.output}>Download .json</button><button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>JSON output<textarea readOnly value={result.output} style={{...area,minHeight:260,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Limitations: this is a focused INSERT-values converter, not a SQL engine. It does not execute queries or evaluate functions, expressions, subqueries, DEFAULT, or dialect-specific syntax. SQL comments are ignored.</p>
  </section>:<section className="json-diff-workspace">
   <div className="json-diff-topbar">
    <div><span className="json-diff-eyebrow">LIVE STRUCTURAL COMPARISON</span><b>Compare original and updated JSON</b></div>
    <div className="json-diff-toolbar">
     <button type="button" onClick={()=>{setLeft(leftSample);setRight(rightSample);setDiffFilter("All");setPathSearch("");}}>Load example</button>
     <button type="button" onClick={()=>{setLeft(right);setRight(left);}}>Swap sides</button>
     <button type="button" onClick={formatBoth}>Format both</button>
     <button type="button" onClick={()=>{setLeft("");setRight("");setPathSearch("");setDiffFilter("All");}}>Clear</button>
    </div>
   </div>
   <div className="json-diff-input-grid">
    <label className="json-diff-input-card">
     <span><b>01 · Original JSON</b><small>Before the change</small></span>
     <textarea aria-label="Original JSON" value={left} onChange={e=>setLeft(e.target.value)} spellCheck={false} placeholder='Paste original JSON, for example {"status":"draft"}'/>
     <button type="button" className="json-diff-format-button" onClick={()=>{try{setLeft(JSON.stringify(JSON.parse(left),null,2));}catch{}}}>Format original</button>
    </label>
    <label className="json-diff-input-card">
     <span><b>02 · Updated JSON</b><small>After the change</small></span>
     <textarea aria-label="Updated JSON" value={right} onChange={e=>setRight(e.target.value)} spellCheck={false} placeholder='Paste updated JSON, for example {"status":"published"}'/>
     <button type="button" className="json-diff-format-button" onClick={()=>{try{setRight(JSON.stringify(JSON.parse(right),null,2));}catch{}}}>Format updated</button>
    </label>
   </div>
   {result.error?<p className="json-diff-error" role="alert">{result.error}</p>:<>
    <div className="json-diff-status" role="status">
     {summary.total ? summary.total+" difference"+(summary.total===1?"":"s")+" found between the two JSON values." : "The two JSON values are identical."}
    </div>
    <div className="json-diff-summary" aria-label="Difference summary">
     <div><b>{summary.total}</b><span>Total differences</span></div>
     <div className="is-added"><b>{summary.added}</b><span>Added</span></div>
     <div className="is-removed"><b>{summary.removed}</b><span>Removed</span></div>
     <div className="is-changed"><b>{summary.changed}</b><span>Changed</span></div>
     <div className="is-type"><b>{summary.typeChanged}</b><span>Type changed</span></div>
    </div>
    <div className="json-diff-actions">
     <button type="button" onClick={copy} disabled={!summary.total}>{copied?"Copied report":"Copy JSON report"}</button>
     <button type="button" onClick={download} disabled={!summary.total}>Download report ↓</button>
    </div>
    {summary.total>0?<div className="json-diff-results">
     <div className="json-diff-filter-row">
      <div className="json-diff-filter-buttons" aria-label="Filter differences">
       {(["All","Added","Removed","Changed","Type changed"] as const).map(filter=><button type="button" key={filter} aria-pressed={diffFilter===filter} className={diffFilter===filter?"active":""} onClick={()=>setDiffFilter(filter)}>{filter}</button>)}
      </div>
      <input value={pathSearch} onChange={e=>setPathSearch(e.target.value)} aria-label="Filter by JSON path" placeholder="Find a path…"/>
     </div>
     <p className="json-diff-result-count">Showing {visibleDiff.length} of {summary.total} differences. Filters do not change the downloaded report.</p>
     <div className="json-diff-list">
      {visibleDiff.map((item,index)=>{
       const tone=item.kind==="Added"?"added":item.kind==="Removed"?"removed":item.kind==="Type changed"?"type":"changed";
       const pathKey=item.pointer||"$";
       return <article className={`json-diff-item ${tone}`} key={item.pointer+"-"+index}>
        <div className="json-diff-item-head">
         <span className="json-diff-kind">{item.kind}</span>
         <code>{item.path}</code>
         <button type="button" onClick={()=>copyPath(item.pointer)}>{copiedPath===pathKey?"Copied":"Copy pointer"}</button>
        </div>
        <div className="json-diff-pointer">JSON Pointer: <code>{item.pointer||"(root value)"}</code></div>
        {item.kind!=="Added"&&<div className="json-diff-value before"><span>Before</span><pre>{JSON.stringify(item.before,null,2)}</pre></div>}
        {item.kind!=="Removed"&&<div className="json-diff-value after"><span>After</span><pre>{JSON.stringify(item.after,null,2)}</pre></div>}
       </article>;
      })}
      {visibleDiff.length===0&&<p className="json-diff-empty">No differences match these filters.</p>}
     </div>
    </div>:null}
   </>}
   <p className="json-diff-limitations">Comparison is structural and type-sensitive. Object key order and whitespace are ignored; arrays are compared by index. JavaScript parses JSON numbers as Number values, so identifiers or decimal values beyond JavaScript's safe precision should be checked with a precision-preserving tool. Duplicate object keys are not preserved by JSON.parse.</p>
   <p className="json-diff-privacy">Privacy: both inputs are parsed and compared locally in this browser. They are not sent to a PicToSpec processing server.</p>
  </section>}
 </main>;
}
