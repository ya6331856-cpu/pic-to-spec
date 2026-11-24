import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPdfPageLabel,
  validatePdfStampRange,
  validatePdfWatermarkText
} from "../lib/pdf-stamp.mjs";

test("accepts a valid PDF page range", () => {
  assert.equal(validatePdfStampRange("1", "5", 5), null);
  assert.equal(validatePdfStampRange(2, 4, 8), null);
});

test("rejects blank, fractional, reversed and out-of-document ranges", () => {
  assert.match(validatePdfStampRange("", "3", 5), /valid page range/i);
  assert.match(validatePdfStampRange("1.5", "3", 5), /valid page range/i);
  assert.match(validatePdfStampRange(4, 2, 5), /valid page range/i);
  assert.match(validatePdfStampRange(1, 6, 5), /valid page range/i);
  assert.match(validatePdfStampRange(1, 1, 0), /valid page range/i);
});

test("enforces the maximum page count", () => {
  assert.equal(validatePdfStampRange(1, 3, 10, 3), null);
  assert.match(validatePdfStampRange(1, 4, 10, 3), /up to 3 pages/i);
  assert.match(validatePdfStampRange(1, 1, 10, 0), /up to 0 pages/i);
});

test("formats each supported page-number style", () => {
  assert.equal(formatPdfPageLabel(2, 8, "number"), "2");
  assert.equal(formatPdfPageLabel(2, 8, "page"), "Page 2");
  assert.equal(formatPdfPageLabel(2, 8, "page-of"), "Page 2 of 8");
  assert.equal(formatPdfPageLabel(2, 8, "fraction"), "2 / 8");
});

test("rejects invalid page-number values and formats", () => {
  assert.throws(() => formatPdfPageLabel(0, 8), RangeError);
  assert.throws(() => formatPdfPageLabel(9, 8), RangeError);
  assert.throws(() => formatPdfPageLabel(1, 0), RangeError);
  assert.throws(() => formatPdfPageLabel(1, 8, "unknown"), RangeError);
});

test("accepts ordinary watermark text and trims surrounding spaces", () => {
  assert.equal(validatePdfWatermarkText("  CONFIDENTIAL  "), null);
  assert.equal(validatePdfWatermarkText("Invoice copy 2026"), null);
});

test("rejects blank, overlong and unsupported Unicode watermark text", () => {
  assert.match(validatePdfWatermarkText("   "), /enter watermark text/i);
  assert.match(validatePdfWatermarkText("A".repeat(81)), /no more than 80/i);
  assert.match(validatePdfWatermarkText("नमस्ते"), /basic English/i);
});
