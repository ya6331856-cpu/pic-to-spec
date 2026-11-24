"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Mode="yaml"|"xml";
const area={width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace"} as const;
const primary={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer"} as const;

function validateYamlSubset(source:string):string[]{
 const errors:string[]=[];const lines=source.replace(/^\uFEFF/,"").split(/\r?\n/);
 const stack:{indent:number;keys:Set<string>}[]=[{indent:-1,keys:new Set()}];
 for(let i=0;i<lines.length;i++){
  const raw=lines[i];if(!raw.trim()||raw.trimStart().startsWith("#")||raw.trim()==="---"||raw.trim()==="...")continue;
  const line=i+1;
  if(raw.includes("\t")){errors.push("Line "+line+": tabs are not allowed for YAML indentation; use spaces.");continue;}
  const indent=raw.length-raw.trimStart().length;
  if(indent%2!==0)errors.push("Line "+line+": use consistent 2-space indentation.");
  const text=raw.trim();
  let quote:"'"|"\""|null=null,escaped=false,colon=-1;
  for(let j=0;j<text.length;j++){
   const ch=text[j];
   if(quote==='"'&&escaped){escaped=false;continue;}
   if(quote==='"'&&ch==="\\"){escaped=true;continue;}
   if((ch==="'"||ch==='"')&&(!quote||quote===ch)){quote=quote?null:ch;continue;}
   if(ch===":"&&!quote&&(j===text.length-1||/\s/.test(text[j+1]))){colon=j;break;}
  }
  if(quote){errors.push("Line "+line+": quoted value is not closed.");continue;}
  const isList=text==="-"||text.startsWith("- ");
  if(!isList&&colon<1&&!/^(\?|:)(\s|$)/.test(text)){
   errors.push("Line "+line+": expected a mapping key followed by ':'.");continue;
  }
  if(colon>0){
   const key=text.slice(0,colon).trim();
   if(!key){errors.push("Line "+line+": mapping key cannot be empty.");continue;}
   while(stack.length>1&&indent<=stack[stack.length-1].indent)stack.pop();
   const parent=stack[stack.length-1];
   if(parent.keys.has(key))errors.push("Line "+line+": duplicate key '"+key+"'.");
   parent.keys.add(key);
   if(text.slice(colon+1).trim()==="")stack.push({indent,keys:new Set()});
  }else if(isList){
   while(stack.length>1&&indent<stack[stack.length-1].indent)stack.pop();
  }
 }
 return errors;
}
function xmlNodeToValue(node:Element):unknown{
 const result:Record<string,unknown>={};
 if(node.attributes.length){const attrs:Record<string,string>={};Array.from(node.attributes).forEach(a=>attrs[a.name]=a.value);result["@attributes"]=attrs;}
 const children=Array.from(node.children);
 const text=Array.from(node.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||"").join("").trim();
 if(children.length){
  for(const child of children){const value=xmlNodeToValue(child);if(Object.prototype.hasOwnProperty.call(result,child.tagName)){const old=result[child.tagName];result[child.tagName]=Array.isArray(old)?[...old,value]:[old,value];}else result[child.tagName]=value;}
  if(text)result["#text"]=text;
  return result;
 }
 if(Object.keys(result).length)return text?{...result,"#text":text}:result;
 return text;
}
function xmlToJson(source:string):string{
 if(!source.trim())throw new Error("Paste an XML document to convert.");
 if(/<!\s*(DOCTYPE|ENTITY)\b/i.test(source))throw new Error("DOCTYPE and custom entity declarations are not supported for security reasons.");
 const doc=new DOMParser().parseFromString(source,"application/xml");
 const error=doc.querySelector("parsererror");
 if(error)throw new Error("Invalid XML: "+(error.textContent||"Check tag names, closing tags and attributes."));
 const root=doc.documentElement;
 if(!root||root.tagName==="parsererror")throw new Error("XML must contain one root element.");
 return JSON.stringify({[root.tagName]:xmlNodeToValue(root)},null,2);
}
const yamlSample=`# Example YAML
name: PicToSpec
active: true
tools:
  - JSON
  - CSS
  - HTML
limits:
  free: 10
  pro: null
`;
const xmlSample=`<?xml version="1.0"?>
<catalog>
  <item id="1">
    <name>Image Compressor</name>
    <active>true</active>
  </item>
  <item id="2">
    <name>JSON Formatter</name>
    <active>true</active>
  </item>
</catalog>`;
export default function ValidationConversionTool({mode}:{mode:Mode}){
 const [source,setSource]=useState(mode==="yaml"?yamlSample:xmlSample);const [copied,setCopied]=useState(false);
 const result=useMemo(()=>{
  if(mode==="yaml"){const errors=validateYamlSubset(source);return {output:"",errors};}
  try{return {output:xmlToJson(source),errors:[] as string[]};}catch(e){return {output:"",errors:[e instanceof Error?e.message:"Could not parse XML."]};}
 },[source,mode]);
 const output=mode==="xml"?result.output:"";
 const title=mode==="yaml"?"YAML Validator":"XML to JSON Converter";
 async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 function download(){const blob=new Blob([output],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="converted.json";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>{mode==="yaml"?"Check common YAML formatting issues including indentation, tabs, unclosed quotes and duplicate mapping keys. Validation runs locally in your browser.":"Convert XML documents into formatted JSON. Attributes, nested elements, repeated elements and text values are preserved in a predictable JSON structure."}</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>{mode==="yaml"?"YAML input":"XML input"}<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...area,minHeight:270}} placeholder={mode==="yaml"?"Paste YAML here…":"Paste XML here…"}/></label>
   {result.errors.length===0?<p role="status" style={{padding:12,borderRadius:9,background:"#eaf7ef",color:"#14634b",fontSize:13,fontWeight:700}}>{mode==="yaml"?"No common YAML syntax issues detected.":"Valid XML — JSON output is ready."}</p>:<div role="alert" style={{padding:12,borderRadius:9,background:"#fff1f0",color:"#a52b24",fontSize:13}}><b>{mode==="yaml"?"Potential YAML issues":"Conversion error"}</b><ul style={{margin:"8px 0 0",paddingLeft:20}}>{result.errors.map((e,i)=><li key={i}>{e}</li>)}</ul></div>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>setSource(mode==="yaml"?yamlSample:xmlSample)}>Load sample</button>{mode==="xml"&&<><button style={primary} onClick={copy} disabled={!output}>{copied?"Copied":"Copy JSON"}</button><button style={{...primary,background:"#334155"}} onClick={download} disabled={!output}>Download .json</button></>}<button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   {mode==="xml"?<label style={{display:"grid",gap:8,fontWeight:700}}>JSON output<textarea readOnly value={output} spellCheck={false} style={{...area,minHeight:250,background:"#f7faf8"}}/></label>:<p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Scope: this lightweight checker focuses on common indentation and mapping mistakes. It is not a complete YAML 1.2 parser, so a clean result does not guarantee that every YAML feature or application-specific schema is valid. For production configuration, also run the file through your target platform's YAML parser.</p>}
   {mode==="xml"&&<p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Attributes are stored under <code>@attributes</code>, repeated sibling tags become arrays, and mixed text is stored under <code>#text</code>. XML namespaces are retained in element names. Conversion runs locally; no file is uploaded.</p>}
  </section>
 </main>;
}
