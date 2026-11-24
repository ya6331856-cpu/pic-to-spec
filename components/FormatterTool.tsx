"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Kind = "json-xml" | "xml" | "css" | "html";
const styles = {
  input: { width:"100%", minHeight:260, padding:15, border:"1px solid #dce7df", borderRadius:12, fontSize:13, lineHeight:1.65, color:"#17251e", background:"#fff", fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace", resize:"vertical" as const },
  button: { border:0, background:"#14634b", color:"#fff", padding:"11px 16px", borderRadius:9, fontWeight:700, cursor:"pointer" as const },
};
function escapeXml(value:string) { return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"); }
function jsonToXml(value:unknown, rootName:string):string {
  const validName=(s:string)=>/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(s);
  if(!validName(rootName)) throw new Error("Root element must start with a letter or underscore and contain only letters, numbers, dots, hyphens or underscores.");
  const render=(v:unknown,name:string,depth:number):string=>{
    const pad="  ".repeat(depth);
    if(Array.isArray(v)) return v.map(item=>render(item,"item",depth)).join("\n");
    if(v!==null && typeof v==="object") {
      const children=Object.entries(v as Record<string,unknown>).map(([key,item])=>{
        if(!validName(key)) throw new Error('Invalid XML element name: "'+key+'".');
        return render(item,key,depth+1);
      }).join("\n");
      return pad+"<"+name+">\n"+children+"\n"+pad+"</"+name+">";
    }
    const text=v===null?"":typeof v==="string"?v:String(v);
    return pad+"<"+name+">"+escapeXml(text)+"</"+name+">";
  };
  return '<?xml version="1.0" encoding="UTF-8"?>\n'+render(value,rootName,0);
}
function formatXml(source:string):string {
  const doc=new DOMParser().parseFromString(source,"application/xml");
  const error=doc.querySelector("parsererror");
  if(error) throw new Error("Invalid XML: "+(error.textContent||"Please check the markup."));
  const serialize=(node:Node,depth:number):string=>{
    const pad="  ".repeat(depth);
    if(node.nodeType===Node.TEXT_NODE) { const t=node.textContent?.trim()||""; return t?pad+escapeXml(t):""; }
    if(node.nodeType===Node.COMMENT_NODE) return pad+"<!--"+(node.textContent||"")+"-->";
    if(node.nodeType!==Node.ELEMENT_NODE) return "";
    const el=node as Element;
    const attrs=Array.from(el.attributes).map(a=>" "+a.name+'="'+escapeXml(a.value)+'"').join("");
    const children=Array.from(el.childNodes).filter(n=>n.nodeType!==Node.TEXT_NODE || !!n.textContent?.trim());
    if(!children.length) return pad+"<"+el.tagName+attrs+"/>";
    if(children.length===1 && children[0].nodeType===Node.TEXT_NODE) return pad+"<"+el.tagName+attrs+">"+escapeXml(children[0].textContent||"")+"</"+el.tagName+">";
    return pad+"<"+el.tagName+attrs+">\n"+children.map(n=>serialize(n,depth+1)).filter(Boolean).join("\n")+"\n"+pad+"</"+el.tagName+">";
  };
  return Array.from(doc.childNodes).map(n=>serialize(n,0)).filter(Boolean).join("\n");
}
function formatCss(source:string):string {
  let out="", depth=0, token="", quote="", comment=false;
  const indent=()=> "  ".repeat(depth);
  for(let i=0;i<source.length;i++){
    const c=source[i], next=source[i+1];
    if(comment){token+=c;if(c==="*"&&next==="/"){token+="/";i++;out+=indent()+token.trim()+"\n";token="";comment=false;}continue;}
    if(quote){token+=c;if(c==="\\"&&next){token+=next;i++;}else if(c===quote)quote="";continue;}
    if(c==="/"&&next==="*"){if(token.trim())out+=indent()+token.trim()+"\n";token="";token="/*";i++;comment=true;continue;}
    if(c==="'"||c==='"'){quote=c;token+=c;continue;}
    if(c==="{"){const head=token.trim();if(head)out+=indent()+head+" {\n";token="";depth++;continue;}
    if(c==="}"){if(token.trim())out+=indent()+token.trim()+";\n";token="";depth=Math.max(0,depth-1);out+=indent()+"}\n";continue;}
    if(c===";"){if(token.trim())out+=indent()+token.trim()+";\n";token="";continue;}
    token+=c;
  }
  if(token.trim())out+=indent()+token.trim()+"\n";
  if(comment) throw new Error("CSS comment is not closed.");
  if(quote) throw new Error("CSS string is not closed.");
  if(depth!==0) throw new Error("CSS braces are unbalanced.");
  return out.trim();
}
function formatHtml(source:string):string {
  const doc=new DOMParser().parseFromString(source,"text/html");
  const root=doc.body;
  const formatNode=(node:Node,depth:number):string=>{
    const pad="  ".repeat(depth);
    if(node.nodeType===Node.TEXT_NODE){const t=node.textContent||"";return t.trim()?pad+t.trim():"";}
    if(node.nodeType===Node.COMMENT_NODE)return pad+"<!-- "+(node.textContent||"")+" -->";
    if(node.nodeType!==Node.ELEMENT_NODE)return "";
    const el=node as Element, tag=el.tagName.toLowerCase();
    const attrs=Array.from(el.attributes).map(a=>" "+a.name+'="'+a.value.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'"').join("");
    const open="<"+tag+attrs+">";
    if(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(tag))return pad+open.slice(0,-1)+">";
    const kids=Array.from(el.childNodes).map(n=>formatNode(n,depth+1)).filter(Boolean);
    if(!kids.length)return pad+open+"</"+tag+">";
    if(kids.length===1 && el.childNodes.length===1 && el.firstChild?.nodeType===Node.TEXT_NODE)return pad+open+el.textContent!.trim()+"</"+tag+">";
    return pad+open+"\n"+kids.join("\n")+"\n"+pad+"</"+tag+">";
  };
  return Array.from(root.childNodes).map(n=>formatNode(n,0)).filter(Boolean).join("\n");
}
const config:Record<Kind,{title:string;description:string;placeholder:string;sample:string}> = {
  "json-xml":{title:"JSON to XML Converter",description:"Convert JSON objects and arrays into readable XML in your browser.",placeholder:"Paste JSON here…",sample:'{\n  "person": {\n    "name": "Alex",\n    "active": true,\n    "skills": ["HTML", "CSS"]\n  }\n}'},
  xml:{title:"XML Formatter",description:"Validate XML and format it with clean indentation in your browser.",placeholder:"Paste XML here…",sample:'<catalog><book id="1"><title>Example</title><price>9.99</price></book></catalog>'},
  css:{title:"CSS Formatter",description:"Format CSS rules with consistent indentation and readable declarations.",placeholder:"Paste CSS here…",sample:"body{margin:0;padding:0;color:#222} .card{display:flex;gap:12px;align-items:center}"},
  html:{title:"HTML Formatter",description:"Format HTML markup into a readable, indented structure in your browser.",placeholder:"Paste HTML here…",sample:'<main><h1>Hello</h1><p>Welcome to PicToSpec.</p></main>'}
};
export default function FormatterTool({kind}:{kind:Kind}) {
  const cfg=config[kind]; const [input,setInput]=useState(cfg.sample); const [output,setOutput]=useState(""); const [error,setError]=useState(""); const [root,setRoot]=useState("root"); const [copied,setCopied]=useState(false);
  function run(){setError("");setOutput("");try{if(!input.trim())throw new Error("Paste some code or data first.");let result="";if(kind==="json-xml")result=jsonToXml(JSON.parse(input),root.trim());if(kind==="xml")result=formatXml(input);if(kind==="css")result=formatCss(input);if(kind==="html")result=formatHtml(input);setOutput(result);}catch(e){setError(e instanceof Error?e.message:"Could not format this input.");}}
  async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}catch{setError("Clipboard access is unavailable. Select and copy the output manually.");}}
  function download(){const blob=new Blob([output],{type:kind==="json-xml"||kind==="xml"?"application/xml":"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=kind==="json-xml"||kind==="xml"?"formatted.xml":kind==="css"?"formatted.css":"formatted.html";a.click();URL.revokeObjectURL(url);}
  return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{cfg.title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{cfg.description}</p>{kind==="json-xml"&&<label style={{display:"grid",gap:7,maxWidth:360,marginTop:18,fontWeight:700}}>XML root element<input value={root} onChange={e=>setRoot(e.target.value)} style={{...styles.input,minHeight:0}}/></label>}<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,380px),1fr))",gap:18,marginTop:22}}><label style={{display:"grid",gap:8,fontWeight:700}}>Input<textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={cfg.placeholder} spellCheck={false} style={styles.input}/></label><label style={{display:"grid",gap:8,fontWeight:700}}>Formatted output<textarea readOnly value={output} placeholder="Your formatted result will appear here…" spellCheck={false} style={{...styles.input,background:"#f7faf8"}}/></label></div><div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}><button type="button" style={styles.button} onClick={run}>{kind==="json-xml"?"Convert to XML":"Format code"}</button><button type="button" style={{...styles.button,background:"#eaf2ed",color:"#174c39"}} onClick={()=>{setInput(cfg.sample);setOutput("");setError("");}}>Load sample</button><button type="button" disabled={!output} style={{...styles.button,opacity:output?1:.45}} onClick={copy}>{copied?"Copied":"Copy output"}</button><button type="button" disabled={!output} style={{...styles.button,background:"#334155",opacity:output?1:.45}} onClick={download}>Download file</button></div>{error&&<p role="alert" style={{color:"#b42318",fontWeight:600,marginTop:14}}>{error}</p>}<p style={{marginTop:24,color:"#607168",fontSize:13,lineHeight:1.6}}>All formatting happens locally in your browser. Your input is not uploaded to PicToSpec.</p></main>;
}
