export function calculatePdfRenderScale(width, height, maxPixels = 24000000, maxScale = 2) {
  if (![width, height, maxPixels, maxScale].every(Number.isFinite) || width <= 0 || height <= 0 || maxPixels < 1 || maxScale <= 0) return null;
  const scale = Math.min(maxScale, Math.sqrt(maxPixels / (width * height)));
  return Number.isFinite(scale) && scale > 0 ? scale : null;
}
