export function validateImageFile(type, size) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return "Please choose a JPG, PNG or WebP image.";
  if (!Number.isFinite(size) || size < 0) return "The selected image has an invalid file size.";
  if (size > 20 * 1024 * 1024) return "Please choose an image smaller than 20 MB.";
  return null;
}
export function validateImageDimensions(width, height, max = 6000) {
  return Number.isInteger(width) && Number.isInteger(height) && width >= 1 && height >= 1 && width <= max && height <= max;
}
export function validateCropBounds(x, y, width, height, imageWidth, imageHeight) {
  return [x,y,width,height,imageWidth,imageHeight].every(Number.isInteger) &&
    x >= 0 && y >= 0 && width >= 1 && height >= 1 && imageWidth >= 1 && imageHeight >= 1 &&
    x < imageWidth && y < imageHeight && width <= imageWidth - x && height <= imageHeight - y;
}
