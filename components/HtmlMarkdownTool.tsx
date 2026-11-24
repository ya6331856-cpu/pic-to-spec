"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
const area={width:"100%",minHeight:280,padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:13,lineHeight:1.65,color:"#17251e",background:"#fff",fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace",resize:"vertical" as const};
const button={border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer" as const};
function safeUrl(value:string):boolean{return /^(https?:|mailto:)/i.test(value)||(/^\/(?!\/)/.test(value));}
function inlineMarkdown(node:Node):string{
 if(node.nodeType===Node.TEXT_NODE)return (node.textContent||"").replace(/\s+/g," ");
 if(node.nodeType!==Node.ELEMENT_NODE)return "";
 const el=node as Element,tag=el.tagName.toLowerCase(),content=Array.from(el.childNodes).map(inlineMarkdown).join("");
 if(tag==="br")return "  \n";
 if(tag==="strong"||tag==="b")return "**"+content.trim()+"**";
 if(tag==="em"||tag==="i")return "*"+content.trim()+"*";
 if(tag==="del"||tag==="s"||tag==="strike")return "~~"+content.trim()+"~~";
 if(tag==="code"){const tick=String.fromCharCode(96);return tick+content.replaceAll(tick,"\\"+tick)+tick;}
 if(tag==="a"){const href=el.getAttribute("href")||"";return safeUrl(href)?"["+content.trim()+"]("+href+")":content;}
 if(tag==="img"){const alt=el.getAttribute("alt")||"image",src=el.getAttribute("src")||"";return safeUrl(src)?"!["+alt+"]("+src+")":alt;}
 return content;
}
function blockMarkdown(node:Node,depth=0):string{
 if(node.nodeType===Node.TEXT_NODE)return (node.textContent||"").trim();
 if(node.nodeType!==Node.ELEMENT_NODE)return "";
 const el=node as Element,tag=el.tagName.toLowerCase();
 if(["script","style","noscript","template","svg"].includes(tag))return "";
 if(/^h[1-6]$/.test(tag))return "#".repeat(Number(tag[1]))+" "+Array.from(el.childNodes).map(inlineMarkdown).join("").trim();
 if(tag==="p")return Array.from(el.childNodes).map(inlineMarkdown).join("").trim();
 if(tag==="br")return "";
 if(tag==="hr")return "---";
 if(tag==="pre"){
  const code=el.querySelector("code"),text=(code||el).textContent||"",tick=String.fromCharCode(96);
  const longest=Math.max(0,...(text.match(new RegExp(tick+"+","g"))||[]).map(x=>x.length));
  const fence=tick.repeat(Math.max(3,longest+1));
  return fence+"\n"+text.replace(/\n+$/,"")+"\n"+fence;
 }
 if(tag==="blockquote"){
  const inner=Array.from(el.childNodes).map(n=>blockMarkdown(n,depth)).filter(Boolean).join("\n\n");
  return inner.split("\n").map(line=>"> "+line).join("\n");
 }
 if(tag==="ul"||tag==="ol"){
  let index=1;return Array.from(el.children).filter(child=>child.tagName.toLowerCase()==="li").map(li=>{
   const marker=tag==="ol"?(index++)+". ":"- ";
   const content=Array.from(li.childNodes).map(n=>n.nodeType===Node.ELEMENT_NODE&&["ul","ol"].includes((n as Element).tagName.toLowerCase())?blockMarkdown(n,depth+1):inlineMarkdown(n)).join("").trim();
   return "  ".repeat(depth)+marker+content;
  }).join("\n");
 }
 if(tag==="table"){
  const rows=Array.from(el.querySelectorAll("tr")).map(row=>Array.from(row.children).map(cell=>(cell.textContent||"").trim().replace(/\|/g,"\\|").replace(/\s+/g," ")));
  if(!rows.length)return "";
  const width=Math.max(...rows.map(row=>row.length));
  const normalized=rows.map(row=>Array.from({length:width},(_,i)=>row[i]||""));
  const head=normalized[0],divider=head.map(()=> "---");
  return "| "+head.join(" | ")+" |\n| "+divider.join(" | ")+" |\n"+normalized.slice(1).map(row=>"| "+row.join(" | ")+" |").join("\n");
 }
 if(["div","section","article","main","header","footer","aside"].includes(tag))return Array.from(el.childNodes).map(n=>blockMarkdown(n,depth)).filter(Boolean).join("\n\n");
 if(tag==="li")return "- "+Array.from(el.childNodes).map(inlineMarkdown).join("").trim();
 return Array.from(el.childNodes).map(n=>n.nodeType===Node.ELEMENT_NODE?blockMarkdown(n,depth):inlineMarkdown(n)).filter(Boolean).join(" ");
}
function convertHtml(source:string):string{
 const doc=new DOMParser().parseFromString(source,"text/html");
 doc.querySelectorAll("script,style,noscript,template,svg,iframe,object").forEach(el=>el.remove());
 return Array.from(doc.body.childNodes).map(node=>blockMarkdown(node)).filter(Boolean).join("\n\n").replace(/\n{3,}/g,"\n\n").trim()+"\n";
}
const sample=["<!doctype html>","<article>","  <h1>Welcome to PicToSpec</h1>","  <p>Useful <strong>free online tools</strong> for everyday work.</p>","  <h2>Popular tools</h2>","  <ul><li>Image Compressor</li><li>JSON Formatter</li></ul>","  <blockquote><p>Your files stay on your device.</p></blockquote>","  <p>Visit <a href=\\"https://pictospec.com\\">PicToSpec</a>.</p>","  <pre><code>const ready = true;</code></pre>","</article>"].join("\n");
export default function HtmlMarkdownTool(){
 const [html,setHtml]=useState(sample),[copied,setCopied]=useState(false);
 const result=useMemo(()=>{try{return {markdown:html.trim()?convertHtml(html):"",error:""};}catch(e){return {markdown:"",error:e instanceof Error?e.message:"Could not convert this HTML."};}},[html]);
 async function copy(){try{await navigator.clipboard.writeText(result.markdown);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 function download(){const blob=new Blob([result.markdown],{type:"text/markdown;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="converted.md";a.click();URL.revokeObjectURL(url);}
 return <main style={{maxWidth:1050,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>HTML to Markdown Converter</h1>
  <p style={{color:"#46556b",lineHeight:1.7}}>Convert HTML markup into clean Markdown. Supports headings, paragraphs, links, images, lists, blockquotes, code blocks, horizontal rules and basic tables. Conversion runs locally in your browser.</p>
  <section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>HTML input<textarea value={html} onChange={e=>setHtml(e.target.value)} spellCheck={false} style={area} placeholder="Paste HTML here…"/></label>
   {result.error?<p role="alert" style={{color:"#a52b24"}}>{result.error}</p>:<p role="status" style={{padding:12,borderRadius:9,background:"#eaf7ef",color:"#14634b",fontWeight:700}}>Markdown output updated.</p>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button style={button} onClick={()=>setHtml(sample)}>Load sample</button><button style={button} onClick={copy} disabled={!result.markdown}>{copied?"Copied":"Copy Markdown"}</button><button style={{...button,background:"#334155"}} onClick={download} disabled={!result.markdown}>Download .md</button><button style={{...button,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setHtml("")}>Clear</button></div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>Markdown output<textarea readOnly value={result.markdown} spellCheck={false} style={{...area,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>This is a client-side HTML-to-Markdown converter, not a browser rendering engine. It converts the supplied markup structure, removes scripts and embedded active content, and does not execute HTML or JavaScript. Complex layouts and CSS styling may need manual cleanup.</p>
  </section>
 </main>;
}
