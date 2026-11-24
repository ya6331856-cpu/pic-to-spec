"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
const area={width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace"} as const;
const primary={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer"} as const;
function minifyCss(input:string){
 let out="",i=0;
 while(i<input.length){
  if(input[i]==="/"&&input[i+1]==="*"){
   const end=input.indexOf("*/",i+2);const comment=input.slice(i,end<0?input.length:end+2);
   if(comment.startsWith("/*!"))out+=comment;
   i=end<0?input.length:end+2;continue;
  }
  if(input[i]==="'"||input[i]==='"'){
   const quote=input[i];let j=i+1;
   while(j<input.length){if(input[j]==="\\"){j+=2;continue;}if(input[j]===quote){j++;break;}j++;}
   out+=input.slice(i,j);i=j;continue;
  }
  out+=input[i++]; 
 }
 return out.replace(/\s+/g," ").replace(/\s*([{}:;,])\s*/g,"$1").replace(/\s*([>])\s*/g,"$1").trim();
}
function download(value:string){const blob=new Blob([value],{type:"text/css"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="minified.css";a.click();URL.revokeObjectURL(url);}
const sample=`/* Main layout */
.page {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #17251e;
}
`;
export default function CssMinifierTool(){
 const [source,setSource]=useState(sample);const [copied,setCopied]=useState(false);
 const output=useMemo(()=>minifyCss(source),[source]);
 const before=new TextEncoder().encode(source).length,after=new TextEncoder().encode(output).length;
 const reduction=before?Math.max(0,Math.round((1-after/before)*100)):0;
 async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>CSS Minifier</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>Compress CSS by removing comments and unnecessary whitespace. See the output size, then copy or download your minified stylesheet. Everything runs locally in your browser.</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>CSS source<textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false} style={{...area,minHeight:250}} placeholder="Paste CSS here…"/></label>
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={primary} onClick={()=>setSource(sample)}>Load sample</button><button style={primary} onClick={copy} disabled={!output}>{copied?"Copied":"Copy minified CSS"}</button><button style={{...primary,background:"#334155"}} onClick={()=>download(output)} disabled={!output}>Download .css</button><button style={{...primary,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSource("")}>Clear</button></div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>{[{label:"Original size",value:before+" bytes"},{label:"Output size",value:after+" bytes"},{label:"Estimated reduction",value:reduction+"%"}].map(x=><div key={x.label} style={{padding:14,border:"1px solid #dce7df",borderRadius:10,background:"#f7faf8"}}><small style={{display:"block",color:"#607168"}}>{x.label}</small><strong>{x.value}</strong></div>)}</div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>Minified CSS<textarea readOnly value={output} spellCheck={false} style={{...area,minHeight:200,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>This is a lightweight minifier, not a full CSS parser. It preserves quoted strings and important comments, but it does not perform advanced selector or declaration optimization. Review complex calc(), custom properties and vendor-specific CSS before production use.</p>
  </section>
 </main>;
}
