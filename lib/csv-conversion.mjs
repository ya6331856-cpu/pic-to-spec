export function parseCsv(input, delimiter = ",") {
 if(typeof delimiter!=="string"||delimiter.length!==1||/["\r\n]/.test(delimiter))throw new Error("Choose a single valid CSV delimiter.");
 const rows=[];let row=[];let field="";let quoted=false;let closedQuote=false;const source=input.replace(/^\uFEFF/,"");
 const pushRow=()=>{row.push(field);if(row.length>1||row.some(v=>v!==""))rows.push(row);row=[];field="";closedQuote=false;};
 for(let i=0;i<source.length;i++){const c=source[i];
  if(quoted){if(c==='"'&&source[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=false;closedQuote=true;}else field+=c;}
  else if(closedQuote){if(c===delimiter){row.push(field);field="";closedQuote=false;}else if(c==="\n"||c==="\r"){if(c==="\r"&&source[i+1]==="\n")i++;pushRow();}else throw new Error("Unexpected character after a closing quote in the CSV.");}
  else if(c==='"'){if(field.length!==0)throw new Error("A quoted CSV field must start with a quote at the beginning of the field.");quoted=true;}
  else if(c===delimiter){row.push(field);field="";}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&source[i+1]==="\n")i++;pushRow();}
  else field+=c;
 }
 if(quoted)throw new Error("CSV has an unclosed quoted field.");row.push(field);if(row.length>1||row.some(v=>v!==""))rows.push(row);return rows;
}
function flattenRecord(value,prefix="",out={}) {
 for(const [key,item] of Object.entries(value)){const path=prefix?prefix+"."+key:key;if(item&&typeof item==="object"&&!Array.isArray(item)){if(Object.keys(item).length)flattenRecord(item,path,out);else out[path]="{}";}else out[path]=item;}
 return out;
}
export function toCsv(value, spreadsheetSafe=true, options={}) {
 const {delimiter=",",flattenNested=false,bom=false}=options;
 if(typeof delimiter!=="string"||delimiter.length!==1||/["\r\n]/.test(delimiter))throw new Error("Choose a single valid CSV delimiter.");
 if(!Array.isArray(value)||value.some(v=>!v||typeof v!=="object"||Array.isArray(v)))throw new Error("JSON must be an array of objects to convert to CSV.");
 if(value.length===0)return "";
 const objects=flattenNested?value.map(v=>flattenRecord(v)):value;const headers=Array.from(new Set(objects.flatMap(o=>Object.keys(o))));
 const cell=(v)=>{let s=v==null?"":typeof v==="object"?JSON.stringify(v):String(v);if(spreadsheetSafe&&/^\s*[=+\-@]/.test(s))s="'"+s;return /[",\r\n]/.test(s)||s.includes(delimiter)?'"'+s.replace(/"/g,'""')+'"':s;};
 const result=[headers.map(cell).join(delimiter),...objects.map(o=>headers.map(h=>cell(o[h])).join(delimiter))].join("\r\n");return (bom?"\uFEFF":"")+result;
}
