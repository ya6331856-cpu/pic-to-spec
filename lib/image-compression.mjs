export async function findBestImageQuality(encode, byteLimit, iterations = 18) {
  if (typeof encode !== "function" || !Number.isFinite(byteLimit) || byteLimit < 1 || !Number.isInteger(iterations) || iterations < 1 || iterations > 40) {
    throw new TypeError("Invalid image quality search settings.");
  }
  const highest = await encode(0.96);
  if (!highest || !Number.isFinite(highest.size)) throw new Error("Image encoder did not return a valid Blob.");
  if (highest.size <= byteLimit) return highest;
  let low = 0.05, high = 0.96, best = null;
  for (let i = 0; i < iterations; i++) {
    const quality = (low + high) / 2;
    const candidate = await encode(quality);
    if (!candidate || !Number.isFinite(candidate.size)) throw new Error("Image encoder did not return a valid Blob.");
    if (candidate.size <= byteLimit) { best = candidate; low = quality; }
    else high = quality;
  }
  return best;
}
