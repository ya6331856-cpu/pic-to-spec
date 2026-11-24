export function calculateResizeDimensions(sourceWidth, sourceHeight, targetWidth, targetHeight, keepAspectRatio, maxPixels = 40000000) {
  if (![sourceWidth, sourceHeight, targetWidth, targetHeight, maxPixels].every(Number.isFinite) ||
      ![sourceWidth, sourceHeight, targetWidth, targetHeight, maxPixels].every(Number.isInteger) ||
      sourceWidth < 1 || sourceHeight < 1 || targetWidth < 1 || targetHeight < 1 || maxPixels < 1) return null;
  let width = targetWidth, height = targetHeight;
  if (keepAspectRatio) {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    width = Math.max(1, Math.round(sourceWidth * scale));
    height = Math.max(1, Math.round(sourceHeight * scale));
  }
  if (width * height > maxPixels) return null;
  return { width, height };
}
