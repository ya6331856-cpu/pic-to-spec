"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Mode="sql-json"|"json-diff";
const area={width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace"} as const;
const primary={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer"} as const;

function splitSql(source:string,separator:","|";"):string[]{
 const out:string[]=[];let start=0,quote="",depth=0;
 for(let i=0;i<source.length;i++){const ch=source[i];
  if(quote){if(ch===quote){if(source[i+1]===quote){i++;continue;}quote="";}else if(ch==="\\"&&quote!=="'")i++;continue;}
  if(ch==="'"||ch==='"'||ch="`"){quote=ch;continue;}
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
   if(ch==="'"||ch==='"'||ch="`"){quote=ch;continue;}
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
type Diff={path:string;kind:"Added"|"Removed"|"Changed";before?:unknown;after?:unknown};
function deepDiff(a:unknown,b:unknown,path="$",out:Diff[]=[]):Diff[]{
 if(Object.is(a,b))return out;
 if(a&&b&&typeof a==="object"&&typeof b==="object"&&Array.isArray(a)===Array.isArray(b)){
  const ak=Object.keys(a),bk=Object.keys(b),keys=Array.from(new Set([...ak,...bk]));
  for(const key of keys){const hasA=Object.prototype.hasOwnProperty.call(a,key),hasB=Object.prototype.hasOwnProperty.call(b,key);const p=Array.isArray(a)?path+"["+key+"]":path+"."+key;
   if(!hasA)out.push({path:p,kind:"Added",after:(b as Record<string,unknown>)[key]});
   else if(!hasB)out.push({path:p,kind:"Removed",before:(a as Record<string,unknown>)[key]});
   else deepDiff((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key],p,out);
  }return out;
 }
 out.push({path,kind:"Changed",before:a,after:b});return out;
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
 const [source,setSource]=useState(sqlSample),[left,setLeft]=useState(leftSample),[right,setRight]=useState(rightSample),[copied,setCopied]=useState(false);
 const result=useMemo(()=>{if(mode==="sql-json"){try{return {output:sqlToJson(source),error:"",diff:[] as Diff[]};}catch(e){return {output:"",error:e instanceof Error?e.message:"Could not convert SQL.",diff:[] as Diff[]};}}
  try{const a=JSON.parse(left),b=JSON.parse(right);return {output:"",error:"",diff:deepDiff(a,b)};}catch(e){return {output:"",error:e instanceof Error?e.message:"Invalid JSON input.",diff:[] as Diff[]};}
 },[mode,source,left,right]);
 const title=mode==="sql-json"?"SQL to JSON Converter":"JSON Diff Tool";
 async function copy(){const value=mode==="sql-json"?result.output:JSON.stringify(result.diff,null,2);try{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 function download(){const blob=new Blob([result.output],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="sql-data.json";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:1050,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>{mode==="sql-json"?"Turn basic SQL INSERT statements into JSON records. Supports multiple rows, quoted strings, numbers, NULL and boolean literals. Processing happens in your browser.":"Compare two JSON values and inspect added, removed and changed properties with exact paths. Nested objects and arrays are compared recursively."}</p>
  {mode==="sql-json"?<section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>SQL INSERT statements<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...area,minHeight:280}} placeholder="INSERT INTO users (id, name) VALUES (1, 'Aisha');"/></label>
   {result.error?<p role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24"}}>{result.error}</p>:<p role="status" style={{padding:12,borderRadius:9,background:"#eaf7ef",color:"#14634b",fontWeight:700}}>SQL parsed — JSON output is ready.</p>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>setSource(sqlSample)}>Load sample</button><button style={primary} onClick={copy} disabled={!result.output}>{copied?"Copied":"Copy JSON"}</button><button style={{...primary,background:"#334155"}} onClick={download} disabled={!result.output}>Download .json</button><button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>JSON output<textarea readOnly value={result.output} style={{...area,minHeight:260,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Limitations: this is a focused INSERT-values converter, not a SQL engine. It does not execute queries or evaluate functions, expressions, subqueries, DEFAULT, or dialect-specific syntax. SQL comments are ignored.</p>
  </section>:<section style={{display:"grid",gap:16,marginTop:24}}>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:14}}>
    <label style={{display:"grid",gap:8,fontWeight:700}}>Original JSON<textarea value={left} onChange={e=>setLeft(e.target.value)} spellCheck={false} style={{...area,minHeight:260}}/></label>
    <label style={{display:"grid",gap:8,fontWeight:700}}>Updated JSON<textarea value={right} onChange={e=>setRight(e.target.value)} spellCheck={false} style={{...area,minHeight:260}}/></label>
   </div>
   {result.error?<p role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24"}}>{result.error}</p>:<><p role="status" style={{padding:12,borderRadius:9,background:"#eaf7ef",color:"#14634b",fontWeight:700}}>{result.diff.length?result.diff.length+" difference(s) found.":"The JSON values are identical."}</p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>{setLeft(leftSample);setRight(rightSample);}}>Load sample</button><button style={primary} onClick={copy} disabled={!result.diff.length}>{copied?"Copied":"Copy diff"}</button><button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>{setLeft("");setRight("");}}>Clear</button></div>
    <div style={{display:"grid",gap:9}}>{result.diff.map((d,i)=><article key={d.path+"-"+i} style={{border:"1px solid #dce7df",borderRadius:10,padding:12,background:"#fff"}}><div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap"}}><b style={{color:d.kind==="Added"?"#147344":d.kind==="Removed"?"#b33a31":"#925c08"}}>{d.kind}</b><code style={{overflowWrap:"anywhere"}}>{d.path}</code></div>{d.kind!=="Added"&&<pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",fontSize:12,color:"#9b3832",marginBottom:4}}>- {JSON.stringify(d.before)}</pre>}{d.kind!=="Removed"&&<pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",fontSize:12,color:"#14634b",marginTop:4}}>+ {JSON.stringify(d.after)}</pre>}</article>)}</div>
   </>}
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Comparison is structural and type-sensitive. Object key order is ignored; array order matters. The tool compares parsed JSON values, not raw formatting or whitespace.</p>
  </section>}
 </main>;
}
