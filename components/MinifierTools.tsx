"use client";

import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Mode = "javascript" | "html";
const inputStyle = { width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace" } as const;
const buttonStyle = { border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer" } as const;

function minifyJavaScript(source:string):string {
 let out="",i=0,space=false;
 const write=(s:string)=>{if(space&&out&&!/[\s([{.,;:+*/%<>=!?&|^-]$/.test(out)&&!/[\s([{.,;:+*/%<>=!?&|^-]/.test(s[0]||""))out+=" ";space=false;out+=s;};
 while(i<source.length){
  const c=source[i],n=source[i+1];
  if(/\s/.test(c)){space=true;i++;continue;}
  if(c==="/"&&n==="/"){i+=2;while(i<source.length&&source[i]!=="\s")i++;space=true;continue;}
  if(c==="/"&&n==="*"){const end=source.indexOf("*/",i+2);i=end<0?source.length:end+2;space=true;continue;}
  if(c==="'"||c==='"'||c==="\x60"){
   const q=c;let j=i+1;
   while(j<source.length){if(source[j]==="\\"){j+=2;continue;}if(source[j]===q){j++;break;}j++;}
   write(source.slice(i,j));i=j;continue;
  }
  if(/[([{.,;:+*/%<>=!?&|^-]/.test(c)){space=false;out=out.trimEnd()+c;i++;continue;}
  let j=i+1;while(j<source.length&&!/\s|[([{.,;:+*/%<>=!?&|^-]/.test(source[j])&&!(source[j]==="/"&&(source[j+1]==="/"||source[j+1]==="*")))j++;
  write(source.slice(i,j));i=j;
 }
 return out.trim();
}
function minifyHtml(source:string):string {
 return source
  .replace(/<!--[\s\s]*?-->/g,"")
  .replace(/>\s+</g,"><")
  .trim();
}
function download(text:string,name:string,type:string){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
export default function MinifierTools({mode}:{mode:Mode}){
 const [source,setSource]=useState(mode==="javascript"?"// Example JavaScript function\nfunction greet(name) {\n  const message = `Hello, ${name}!`;\n  console.log(message);\n  return message;\n}\ngreet('PicToSpec');":"<!-- Page header -->\n<header class=\"site-header\">\n  <h1>Welcome</h1>\n  <p>Fast and simple tools.</p>\n</header>");
 const [copied,setCopied]=useState(false);
 const output=useMemo(()=>{try{return mode==="javascript"?minifyJavaScript(source):minifyHtml(source);}catch{return ""; }},[source,mode]);
 const title=mode==="javascript"?"JavaScript Minifier":"HTML Minifier";
 const description=mode==="javascript"?"Remove JavaScript whitespace and comments to create a compact output. This lightweight minifier does not rename variables or perform advanced syntax transformations.":"Remove HTML comments and unnecessary whitespace between tags to reduce markup size. Text inside elements is preserved as much as possible; review the output before publishing.";
 async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 const originalBytes=new TextEncoder().encode(source).length,outputBytes=new TextEncoder().encode(output).length;
 const saved=originalBytes?Math.max(0,Math.round((1-outputBytes/originalBytes)*100)):0;
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{description}</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>{mode==="javascript"?"JavaScript source":"HTML source"}<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...inputStyle,minHeight:260}} placeholder="Paste code here…"/></label>
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button type="button" style={buttonStyle} onClick={()=>setSource(mode==="javascript"?"function greet(name) {\n  console.log('Hello, ' + name);\n}\ngreet('PicToSpec');":"<main>\n  <h1>Welcome</h1>\n  <p>Fast and simple tools.</p>\n</main>")}>Load sample</button><button type="button" disabled={!output} style={{...buttonStyle,opacity:output?1:0.45}} onClick={copy}>{copied?"Copied":"Copy minified code"}</button><button type="button" disabled={!output} style={{...buttonStyle,background:"#334155",opacity:output?1:0.45}} onClick={()=>download(output,mode==="javascript"?"minified.js":"minified.html",mode==="javascript"?"text/javascript":"text/html")}>Download {mode==="javascript"?".js":".html"}</button><button type="button" style={{...buttonStyle,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>{[{label:"Original size",value:originalBytes+" bytes"},{label:"Output size",value:outputBytes+" bytes"},{label:"Estimated reduction",value:saved+"%"}].map(x=><div key={x.label} style={{padding:14,border:"1px solid #dce7df",borderRadius:10,background:"#f7faf8"}}><small style={{display:"block",color:"#607168"}}>{x.label}</small><strong>{x.value}</strong></div>)}</div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>Minified output<textarea readOnly value={output} spellCheck={false} style={{...inputStyle,minHeight:220,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>{mode==="javascript"?"This is a lightweight lexical minifier, not a full JavaScript parser. It does not rename identifiers or guarantee safe transformations for every syntax edge case. Test minified code before deployment.":"This is a lightweight whitespace minifier, not a standards-aware HTML parser. It does not rewrite scripts or styles. Check whitespace-sensitive content, preformatted text and templates before using the output."} Processing happens locally in your browser; your code is not uploaded.</p>
  </section>
 </main>;
}
