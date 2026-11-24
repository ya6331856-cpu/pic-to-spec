"use client";
import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Kind = "color" | "url";
const inputStyle = { width:"100%",padding:14,border:"1px solid #dce7df",borderRadius:12,fontSize:14,color:"#17251e",background:"#fff" } as const;
const buttonStyle = { border:0,background:"#14634b",color:"#fff",padding:"11px 16px",borderRadius:9,fontWeight:700,cursor:"pointer" } as const;
function colorData(value:string) {
 let hex=value.trim().replace(/^#/,"");
 if (/^[0-9a-f]{3}$/i.test(hex)) hex=hex.split("").map(x=>x+x).join("");
 if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
 const n=parseInt(hex,16), r=n>>16, g=(n>>8)&255, b=n&255;
 const rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),d=max-min;
 let h=0; if(d){if(max===rn)h=((gn-bn)/d)%6;else if(max===gn)h=(bn-rn)/d+2;else h=(rn-gn)/d+4;h*=60;if(h<0)h+=360;}
 const l=(max+min)/2, s=d===0?0:d/(1-Math.abs(2*l-1));
 return {hex:"#"+hex.toUpperCase(),rgb:"rgb("+r+", "+g+", "+b+")",hsl:"hsl("+Math.round(h)+", "+Math.round(s*100)+"%, "+Math.round(l*100)+"%)"};
}
export default function DeveloperUtilityTool({kind}:{kind:Kind}) {
 const [value,setValue]=useState(kind==="color"?"#14634B":"https://pictospec.com/tools?category=image&sort=popular");
 const [copied,setCopied]=useState("");
 const color=useMemo(()=>colorData(value),[value]);
 const parsed=useMemo(()=>{try{const u=new URL(value);return [{key:"Protocol",val:u.protocol},{key:"Hostname",val:u.hostname},{key:"Port",val:u.port||"(default)"},{key:"Pathname",val:u.pathname},{key:"Query string",val:u.search||"(none)"},{key:"Hash",val:u.hash||"(none)"},{key:"Origin",val:u.origin}];}catch{return null;}},[value]);
 const rows=kind==="color"?(color?[{key:"HEX",val:color.hex},{key:"RGB",val:color.rgb},{key:"HSL",val:color.hsl}]:[]):(parsed||[]);
 async function copy(text:string,key:string){try{await navigator.clipboard.writeText(text);setCopied(key);window.setTimeout(()=>setCopied(""),1500);}catch{setCopied("");}}
 const title=kind==="color"?"Color Converter":"URL Parser";
 const description=kind==="color"?"Convert HEX color codes into RGB and HSL values instantly.":"Break a URL into protocol, hostname, path, query string and other parts.";
 return <main style={{maxWidth:900,margin:"36px auto",padding:20,color:"#17251e"}}>
 <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
 <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{description}</p>
 <section style={{display:"grid",gap:16,marginTop:24}}>
 <label style={{display:"grid",gap:8,fontWeight:700}}>{kind==="color"?"HEX color code":"Full URL"}<input value={value} onChange={e=>setValue(e.target.value)} placeholder={kind==="color"?"#14634B":"https://example.com/path?key=value"} style={inputStyle}/></label>
 {kind==="color"&&color&&<div style={{height:100,borderRadius:14,background:color.hex,border:"1px solid #dce7df"}} aria-label={"Color preview "+color.hex}/>}
 {kind==="color"&&!color&&<p style={{color:"#b42318"}}>Enter a valid 3-digit or 6-digit HEX color, with or without #.</p>}
 {kind==="url"&&!parsed&&<p style={{color:"#b42318"}}>Enter a valid absolute URL including https:// or http://.</p>}
 {rows.map(row=><div key={row.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:14,border:"1px solid #e1e9e4",borderRadius:10,background:"#f8fbf9"}}><div style={{minWidth:0}}><small style={{display:"block",color:"#607168",fontWeight:700}}>{row.key}</small><strong style={{overflowWrap:"anywhere"}}>{row.val}</strong></div><button type="button" style={buttonStyle} onClick={()=>copy(row.val,row.key)}>{copied===row.key?"Copied":"Copy"}</button></div>)}
 </section>
 <p style={{marginTop:24,color:"#607168",fontSize:13,lineHeight:1.6}}>Processing happens in your browser. Your input is not uploaded to PicToSpec.</p>
 </main>;
}