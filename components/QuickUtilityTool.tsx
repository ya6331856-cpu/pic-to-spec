"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Kind = "html-entities" | "timestamp" | "slug" | "lorem";
const styles = {
  input: { width:"100%", padding:14, border:"1px solid #dce7df", borderRadius:12, fontSize:14, lineHeight:1.6, color:"#17251e", background:"#fff" } as const,
  button: { border:0, background:"#14634b", color:"#fff", padding:"12px 18px", borderRadius:9, fontWeight:700, cursor:"pointer" } as const,
  secondary: { border:"1px solid #d5e4da", background:"#f2f8f3", color:"#14634b", padding:"10px 14px", borderRadius:9, fontWeight:700, cursor:"pointer" } as const
};
function escapeHtml(value:string) { return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c] as string)); }
function decodeHtml(value:string) { const doc = new DOMParser().parseFromString(value,"text/html"); return doc.documentElement.textContent ?? ""; }
function makeSlug(value:string, useLowercase:boolean) { const normalized=value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").trim().replace(/&/g," and ").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").replace(/-{2,}/g,"-"); return useLowercase?normalized.toLowerCase():normalized; }
function formatDate(date:Date) { return date.toISOString(); }
export default function QuickUtilityTool({kind}:{kind:Kind}) {
 const [input,setInput]=useState(""); const [mode,setMode]=useState<"encode"|"decode">("encode"); const [copied,setCopied]=useState(false);
 const [timestamp,setTimestamp]=useState(String(Math.floor(Date.now()/1000))); const [unit,setUnit]=useState<"seconds"|"milliseconds">("seconds");
 const [slug,setSlug]=useState(""); const [separator,setSeparator]=useState<"-"|"_" >("-"); const [lowercase,setLowercase]=useState(true);
 const [paragraphs,setParagraphs]=useState("3"); const [words,setWords]=useState("50"); const [loremMode,setLoremMode]=useState<"paragraphs"|"words">("paragraphs");
 const title=kind==="html-entities"?"HTML Entity Encoder & Decoder":kind==="timestamp"?"Unix Timestamp Converter":kind==="slug"?"URL Slug Generator":"Lorem Ipsum Generator";
 const description=kind==="html-entities"?"Encode special characters into HTML entities or decode HTML entities back into readable text.":kind==="timestamp"?"Convert Unix timestamps between seconds, milliseconds and readable UTC dates.":kind==="slug"?"Create clean, readable URL slugs from titles and text for SEO-friendly URLs.":"Generate placeholder Lorem Ipsum text by paragraph or word count.";
 const output=useMemo(()=>{
  if(kind==="html-entities") return mode==="encode"?escapeHtml(input):decodeHtml(input);
  if(kind==="slug") { const s=makeSlug(slug,lowercase); return s.replace(/-/g,separator); }
  if(kind==="timestamp") { const n=Number(timestamp); if(!Number.isFinite(n)||timestamp.trim()==="") return "Enter a valid numeric timestamp."; const d=new Date(unit==="seconds"?n*1000:n); return Number.isNaN(d.getTime())?"Timestamp is outside the supported date range.":formatDate(d); }
  const count=Math.max(1,Math.min(50,Math.floor(Number(paragraphs)||1))); const wordCount=Math.max(1,Math.min(1000,Math.floor(Number(words)||1)));
  const sentence="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  if(loremMode==="words") return Array.from({length:wordCount},(_,i)=>sentence.split(" ")[i%sentence.split(" ").length]).join(" ");
  return Array.from({length:count},(_,i)=>Array.from({length:3+i%3},()=>sentence).join(" ")).join("\n\n");
 },[kind,mode,input,slug,separator,lowercase,timestamp,unit,paragraphs,words,loremMode]);
 async function copy(){try{await navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
 return <main style={{maxWidth:960,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE ONLINE TEXT TOOL</p>
  <h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{description}</p>
  <section style={{marginTop:24,display:"grid",gap:14}}>
   {kind==="html-entities"&&<><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={mode==="encode"?styles.button:styles.secondary} onClick={()=>setMode("encode")}>Encode HTML</button><button style={mode==="decode"?styles.button:styles.secondary} onClick={()=>setMode("decode")}>Decode HTML</button></div><label style={{display:"grid",gap:8,fontWeight:700}}>Input text<textarea rows={8} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter text or HTML entities…" style={styles.input}/></label></>}
   {kind==="timestamp"&&<><label style={{display:"grid",gap:8,fontWeight:700}}>Unix timestamp<input value={timestamp} onChange={e=>setTimestamp(e.target.value)} inputMode="decimal" style={styles.input}/></label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={unit==="seconds"?styles.button:styles.secondary} onClick={()=>setUnit("seconds")}>Seconds</button><button style={unit==="milliseconds"?styles.button:styles.secondary} onClick={()=>setUnit("milliseconds")}>Milliseconds</button></div><p style={{color:"#46556b"}}>Current Unix time: {Math.floor(Date.now()/1000)} seconds</p></>}
   {kind==="slug"&&<><label style={{display:"grid",gap:8,fontWeight:700}}>Page title or text<input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="Example: Best Free Image Tools for 2026" style={styles.input}/></label><label style={{display:"flex",gap:9,alignItems:"center",color:"#40516a"}}><input type="checkbox" checked={lowercase} onChange={e=>setLowercase(e.target.checked)}/> Lowercase output</label><label style={{display:"grid",gap:8,fontWeight:700}}>Word separator<select value={separator} onChange={e=>setSeparator(e.target.value as "-"|"_")} style={styles.input}><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></label></>}
   {kind==="lorem"&&<><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={loremMode==="paragraphs"?styles.button:styles.secondary} onClick={()=>setLoremMode("paragraphs")}>Paragraphs</button><button style={loremMode==="words"?styles.button:styles.secondary} onClick={()=>setLoremMode("words")}>Words</button></div>{loremMode==="paragraphs"?<label style={{display:"grid",gap:8,fontWeight:700}}>Number of paragraphs<input type="number" min="1" max="50" value={paragraphs} onChange={e=>setParagraphs(e.target.value)} style={styles.input}/></label>:<label style={{display:"grid",gap:8,fontWeight:700}}>Number of words<input type="number" min="1" max="1000" value={words} onChange={e=>setWords(e.target.value)} style={styles.input}/></label>}</>}
   <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap"}}><b>Result</b><button onClick={()=>void copy()} style={styles.secondary}>Copy result</button>{copied&&<span role="status" style={{color:"#17623b"}}>Copied!</span>}</div><textarea readOnly rows={kind==="lorem"?12:5} value={output} style={styles.input}/>
  </section>
  <p style={{fontSize:12,color:"#46556b",lineHeight:1.7,marginTop:22}}>This tool processes your text locally in your browser. Your input is not sent to a PicToSpec processing server.</p>
  <section className="tool-content"><h2>{title}: free online tool</h2><p>{description} Use the controls above, review the result and copy it when ready.</p><h3>How to use</h3><ol><li>Enter your text, timestamp or generation settings.</li><li>Choose the relevant mode or format.</li><li>Review the generated result.</li><li>Copy the result and use it in your project.</li></ol><h3>Privacy</h3><p>Processing runs in your browser. Do not use a shared device if your text is confidential.</p><h3>Frequently asked questions</h3><h4>Is this tool free?</h4><p>Yes. You can use it without creating an account.</p><h4>Is my input uploaded?</h4><p>No. The operations on this page run locally in your browser.</p></section>
 </main>;
}
