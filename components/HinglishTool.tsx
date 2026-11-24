"use client";
import { useState } from "react";
import ToolSearch from "@/components/ToolSearch";

const consonants: Record<string,string> = { k:"क",kh:"ख",g:"ग",gh:"घ",ng:"ङ",ch:"च",chh:"छ",j:"ज",jh:"झ",ny:"ञ",T:"ट",Th:"ठ",D:"ड",Dh:"ढ",N:"ण",t:"त",th:"थ",d:"द",dh:"ध",n:"न",p:"प",ph:"फ",b:"ब",bh:"भ",m:"म",y:"य",r:"र",l:"ल",v:"व",w:"व",sh:"श",Sh:"ष",s:"स",h:"ह",q:"क़",z:"ज़",f:"फ़"};
const vowels: Record<string,string> = { a:"अ",aa:"आ",A:"आ",i:"इ",ii:"ई",ee:"ई",I:"ई",u:"उ",uu:"ऊ",oo:"ऊ",U:"ऊ",e:"ए",ai:"ऐ",o:"ओ",au:"औ",ri:"ऋ" };
const matras: Record<string,string> = { a:"",aa:"ा",A:"ा",i:"ि",ii:"ी",ee:"ी",I:"ी",u:"ु",uu:"ू",oo:"ू",U:"ू",e:"े",ai:"ै",o:"ो",au:"ौ",ri:"ृ" };
const cTokens=Object.keys(consonants).sort((a,b)=>b.length-a.length);
const vTokens=Object.keys(vowels).sort((a,b)=>b.length-a.length);
function convertRomanHindi(input:string){
 return input.split(/([\s,.;:!?()[\]{}"'-]+)/).map(part=>{
  if(!part||/^[\s,.;:!?()[\]{}"'-]+$/.test(part))return part;
  let out="",i=0;
  while(i<part.length){
   const lower=part.slice(i);
   const c=cTokens.find(token=>lower.startsWith(token));
   if(c){
    out+=consonants[c];i+=c.length;
    const vowel=vTokens.find(token=>part.slice(i).startsWith(token));
    if(vowel){out+=matras[vowel];i+=vowel.length;}
    else if(i<part.length){out+="्";}
    continue;
   }
   const vowel=vTokens.find(token=>lower.startsWith(token));
   if(vowel){out+=vowels[vowel];i+=vowel.length;continue;}
   out+=part[i];i++;
  }
  return out;
 }).join("");
}

export default function HinglishTool(){
 const [input,setInput]=useState("namaste, mera naam yasir hai."),[output,setOutput]=useState(""),[error,setError]=useState("");
 function convert(){setError("");setOutput(convertRomanHindi(input));}
 function copy(){navigator.clipboard?.writeText(output).then(()=>setError("Hindi text copied.")).catch(()=>setError("Select the output and copy it manually."));}
 return <main className="seo-page"><div className="tool-page-top"><a className="back" href="/">← PicToSpec home</a><ToolSearch/></div><p className="kicker">HINDI TYPING HELPER</p><h1>Hinglish to Hindi Converter</h1><p className="lead">Type Hindi words using English letters and convert the transliteration into Devanagari text. Useful for quick Hindi messages, notes and drafts.</p><p className="note">This lightweight first version uses common Roman-to-Devanagari sound patterns. Roman Hindi has many spellings, so review the output, especially names, borrowed words and unusual spellings. It is not an AI translator.</p><section className="workspace" style={{margin:"24px 0",padding:20}}><h2>Type in English letters</h2><textarea value={input} onChange={e=>{setInput(e.target.value);setOutput("");}} rows={6} placeholder="namaste, aap kaise hain?" style={{width:"100%",padding:12,border:"1px solid #dbe5dd",borderRadius:8}}/><button className="primary" disabled={!input.trim()} onClick={convert} style={{marginTop:12}}>Convert to Hindi</button>{output&&<><h2>Hindi output</h2><textarea value={output} onChange={e=>setOutput(e.target.value)} rows={6} style={{width:"100%",padding:12,border:"1px solid #dbe5dd",borderRadius:8,fontSize:20}}/><button className="primary" onClick={copy} style={{marginTop:12}}>Copy Hindi text</button></>}{error&&<p className="error" role="status">{error}</p>}</section><h2>Examples</h2><ul><li><b>namaste</b> → नमस्ते</li><li><b>mera naam</b> → मेरा नाम</li><li><b>aap kaise hain</b> → आप कैसे हैं</li></ul><h2>How to use</h2><ol><li>Type a Hindi sentence using English letters.</li><li>Select Convert to Hindi.</li><li>Review the Devanagari output and correct any names or spelling.</li><li>Copy the result into your message or document.</li></ol><h2>Frequently asked questions</h2><div className="faq"><h3>Does this translate English into Hindi?</h3><p>No. It changes Romanized Hindi into Devanagari script. It does not translate English meaning into Hindi.</p></div><div className="faq"><h3>Why can some words look different?</h3><p>Roman Hindi has no single universal spelling. Try alternate spellings for long vowels and aspirated sounds if the result is not what you intended.</p></div></main>;
}
