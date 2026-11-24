export function safeBaseName(name) {
  const base = String(name || "image").replace(/\\.[^.]*$/, "").normalize("NFKC").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  return base || "image";
}

export function renamePattern(index, total, prefix = "image", start = 1, digits = 3) {
  const n = Math.max(0, Number(start) || 0) + index;
  const width = Math.min(8, Math.max(1, Number(digits) || 3));
  return `${safeBaseName(prefix)}-${String(n).padStart(width, "0")}`;
}

export function readJpegExif(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const result = { found: false, tags: {} };
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return result;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (length < 2 || offset + 2 + length > bytes.length) break;
    const start = offset + 4;
    if (marker === 0xe1 && length >= 8 && String.fromCharCode(...bytes.slice(start, start + 6)) === "Exif\\0\\0") {
      const tiff = start + 6;
      const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49;
      const big = bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d;
      if (!little && !big) return result;
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const u16 = p => view.getUint16(p, little), u32 = p => view.getUint32(p, little);
      if (u16(tiff + 2) !== 42) return result;
      const ifd = tiff + u32(tiff + 4);
      if (ifd + 2 > bytes.length) return result;
      result.found = true;
      const names = { 0x010f: "Camera make", 0x0110: "Camera model", 0x0132: "Date modified", 0x9003: "Date taken", 0x9286: "User comment", 0xa002: "Image width", 0xa003: "Image height" };
      const readIfd = pos => {
        if (pos + 2 > bytes.length) return;
        const count = u16(pos);
        for (let i = 0; i < Math.min(count, 512); i++) {
          const entry = pos + 2 + i * 12;
          if (entry + 12 > bytes.length) break;
          const tag = u16(entry), type = u16(entry + 2), n = u32(entry + 4);
          if (!names[tag]) continue;
          let value;
          if (type === 2 && n > 0 && n < 1024) {
            const data = n <= 4 ? entry + 8 : tiff + u32(entry + 8);
            if (data + n <= bytes.length) value = String.fromCharCode(...bytes.slice(data, data + n)).replace(/\\0+$/, "").trim();
          } else if (type === 3 && n === 1) value = u16(entry + 8);
          else if (type === 4 && n === 1) value = u32(entry + 8);
          if (value !== undefined && value !== "") result.tags[names[tag]] = value;
        }
      };
      readIfd(ifd);
      const exifPointerEntry = ifd + 2;
      const count = u16(ifd);
      for (let i = 0; i < Math.min(count, 512); i++) {
        const entry = exifPointerEntry + i * 12;
        if (entry + 12 > bytes.length) break;
        if (u16(entry) === 0x8769) { const pointer = tiff + u32(entry + 8); readIfd(pointer); break; }
      }
      return result;
    }
    offset += 2 + length;
  }
  return result;
}

export function clampRegion(value, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, Math.round(n)));
}
