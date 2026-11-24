export function jsonToYaml(value) {
 const emit=(item,indent)=>{
  const pad=" ".repeat(indent);
  if(Array.isArray(item)){
   if(item.length===0)return pad+"[]";
   return item.map(entry=>{
    if(entry!==null&&typeof entry==="object")return pad+"-\n"+emit(entry,indent+2);
    return pad+"- "+scalar(entry);
   }).join("\n");
  }
  if(item!==null&&typeof item==="object"){
   const entries=Object.entries(item);
   if(entries.length===0)return pad+"{}";
   return entries.map(([key,entry])=>{
    const yamlKey=JSON.stringify(key);
    if(entry!==null&&typeof entry==="object"&&(Array.isArray(entry)?entry.length>0:Object.keys(entry).length>0))return pad+yamlKey+":\n"+emit(entry,indent+2);
    return pad+yamlKey+": "+scalar(entry);
   }).join("\n");
  }
  return pad+scalar(item);
 };
 return emit(value,0);
}
function scalar(value){
 if(typeof value==="string")return JSON.stringify(value);
 if(value===null)return "null";
 if(typeof value==="object")return JSON.stringify(value);
 return String(value);
}
