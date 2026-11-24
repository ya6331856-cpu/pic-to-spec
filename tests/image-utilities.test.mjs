import test from "node:test";
import assert from "node:assert/strict";
import { buildPngIco, parseImageDataUrl } from "../lib/image-utilities.mjs";

test("builds a single-image ICO directory around PNG bytes", () => {
  const png = Uint8Array.from([137,80,78,71,13,10,26,10,1,2,3]);
  const ico = buildPngIco(png);
  const view = new DataView(ico.buffer);
  assert.equal(view.getUint16(0,true),0);
  assert.equal(view.getUint16(2,true),1);
  assert.equal(view.getUint16(4,true),1);
  assert.equal(view.getUint32(12,true),png.length);
  assert.equal(view.getUint32(16,true),22);
  assert.deepEqual(ico.slice(22),png);
});
test("rejects invalid PNG bytes for ICO", () => {
  assert.throws(() => buildPngIco(new Uint8Array([1,2,3])));
});
test("parses supported image data URLs", () => {
  assert.deepEqual(parseImageDataUrl("data:image/png;base64,aGVsbG8="),{mimeType:"image/png",base64:"aGVsbG8="});
  assert.throws(() => parseImageDataUrl("data:text/html;base64,PHNjcmlwdD4="));
});
