"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";
type Row=Record<string,string>;
function flatten(element:Element,prefix=""):Row{
 const out:Row={}; for(const a of Array.from(element.attributes))out[prefix+"@"+a.name]=a.value;
 const children=Array.from(element.children); const text=Array.from(element.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||"").join("").trim();
 if(!children.length&&text)out[prefix?prefix+"#text":"text"]=text;
 const groups=new Map<string,Element[]>(); for(const child of children)groups.set(child.tagName,[...(groups.get(child.tagName)||[]),child]);
 for(const [name,nodes] of groups){const key=prefix?prefix+"."+name:name;if(nodes.length>1)out[key]=JSON.stringify(nodes.map(n=>flatten(n)));else{const nested=flatten(nodes[0],key);if(Object.keys(nested).length)Object.assign(out,nested);else out[key]=nodes[0].textContent?.trim()||"";}}
 if(text&&children.length)out[prefix?prefix+"#text":"text"]=text;return out;
}
function cell(v:string){return /[",\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
function convertXml(source:string){
 if(/<!DOCTYPE|<!ENTITY/i.test(source))throw new Error("DOCTYPE and custom entity declarations are not supported. Remove them and try again.");
 const doc=new DOMParser().parseFromString(source,"application/xml");if(doc.querySelector("parsererror"))throw new Error("Invalid XML. Check that all tags are properly closed and nested.");
 const root=doc.documentElement;if(!root)throw new Error("No XML root element was found.");const children=Array.from(root.children);
 const records=children.length>1&&children.every(n=>n.tagName===children[0].tagName)?children:[root];const rows=records.map(n=>flatten(n));const headers=Array.from(new Set(rows.flatMap(r=>Object.keys(r))));
 if(!headers.length)throw new Error("No element text or attributes were found to export.");
 return [headers.map(cell).join(","),...rows.map(r=>headers.map(h=>cell(r[h]??"")).join(","))].join("\r\n");
}
const sample=`<?xml version="1.0"?>
<products>
 <product id="101"><name>Notebook</name><price>4.50</price><category>Stationery</category></product>
 <product id="102"><name>Pen, blue</name><price>1.25</price><category>Stationery</category></product>
</products>`;
export default function XmlToCsvTool(){
 const [input,setInput]=useState(sample),[output,setOutput]=useState(""),[error,setError]=useState("");
 function run(){try{setError("");setOutput(convertXml(input));}catch(e){setOutput("");setError(e instanceof Error?e.message:"Could not convert XML.");}}
 async function copy(){try{await navigator.clipboard.writeText(output);}catch{setError("Clipboard access failed. Select the result and copy it manually.");}}
 function download(){const url=URL.createObjectURL(new Blob([output],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="pictospec-xml-export.csv";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:900,margin:"40px auto",padding:20,color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>XML to CSV Converter</h1><p style={{color:"#66776d",lineHeight:1.7}}>Convert repeated XML records into spreadsheet-ready CSV. Element names become columns, attributes use an @ prefix and nested values use dotted column names.</p>
 <label style={{display:"block",fontWeight:700,marginTop:22}}>XML input</label><textarea aria-label="XML input" value={input} onChange={e=>{setInput(e.target.value);setOutput("");setError("");}} rows={13} spellCheck={false} style={{width:"100%",marginTop:9,padding:15,border:"1px solid #dce7df",borderRadius:12,fontSize:14,lineHeight:1.6,fontFamily:"monospace"}}/>
 <div style={{display:"flex",gap:9,flexWrap:"wrap",marginTop:12}}><button onClick={run} style={btn}>Convert to CSV</button><button onClick={()=>{setInput(sample);setOutput("");setError("");}} style={secondary}>Load sample</button><button onClick={()=>{setInput("");setOutput("");setError("");}} style={secondary}>Clear</button></div>{error&&<p role="alert" style={{color:"#b42318"}}>{error}</p>}
 {output&&<section style={{marginTop:22}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}><b>CSV result</b><div style={{display:"flex",gap:8}}><button onClick={copy} style={secondary}>Copy CSV</button><button onClick={download} style={btn}>Download .csv ↓</button></div></div><textarea aria-label="CSV output" readOnly value={output} rows={Math.min(16,Math.max(5,output.split("\n").length))} style={{width:"100%",marginTop:10,padding:14,border:"1px solid #dce7df",borderRadius:10,fontSize:14,lineHeight:1.6,fontFamily:"monospace"}}/></section>}
 <p style={{fontSize:12,color:"#718078",lineHeight:1.7,marginTop:22}}>Your XML is processed locally in this browser. No file is uploaded. DOCTYPE and custom entity declarations are rejected.</p><section className="tool-content"><h2>How XML to CSV conversion works</h2><p>Repeated sibling elements under the root are treated as table rows. Child elements become columns; attributes use an @ prefix and nested paths use dot notation.</p><h3>Example</h3><pre><code>{sample}</code></pre><h3>How to use</h3><ol><li>Paste XML with a root element.</li><li>Group records as repeated child elements with the same name.</li><li>Convert and review the generated column headings.</li><li>Copy or download the CSV for your spreadsheet.</li></ol><h3>Important limitations</h3><p>XML is hierarchical while CSV is tabular. Repeated nested elements are represented as JSON text inside a cell. Mixed content and complex namespaces may need manual cleanup; empty elements become empty cells. The tool does not execute XML content or fetch external entities.</p><h3>Frequently asked questions</h3><details><summary>Can I open the result in Excel?</summary><p>Yes. Download the CSV and open it in Excel, Google Sheets or another spreadsheet app. Review column types after import.</p></details><details><summary>Are XML attributes included?</summary><p>Yes. Attributes are exported as columns prefixed with @, such as @id.</p></details></section></main>;
}
const btn:React.CSSProperties={border:0,background:"#14634b",color:"#fff",padding:"12px 18px",borderRadius:9,fontWeight:700,cursor:"pointer"};
const secondary:React.CSSProperties={border:"1px solid #d5e4da",background:"#fff",color:"#234b39",padding:"11px 15px",borderRadius:9,fontWeight:700,cursor:"pointer"};
