import test from "node:test";
import assert from "node:assert/strict";
import { calculateResizeDimensions } from "../lib/image-geometry.mjs";
import { calculatePdfRenderScale } from "../lib/pdf-render-scale.mjs";

test("resize preserves aspect ratio while fitting inside target box",()=>{assert.deepEqual(calculateResizeDimensions(4000,2000,600,600,true),{width:600,height:300});assert.deepEqual(calculateResizeDimensions(2000,4000,600,600,true),{width:300,height:600});});
test("resize can use exact dimensions when aspect ratio is disabled",()=>{assert.deepEqual(calculateResizeDimensions(4000,2000,600,600,false),{width:600,height:600});});
test("resize can upscale without distorting proportions",()=>{assert.deepEqual(calculateResizeDimensions(100,50,600,600,true),{width:600,height:300});});
test("resize rejects invalid dimensions and outputs over pixel budget",()=>{assert.equal(calculateResizeDimensions(0,100,600,600,true),null);assert.equal(calculateResizeDimensions(100,100,0,600,true),null);assert.equal(calculateResizeDimensions(100,100,600,600,false,300000),null);});
test("PDF render scale stays within maximum scale for ordinary pages",()=>{assert.equal(calculatePdfRenderScale(600,800),2);});
test("PDF render scale reduces very large pages to pixel budget",()=>{const scale=calculatePdfRenderScale(10000,10000);assert.ok(scale<1);assert.ok(Math.floor(10000*scale)**2<=24000000);});
test("PDF render scale rejects invalid viewport dimensions",()=>{assert.equal(calculatePdfRenderScale(0,800),null);assert.equal(calculatePdfRenderScale(Number.NaN,800),null);});
