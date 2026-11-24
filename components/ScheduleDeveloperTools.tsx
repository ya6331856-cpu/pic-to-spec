"use client";

import { useMemo, useState } from "react";
import ToolSearch from "@/components/ToolSearch";

type Mode = "sql" | "cron";
const inputStyle = { width:"100%", padding:14, border:"1px solid #dce7df", borderRadius:12, fontSize:14, color:"#17251e", background:"#fff", fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace" } as const;
const buttonStyle = { border:0, background:"#14634b", color:"#fff", padding:"11px 16px", borderRadius:9, fontWeight:700, cursor:"pointer" } as const;
const presets = [
 {label:"Every minute",value:"* * * * *"},
 {label:"Every 5 minutes",value:"*/5 * * * *"},
 {label:"Every hour",value:"0 * * * *"},
 {label:"Every day at 9:00 AM",value:"0 9 * * *"},
 {label:"Every weekday at 9:00 AM",value:"0 9 * * 1-5"},
 {label:"Every Sunday at midnight",value:"0 0 * * 0"},
 {label:"First day of each month",value:"0 0 1 * *"}
];
const fieldInfo = [
 {name:"Minute",min:0,max:59,hint:"0–59"},
 {name:"Hour",min:0,max:23,hint:"0–23"},
 {name:"Day of month",min:1,max:31,hint:"1–31"},
 {name:"Month",min:1,max:12,hint:"1–12"},
 {name:"Day of week",min:0,max:7,hint:"0–7 (0 or 7 = Sunday)"}
];
function validateField(value:string,min:number,max:number):string {
 const v=value.trim(); if(!v)return "This field is required.";
 for(const part of v.split(",")){
  if(!part)return "Remove empty comma-separated values.";
  const pieces=part.split("/"); if(pieces.length>2)return "Use at most one / step.";
  const base=pieces[0],step=pieces[1];
  if(step!==undefined&&(!/^\\d+$/.test(step)||Number(step)<1||Number(step)>max-min+1))return "Step must be a positive whole number within this field's range.";
  if(base==="*")continue;
  const range=base.split("-");
  if(range.length===2){
   if(!range.every(x=>/^\\d+$/.test(x)))return "Use numeric ranges such as 1-5.";
   const a=Number(range[0]),b=Number(range[1]);
   if(a<min||b>max||a>b)return `Use a range from ${min} to ${max} with the start no greater than the end.`;
  } else if(range.length===1){
   if(!/^\\d+$/.test(base)||Number(base)<min||Number(base)>max)return `Use * or a number from ${min} to ${max}.`;
  } else return "Invalid range.";
 }
 return "";
}
function describeField(value:string,label:string):string {
 if(value==="*")return `every ${label}`;
 if(value.startsWith("*/"))return `every ${value.slice(2)} ${label}(s)`;
 if(value.includes(","))return `${label}(s) ${value}`;
 if(value.includes("-"))return `${label}(s) ${value}`;
 return `at ${label} ${value}`;
}
function explainCron(expr:string):string {
 const f=expr.trim().split(/\\s+/);
 if(f.length!==5)return "A standard cron expression has five fields: minute, hour, day of month, month and day of week.";
 const [m,h,d,mo,w]=f;
 if(expr.trim()==="* * * * *")return "Runs every minute.";
 if(m.startsWith("*/")&&h==="*"&&d==="*"&&mo==="*"&&w==="*")return `Runs every ${m.slice(2)} minutes.`;
 if(m!=="*"&&h!=="*"&&d==="*"&&mo==="*"&&w==="*")return `Runs at minute ${m} of hour ${h}, every day.`;
 const days=w==="1-5"?"on weekdays":w==="0,6"?"on weekends":w==="*"?"every day":`when weekday matches ${w}`;
 const date=d==="*"?"":`on day ${d} of the month `;
 const month=mo==="*"?"":`in month ${mo} `;
 return `Runs at minute ${m} of hour ${h}, ${date}${month}${days}.`.replace(/, ,/g,",").replace(/\\s+/g," ").trim();
}
const keywords = new Set("select from where and or not null is in like between join inner left right full outer on as distinct group by having order limit offset union all insert into values update set delete create alter drop table index view case when then else end asc desc nulls first last exists with recursive returning conflict do default primary key foreign references unique check constraint truncate grant revoke explain analyze begin commit rollback".split(" "));
const clauseStarts = new Set(["FROM","WHERE","GROUP BY","HAVING","ORDER BY","LIMIT","OFFSET","UNION","LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL JOIN","JOIN","ON","SET","VALUES","RETURNING","WHEN","ELSE","END"]);
function sqlTokens(source:string):string[] {
 const out:string[]=[]; let i=0;
 while(i<source.length){
  const c=source[i],n=source[i+1];
  if(/\\s/.test(c)){i++;continue;}
  if(c==="'"||c==='"'||c==="\x60"){
   const q=c;let j=i+1;while(j<source.length){if(source[j]==="\\"){j+=2;continue;}if(source[j]===q){if(source[j+1]===q){j+=2;continue;}j++;break;}j++;}out.push(source.slice(i,j));i=j;continue;
  }
  if(c==="-"&&n==="-"){let j=source.indexOf("\n",i);if(j<0)j=source.length;out.push(source.slice(i,j));i=j;continue;}
  if(c==="/"&&n==="*"){let j=source.indexOf("*/",i+2);j=j<0?source.length:j+2;out.push(source.slice(i,j));i=j;continue;}
  if(/[(),;]/.test(c)){out.push(c);i++;continue;}
  let j=i+1;while(j<source.length&&!/\\s|[(),;]/.test(source[j])&&!(source[j]==="-"&&source[j+1]==="-")&&!(source[j]==="/"&&source[j+1]==="*"))j++;
  out.push(source.slice(i,j));i=j;
 }
 return out;
}
function formatSql(source:string):string {
 const tokens=sqlTokens(source);let out="",depth=0,lineStart=true,prev="";
 const write=(s:string)=>{if(lineStart){out+="  ".repeat(depth);lineStart=false;}out+=s;};
 const newline=()=>{out=out.trimEnd()+"\\n";lineStart=true;};
 for(let i=0;i<tokens.length;i++){
  const raw=tokens[i],upper=raw.toUpperCase(),next=tokens[i+1]?.toUpperCase();
  if(raw==="("){if(prev&&/[\\w'"`)]$/.test(prev))write(" ");write("(");depth++;newline();prev=raw;continue;}
  if(raw===")"){depth=Math.max(0,depth-1);newline();write(")");prev=raw;continue;}
  if(raw===","){write(",");newline();prev=raw;continue;}
  if(raw===";"){write(";");newline();prev=raw;continue;}
  if(raw.startsWith("--")||raw.startsWith("/*")){if(!lineStart)write(" ");write(raw);newline();prev=raw;continue;}
  const pair=upper+" "+(next||"");
  const clause=clauseStarts.has(pair)?pair:clauseStarts.has(upper)?upper:"";
  if(clause){if(out.trim())newline();write(clause);if(pair===clause&&next){i++;}write(" ");prev=clause;continue;}
  const word=/^[a-z_][a-z0-9_$]*$/i.test(raw);
  const value=word&&keywords.has(raw.toLowerCase())?upper:raw;
  if(!lineStart&&out&&!/[\\s(]$/.test(out))write(" ");
  write(value);prev=value;
 }
 return out.trim()+"\\n";
}
function download(text:string,name:string,type:string){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
export default function ScheduleDeveloperTools({mode}:{mode:Mode}){
 const [sql,setSql]=useState("select id, name, email from users where active = true and created_at >= '2026-01-01' order by created_at desc limit 20;");
 const [cron,setCron]=useState("* * * * *");const [fields,setFields]=useState(["*","*","*","*","*"]);const [copied,setCopied]=useState(false);
 const sqlOutput=useMemo(()=>{try{return sql.trim()?formatSql(sql):"";}catch{return ""; }},[sql]);
 const cronError=useMemo(()=>{const parts=cron.trim().split(/\\s+/);if(parts.length!==5)return "Enter exactly five fields separated by spaces.";for(let i=0;i<5;i++){const err=validateField(parts[i],fieldInfo[i].min,fieldInfo[i].max);if(err)return `${fieldInfo[i].name}: ${err}`;}return "";},[cron]);
 function updateField(index:number,value:string){const next=[...fields];next[index]=value;setFields(next);setCron(next.join(" "));}
 async function copy(value:string){try{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1400);}catch{setCopied(false);}}
 const title=mode==="sql"?"SQL Formatter":"Cron Expression Generator";
 const description=mode==="sql"?"Format SQL queries with consistent indentation, uppercase keywords and readable clause breaks. This lightweight formatter preserves quoted strings and comments; it is not a full SQL parser.":"Build and validate standard five-field cron expressions. Choose a schedule, edit each field and read a plain-language explanation.";
 return <main style={{maxWidth:1000,margin:"36px auto",padding:20,color:"#17251e"}}>
  <div className="tool-page-top"><a href="/" style={{color:"#14634b",fontWeight:700,textDecoration:"none"}}>← PicToSpec home</a><ToolSearch/></div>
  <p style={{fontSize:11,letterSpacing:2,color:"#14634b",fontWeight:800,marginTop:35}}>FREE DEVELOPER TOOL</p><h1 style={{fontSize:"clamp(30px,6vw,44px)",letterSpacing:-1.3,margin:"10px 0"}}>{title}</h1><p style={{color:"#46556b",lineHeight:1.7}}>{description}</p>
  {mode==="sql"?<section style={{display:"grid",gap:14,marginTop:24}}>
   <label style={{display:"grid",gap:8,fontWeight:700}}>SQL query<textarea value={sql} onChange={e=>setSql(e.target.value)} spellCheck={false} style={{...inputStyle,minHeight:230}} placeholder="Paste SQL query here…"/></label>
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button type="button" style={buttonStyle} onClick={()=>setSql(formatSql(sql))}>Format SQL</button><button type="button" style={{...buttonStyle,background:"#eaf2ed",color:"#174c39"}} onClick={()=>setSql("select id, name, email from users where active = true order by created_at desc limit 20;")}>Load sample</button><button type="button" disabled={!sqlOutput} style={{...buttonStyle,background:"#334155",opacity:sqlOutput?1:.45}} onClick={()=>copy(sqlOutput)}>{copied?"Copied":"Copy formatted SQL"}</button><button type="button" disabled={!sqlOutput} style={{...buttonStyle,background:"#334155",opacity:sqlOutput?1:.45}} onClick={()=>download(sqlOutput,"formatted-query.sql","text/sql")}>Download .sql</button></div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>Formatted output<textarea readOnly value={sqlOutput} spellCheck={false} style={{...inputStyle,minHeight:230,background:"#f7faf8"}}/></label>
   <p style={{color:"#607168",fontSize:13,lineHeight:1.6}}>Formatting is lexical, not database-aware. Review the result before running it, especially vendor-specific syntax, procedural SQL and complex expressions.</p>
  </section>:<section style={{display:"grid",gap:18,marginTop:24}}>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{presets.map(p=><button key={p.value} type="button" style={{...buttonStyle,background:cron===p.value?"#14634b":"#eaf2ed",color:cron===p.value?"#fff":"#174c39"}} onClick={()=>{setCron(p.value);setFields(p.value.split(" "));}}>{p.label}</button>)}</div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:12}}>{fieldInfo.map((f,i)=><label key={f.name} style={{display:"grid",gap:7,fontWeight:700}}>{f.name}<input value={fields[i]} onChange={e=>updateField(i,e.target.value)} style={inputStyle}/><small style={{color:"#607168",fontWeight:400}}>{f.hint}</small></label>)}</div>
   <label style={{display:"grid",gap:8,fontWeight:700}}>Cron expression<input value={cron} onChange={e=>{setCron(e.target.value);const parts=e.target.value.trim().split(/\\s+/);if(parts.length===5)setFields(parts);}} style={inputStyle} spellCheck={false}/></label>
   {cronError?<p role="alert" style={{color:"#b42318",fontWeight:700}}>{cronError}</p>:<div style={{padding:16,border:"1px solid #dce7df",borderRadius:12,background:"#f7faf8"}}><strong>Schedule explanation</strong><p style={{margin:"8px 0 0",lineHeight:1.6}}>{explainCron(cron)}</p></div>}
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button type="button" disabled={!!cronError} style={{...buttonStyle,opacity:cronError?.45:1}} onClick={()=>copy(cron)}>{copied?"Copied":"Copy expression"}</button><button type="button" disabled={!!cronError} style={{...buttonStyle,background:"#334155",opacity:cronError?.45:1}} onClick={()=>download(cron+"\\n","cron-expression.txt","text/plain")}>Download .txt</button><button type="button" style={{...buttonStyle,background:"#eaf2ed",color:"#174c39"}} onClick={()=>{setCron("* * * * *");setFields(["*","*","*","*","*"]);}}>Reset</button></div>
   <div style={{color:"#607168",fontSize:13,lineHeight:1.6}}><strong>Field order:</strong> minute · hour · day of month · month · day of week. Supports *, lists, ranges and step values. Day-of-week 0 and 7 both mean Sunday. This uses standard five-field cron syntax; some platforms add seconds or special operators.</div>
  </section>}
  <p style={{marginTop:24,color:"#607168",fontSize:13,lineHeight:1.6}}>Runs locally in your browser. Your input is not uploaded to PicToSpec.</p>
 </main>;
}
