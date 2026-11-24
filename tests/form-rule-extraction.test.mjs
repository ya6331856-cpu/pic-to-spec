import test from "node:test";
import assert from "node:assert/strict";
import { createDefaultFormRequirements, extractFormRequirements } from "../lib/form-rule-extraction.mjs";

test("returns independent defaults for photo and signature", () => {
  const first = createDefaultFormRequirements();
  first[0].maxKB = 999;
  assert.equal(createDefaultFormRequirements()[0].maxKB, 50);
});

test("extracts photo and signature rules independently", () => {
  const result = extractFormRequirements(
    "Photo: maximum 50 KB, dimensions 200 x 230 pixels, JPG only. Signature: maximum 20 KB, 140 x 60 px, PNG only."
  );
  assert.deepEqual(result, [
    { kind: "photo", label: "Photo", maxKB: 50, width: 200, height: 230, format: "image/jpeg" },
    { kind: "signature", label: "Signature", maxKB: 20, width: 140, height: 60, format: "image/png" }
  ]);
});

test("does not mistake millimetres or unlabelled dimensions for pixels", () => {
  const result = extractFormRequirements("Photo 35 x 45 mm. Signature 140 x 60.");
  assert.equal(result[0].width, 200);
  assert.equal(result[0].height, 230);
  assert.equal(result[1].width, 140);
  assert.equal(result[1].height, 60);
});

test("does not carry a photo rule across the signature label", () => {
  const result = extractFormRequirements("Photo upload required. Signature must be PNG only and 140 x 60 pixels.");
  assert.equal(result[0].format, "image/jpeg");
  assert.equal(result[0].width, 200);
  assert.equal(result[1].format, "image/png");
  assert.equal(result[1].width, 140);
  assert.equal(result[1].height, 60);
});

test("ignores unsupported or out-of-range values", () => {
  const result = extractFormRequirements("Photo 99999 KB and 9000 x 9000 pixels.");
  assert.equal(result[0].maxKB, 50);
  assert.equal(result[0].width, 200);
  assert.equal(result[0].height, 230);
});
