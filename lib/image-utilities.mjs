export function buildPngIco(pngBytes) {
  const png = pngBytes instanceof Uint8Array ? pngBytes : new Uint8Array(pngBytes);
  const signature = [137,80,78,71,13,10,26,10];
  if (png.length < 8 || !signature.every((byte, index) => png[index] === byte)) throw new Error("A valid PNG image is required.");
  if (png.length > 0xffffffff - 22) throw new Error("Image is too large for an ICO file.");
  const output = new Uint8Array(22 + png.length);
  const view = new DataView(output.buffer);
  view.setUint16(0, 0, true); view.setUint16(2, 1, true); view.setUint16(4, 1, true);
  output[6] = 0; output[7] = 0; output[8] = 1; output[9] = 0;
  view.setUint16(10, 32, true); view.setUint32(12, png.length, true); view.setUint32(16, 22, true);
  output.set(png, 22);
  return output;
}

export function parseImageDataUrl(value) {
  const match = /^data:(image\/(?:png|jpeg|webp|gif|bmp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(String(value).trim());
  if (!match || match[2].length % 4 !== 0) {
    throw new Error("Paste a complete, valid Base64 image data URL (PNG, JPG, WebP, GIF or BMP).");
  }
  const base64 = match[2];
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  if (base64.slice(0, base64.length - padding).includes("=")) {
    throw new Error("The Base64 padding is invalid.");
  }
  return { mimeType: match[1], base64 };
}

export function safeSvgSource(source) {
  const text = String(source || "").trim();
  if (!text || text.length > 5_000_000) throw new Error("Paste SVG markup under 5 MB.");
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error("SVG document types and custom entities are not allowed.");
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror") || doc.documentElement?.localName !== "svg") throw new Error("Please provide valid SVG markup.");
  if (doc.querySelector("script,foreignObject,iframe,object,embed")) throw new Error("This SVG contains active or embedded content and cannot be converted safely.");
  for (const el of Array.from(doc.querySelectorAll("*"))) {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name) || /javascript:|vbscript:|data:text\/html/i.test(attr.value)) throw new Error("This SVG contains an unsafe attribute or URL.");
      if ((attr.name === "href" || attr.name.endsWith(":href")) && attr.value && !attr.value.startsWith("#")) throw new Error("External SVG resources are not allowed.");
    }
  }
  return new XMLSerializer().serializeToString(doc);
}
