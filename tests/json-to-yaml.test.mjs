import test from "node:test";
import assert from "node:assert/strict";
import { jsonToYaml } from "../lib/json-to-yaml.mjs";

test("converts nested JSON objects with valid indentation",()=>{
 assert.equal(jsonToYaml({name:"PicToSpec",limits:{free:10,pro:null}}),'"name": "PicToSpec"\n"limits":\n  "free": 10\n  "pro": null');
});
test("converts arrays of objects and nested arrays",()=>{
 assert.equal(jsonToYaml({tools:[{name:"JSON",tags:["data","web"]},{name:"CSS",tags:[]}]}),'"tools":\n  -\n    "name": "JSON"\n    "tags":\n      - "data"\n      - "web"\n  -\n    "name": "CSS"\n    "tags": []');
});
test("preserves quoted strings, multiline strings and special keys",()=>{
 const value={'a:b':'say "hello"\nnext','true':"yes","":""};
 assert.equal(jsonToYaml(value),'"a:b": '+JSON.stringify('say "hello"\nnext')+'\n"true": "yes"\n"": ""');
});
test("handles empty objects, arrays and root scalars",()=>{
 assert.equal(jsonToYaml({empty:{},items:[]}),'"empty": {}\n"items": []');
 assert.equal(jsonToYaml(null),"null");
 assert.equal(jsonToYaml(["a",1,false]),'- "a"\n- 1\n- false');
});
