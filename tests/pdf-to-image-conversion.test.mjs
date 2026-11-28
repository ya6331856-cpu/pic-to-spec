import test from "node:test";
import assert from "node:assert/strict";
import { validatePdfPageRange } from "../lib/pdf-page-range.mjs";
import { calculatePdfRenderScale } from "../lib/pdf-render-scale.mjs";

test("accepts a valid inclusive page range within the per-run limit", () => {
  assert.equal(validatePdfPageRange(2, 6, 20, 30), null);
});

test("rejects invalid, reversed and out-of-document page ranges", () => {
  assert.match(validatePdfPageRange(0, 2, 20, 30), /valid page range/i);
  assert.match(validatePdfPageRange(8, 7, 20, 30), /valid page range/i);
  assert.match(validatePdfPageRange(2, 21, 20, 30), /valid page range/i);
  assert.match(validatePdfPageRange(1.5, 2, 20, 30), /valid page range/i);
});

test("enforces the maximum number of pages in one conversion", () => {
  assert.match(validatePdfPageRange(1, 31, 500, 30), /up to 30 pages/i);
  assert.equal(validatePdfPageRange(471, 500, 500, 30), null);
});

test("calculates a render scale that stays within the pixel-area and scale caps", () => {
  const scale = calculatePdfRenderScale(6000, 4000, 24000000, 2);
  assert.ok(scale > 0);
  assert.ok(scale <= 2);
  assert.ok(6000 * 4000 * scale * scale <= 24000000 + 1);
});

test("rejects invalid page dimensions and invalid render constraints", () => {
  assert.equal(calculatePdfRenderScale(0, 100, 24000000, 2), null);
  assert.equal(calculatePdfRenderScale(100, -1, 24000000, 2), null);
  assert.equal(calculatePdfRenderScale(100, 100, 0, 2), null);
  assert.equal(calculatePdfRenderScale(Number.NaN, 100, 24000000, 2), null);
});
