export function parseCsv(input) {
 const rows=[]; let row=[]; let field=""; let quoted=false; let closedQuote=false;
 const pushRow=()=>{row.push(field);if(row.length>1||row.some(v=>v!==""))rows.push(row);row=[];field="";closedQuote=false;};
 const source=input.replace(/^\uFEFF/,"");
 for(let i=0;i<source.length;i++){
  const c=source[i];
  if(quoted){if(c==='"'&&source[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=false;closedQuote=true;}else field+=c;}
  else if(closedQuote){if(c===","){row.push(field);field="";closedQuote=false;}else if(c==="\n"||c==="\r"){if(c==="\r"&&source[i+1]==="\n")i++;pushRow();}else throw new Error("Unexpected character after a closing quote in the CSV.");}
  else if(c==='"'){if(field.length!==0)throw new Error("A quoted CSV field must start with a quote at the beginning of the field.");quoted=true;}
  else if(c===","){row.push(field);field="";}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&source[i+1]==="\n")i++;pushRow();}
  else field+=c;
 }
 if(quoted)throw new Error("CSV has an unclosed quoted field.");
 row.push(field);if(row.length>1||row.some(v=>v!==""))rows.push(row);
 return rows;
}
export function toCsv(value, spreadsheetSafe=true) {
 if(!Array.isArray(value)||value.some(v=>!v||typeof v!=="object"||Array.isArray(v)))throw new Error("JSON must be an array of objects to convert to CSV.");
 const objects=value;if(objects.length===0)return "";
 const headers=Array.from(new Set(objects.flatMap(o=>Object.keys(o))));
 const cell=(v)=>{let s=v==null?"":typeof v==="object"?JSON.stringify(v):String(v);if(spreadsheetSafe&&/^\s*[=+\-@]/.test(s))s="'"+s;return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 return [headers.map(cell).join(","),...objects.map(o=>headers.map(h=>cell(o[h])).join(","))].join("\r\n");
}
