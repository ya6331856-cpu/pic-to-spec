import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, toCsv } from "../lib/csv-conversion.mjs";

test("CSV parser handles BOM, CRLF and ordinary rows",()=>{assert.deepEqual(parseCsv("\uFEFFname,city\r\nAsha,Delhi"),[["name","city"],["Asha","Delhi"]]);});
test("CSV parser handles quoted commas, escaped quotes and newlines",()=>{assert.deepEqual(parseCsv('name,note\nAsha,"Delhi, India"\nRavi,"said ""hello"""\nMina,"line 1\nline 2"'),[["name","note"],["Asha","Delhi, India"],["Ravi",'said "hello"'],["Mina","line 1\nline 2"]]);});
test("CSV parser rejects malformed quote sequences",()=>{assert.throws(()=>parseCsv('name,note\nAsha,"open'),/unclosed quoted field/);assert.throws(()=>parseCsv('name,note\nAsha,"x"z'),/after a closing quote/);});
test("CSV parser preserves empty cells and skips blank rows",()=>{assert.deepEqual(parseCsv("a,b,c\n1,,3\n\n"),[["a","b","c"],["1","","3"]]);});
test("JSON to CSV quotes special cells and aligns object keys",()=>{assert.equal(toCsv([{name:"Asha",city:"Delhi, India"},{name:"Ravi",city:"Mumbai"}],false),'name,city\r\nAsha,"Delhi, India"\r\nRavi,Mumbai');});
test("CSV export protects spreadsheet formula-like values",()=>{assert.equal(toCsv([{value:"=1+1"},{value:" @SUM(A1:A2)"}]),"value\r\n'=1+1\r\n' @SUM(A1:A2)");});
test("CSV export rejects non-array and nested array records",()=>{assert.throws(()=>toCsv({a:1}),/array of objects/);assert.throws(()=>toCsv([[1,2]]),/array of objects/);});
test("CSV export handles empty arrays and JSON object cells",()=>{assert.equal(toCsv([]),"");assert.equal(toCsv([{meta:{ok:true}}],false),'meta\r\n"{""ok"":true}"');});

test("CSV parser supports semicolon and tab delimiters",()=>{assert.deepEqual(parseCsv("name;city\nAsha;Delhi",";"),[["name","city"],["Asha","Delhi"]]);assert.deepEqual(parseCsv("name\tcity\nAsha\tDelhi","\t"),[["name","city"],["Asha","Delhi"]]);});
test("JSON to CSV can flatten nested objects and add UTF-8 BOM",()=>{assert.equal(toCsv([{user:{name:"Asha",city:"Delhi"}}],false,{flattenNested:true,bom:true}),"\uFEFFuser.name,user.city\r\nAsha,Delhi");});
test("JSON to CSV supports alternate delimiters",()=>{assert.equal(toCsv([{name:"Asha",city:"Delhi"}],false,{delimiter:";"}),"name;city\r\nAsha;Delhi");});
