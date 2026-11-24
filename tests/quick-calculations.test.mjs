import test from "node:test";
import assert from "node:assert/strict";
import { calculateQuickTool } from "../lib/quick-calculations.mjs";

test("GST adds correct tax and splits intra-state tax",()=>{const r=calculateQuickTool("gst","1000","18","","","intra");assert.equal(r.main,"₹180");assert.match(r.extra,/CGST: ₹90/);assert.match(r.extra,/SGST: ₹90/);assert.match(r.extra,/Total including GST: ₹1,180/);});
test("GST interstate displays IGST",()=>{const r=calculateQuickTool("gst","1000","18","","","inter");assert.match(r.extra,/IGST: ₹180/);});
test("EMI handles zero interest",()=>{const r=calculateQuickTool("emi","12000","0","1","","intra");assert.equal(r.main,"₹1,000");assert.match(r.extra,/Interest: ₹0/);});
test("EMI uses reducing balance formula",()=>{const r=calculateQuickTool("emi","500000","10","5","","intra");assert.ok(r.main.startsWith("₹10,")||r.main.startsWith("₹10"));assert.match(r.extra,/Total payment:/);});
test("percentage rejects zero denominator and calculates valid values",()=>{assert.equal(calculateQuickTool("percentage","25","0","","","intra"),"The second value cannot be zero.");assert.equal(calculateQuickTool("percentage","25","40","","","intra").main,"62.50%");});
test("discount returns sale price and savings",()=>{const r=calculateQuickTool("discount","2000","15","","","intra");assert.equal(r.main,"₹1,700");assert.equal(r.extra,"You save ₹300");});
test("GST and discount reject rates above 100",()=>{assert.equal(calculateQuickTool("gst","100","101","","","intra"),"GST rate must be between 0% and 100%.");assert.equal(calculateQuickTool("discount","100","101","","","intra"),"Discount must be between 0% and 100%.");});
test("age calculation handles birthday and leap-year calendar dates",()=>{const r=calculateQuickTool("age","","","","2000-02-29","intra",new Date(2026,1,28));assert.equal(r.main,"25 years");assert.equal(r.extra,"11 months and 30 days");});
test("age rejects future and invalid dates",()=>{assert.equal(calculateQuickTool("age","","","","2027-01-01","intra",new Date(2026,0,1)),"Choose a valid date in the past.");assert.equal(calculateQuickTool("age","","","","2025-02-30","intra",new Date(2026,0,1)),"Choose a valid date in the past.");});
