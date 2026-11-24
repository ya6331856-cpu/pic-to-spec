import test from "node:test";
import assert from "node:assert/strict";
import { validateImageFile, validateImageDimensions, validateCropBounds } from "../lib/image-validation.mjs";
import { validatePdfPageRange } from "../lib/pdf-page-range.mjs";

test("image upload accepts supported formats within size limit",()=>{assert.equal(validateImageFile("image/jpeg",1024),null);assert.equal(validateImageFile("image/png",20*1024*1024),null);assert.equal(validateImageFile("image/webp",10),null);});
test("image upload rejects unsupported formats and oversized files",()=>{assert.match(validateImageFile("image/gif",10),/JPG, PNG or WebP/);assert.match(validateImageFile("image/jpeg",20*1024*1024+1),/smaller than 20 MB/);});
test("image dimensions enforce integer positive safe bounds",()=>{assert.equal(validateImageDimensions(6000,4000),true);assert.equal(validateImageDimensions(0,100),false);assert.equal(validateImageDimensions(1.5,100),false);assert.equal(validateImageDimensions(6001,100),false);});
test("crop bounds allow exact edges and reject overflow",()=>{assert.equal(validateCropBounds(0,0,100,100,100,100),true);assert.equal(validateCropBounds(90,90,10,10,100,100),true);assert.equal(validateCropBounds(90,90,11,10,100,100),false);assert.equal(validateCropBounds(-1,0,10,10,100,100),false);});
test("PDF page range accepts valid single and multi-page selections",()=>{assert.equal(validatePdfPageRange(1,1,5),null);assert.equal(validatePdfPageRange(3,5,10),null);});
test("PDF page range rejects invalid, reversed and out-of-document pages",()=>{assert.match(validatePdfPageRange(0,1,5),/valid page range/);assert.match(validatePdfPageRange(4,3,5),/valid page range/);assert.match(validatePdfPageRange(1,6,5),/valid page range/);});
test("PDF page range enforces per-download page cap",()=>{assert.match(validatePdfPageRange(1,31,40),/up to 30 pages/);assert.equal(validatePdfPageRange(1,30,30),null);});
