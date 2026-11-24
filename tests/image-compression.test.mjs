import test from "node:test";
import assert from "node:assert/strict";
import { findBestImageQuality } from "../lib/image-compression.mjs";

test("compression keeps maximum quality when it already meets target",async()=>{const calls=[];const result=await findBestImageQuality(async q=>{calls.push(q);return {quality:q,size:Math.round(100000*q)};},96000);assert.equal(result.quality,0.96);assert.deepEqual(calls,[0.96]);});
test("compression finds highest acceptable quality under byte limit",async()=>{const result=await findBestImageQuality(async q=>({quality:q,size:Math.round(200000*q)}),100000,20);assert.ok(result);assert.ok(result.size<=100000);assert.ok(result.quality>0.49&&result.quality<0.51);});
test("compression reports no result when even minimum quality is too large",async()=>{const result=await findBestImageQuality(async q=>({quality:q,size:200000}),100000,18);assert.equal(result,null);});
test("compression rejects invalid limits and encoder results",async()=>{await assert.rejects(()=>findBestImageQuality(async q=>({size:100}),0),/Invalid image quality/);await assert.rejects(()=>findBestImageQuality(async q=>null,100),/valid Blob/);});
