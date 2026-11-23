"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";
type Kind="word-counter"|"case-converter"|"json-formatter"|"base64-encoder-decoder";
const config:Record<Kind,{title:string;desc:string;placeholder:string}>={
 "word-counter":{title:"Word and Character Counter",desc:"Count words, characters, sentences, paragraphs and lines instantly. Emoji and combined characters are counted as visible characters where your browser supports it.",placeholder:"Type or paste your text here..."},
 "case-converter":{title:"Online Case Converter",desc:"Convert text to uppercase, lowercase, title case, sentence case or clean extra spaces.",placeholder:"Enter text to convert..."},
 "json-formatter":{title:"JSON Formatter and Validator",desc:"Format, beautify, minify and validate JSON data in your browser with clear error messages.",placeholder:'Paste JSON here, e.g. {"name":"PicToSpec"}'},
 "base64-encoder-decoder":{title:"Base64 Encoder and Decoder",desc:"Encode plain text to Base64 or decode Base64 strings locally in your browser.",placeholder:"Enter text or Base64 data..."}
};
function encodeBase64Utf8(value:string){const bytes=new TextEncoder().encode(value);let binary="";for(let i=0;i<bytes.length;i+=0x8000){const chunk=bytes.subarray(i,i+0x8000);for(let j=0;j<chunk.length;j++)binary+=String.fromCharCode(chunk[j]);}return btoa(binary);}
function decodeBase64Utf8(value:string){const binary=atob(value.trim());const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));return new TextDecoder("utf-8",{fatal:true}).decode(bytes);}
function countCharacters(text:string){
 if(typeof Intl!=="undefined"&&"Segmenter" in Intl){
  return Array.from(new Intl.Segmenter(undefined,{granularity:"grapheme"}).segment(text)).length;
 }
 return Array.from(text).length;
}
export default function TextTool({kind}:{kind:Kind}){
 const [value,setValue]=useState(""),[mode,setMode]=useState("encode"),[indent,setIndent]=useState("2"),[output,setOutput]=useState(""),[error,setError]=useState("");
 const stats=useMemo(()=>({words:(value.trim().match(/\S+/g)||[]).length,chars:value.length,noSpaces:value.replace(/\s/g,"").length,sentences:(value.match(/[.!?]+(?=\s|$)/g)||[]).length,paragraphs:value.trim()?value.trim().split(/\n\s*\n/).length:0,lines:value?value.split(/\r?\n/).length:0}),[value]);
 function run(action:string){setError("");setOutput("");try{
  if(kind==="case-converter"){const v=action==="upper"?value.toUpperCase():action==="lower"?value.toLowerCase():action==="title"?value.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()):action==="sentence"?value.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g,(_,a,b)=>a+b.toUpperCase()):value.replace(/\s+/g," ").trim();setOutput(v);}
  else if(kind==="json-formatter"){const parsed=JSON.parse(value);setOutput(action==="minify"?JSON.stringify(parsed):JSON.stringify(parsed,null,Number(indent)));}
  else if(kind==="base64-encoder-decoder"){setOutput(mode==="encode"?encodeBase64Utf8(value):decodeBase64Utf8(value));}
 }catch(e){setError(kind==="json-formatter"?(e instanceof Error?e.message:"Invalid JSON"):"Could not process this input. Check the text and selected mode.");}}
 async function copy(){try{await navigator.clipboard.writeText(output);}catch{setError("Copy failed. Please select and copy the result manually.");}}
 return <main style={{maxWidth:850,margin:"40px auto",padding:"20px",color:"#17251e"}}><div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch /></div><p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE TEXT & DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(32px,6vw,46px)",letterSpacing:-1.5,margin:"10px 0"}}>{config[kind].title}</h1><p style={{color:"#75847c",lineHeight:1.7}}>{config[kind].desc}</p><textarea value={value} onChange={e=>{setValue(e.target.value);setOutput("");setError("");}} placeholder={config[kind].placeholder} rows={10} style={{width:"100%",marginTop:24,padding:16,border:"1px solid #dce7df",borderRadius:12,fontSize:15,lineHeight:1.6,resize:"vertical"}}/>
 {kind==="word-counter"?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginTop:15}}>{Object.entries({Words:stats.words,Characters:stats.chars,"Characters without spaces":stats.noSpaces,Sentences:stats.sentences,Paragraphs:stats.paragraphs,Lines:stats.lines}).map(([k,v])=><div key={k} style={{background:"#f2f8f3",padding:14,borderRadius:10}}><b style={{display:"block",fontSize:24,color:"#14634b"}}>{v}</b><small style={{color:"#75847c"}}>{k}</small></div>)}</div>:<section style={{marginTop:16,display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
 {kind==="case-converter"?["upper","lower","title","sentence","spaces"].map(x=><button key={x} onClick={()=>run(x)} style={btn}>{x==="upper"?"UPPERCASE":x==="lower"?"lowercase":x==="title"?"Title Case":x==="sentence"?"Sentence case":"Remove extra spaces"}</button>):kind==="json-formatter"?<><select value={indent} onChange={e=>setIndent(e.target.value)} style={selectStyle}><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="0">No indentation</option></select><button onClick={()=>run("format")} style={btn}>Format & validate JSON</button><button onClick={()=>run("minify")} style={btn}>Minify JSON</button></>:<><select value={mode} onChange={e=>setMode(e.target.value)} style={selectStyle}><option value="encode">Encode to Base64</option><option value="decode">Decode from Base64</option></select><button onClick={()=>run(mode)} style={btn}>Convert</button></>}
 </section>}
 {error&&<p role="alert" style={{color:"#b42318",fontSize:13}}>{error}</p>}{output!==""&&<section style={{marginTop:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b>Result</b><button onClick={copy} style={btn}>Copy result</button></div><textarea readOnly value={output} rows={8} style={{width:"100%",marginTop:10,padding:14,border:"1px solid #dce7df",borderRadius:10,fontSize:14}}/></section>}
 <p style={{fontSize:12,color:"#75847c",lineHeight:1.7,marginTop:22}}>Your text is processed in this browser. Do not paste passwords, API keys or other secrets into shared or public devices.</p></main>;
}
const btn:React.CSSProperties={border:"1px solid #d5e4da",background:"#f2f8f3",color:"#14634b",padding:"11px 14px",borderRadius:8,fontWeight:700,cursor:"pointer"};
const selectStyle:React.CSSProperties={padding:"11px",border:"1px solid #d5e4da",borderRadius:8,background:"white"};
