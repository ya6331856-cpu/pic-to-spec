import test from "node:test";
import assert from "node:assert/strict";
import { safeBaseName, renamePattern, readJpegExif, clampRegion } from "../lib/image-batch-tools.mjs";

test("safe filename removes path and unsafe punctuation", () => {
  assert.equal(safeBaseName("../My vacation photo!.JPG"), "My-vacation-photo");
});
test("rename pattern creates padded sequential names", () => {
  assert.equal(renamePattern(2, 4, "Trip 2026", 5, 4), "Trip-2026-0007");
});
test("EXIF parser safely handles non-JPEG and malformed JPEG", () => {
  assert.deepEqual(readJpegExif(new Uint8Array([1,2,3])), { found: false, tags: {} });
  assert.deepEqual(readJpegExif(new Uint8Array([0xff,0xd8,0xff,0xe1,0,50])), { found: false, tags: {} });
});
test("region values are clamped to image bounds", () => {
  assert.equal(clampRegion(-5, 100), 0);
  assert.equal(clampRegion(120, 100), 100);
  assert.equal(clampRegion(23.7, 100), 24);
});
