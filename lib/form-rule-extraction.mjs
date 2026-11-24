/**
 * @typedef {"photo" | "signature"} RequirementKind
 * @typedef {"image/jpeg" | "image/png"} RequirementFormat
 * @typedef {{ kind: RequirementKind, label: string, maxKB: number, width: number, height: number, format: RequirementFormat }} Requirement
 */

/** @returns {Requirement[]} Fresh defaults for each form-rule session. */
export function createDefaultFormRequirements() {
  return [
    { kind: "photo", label: "Photo", maxKB: 50, width: 200, height: 230, format: "image/jpeg" },
    { kind: "signature", label: "Signature", maxKB: 20, width: 140, height: 60, format: "image/jpeg" }
  ];
}

/**
 * Extract only explicit, nearby photo/signature requirements.
 * Ambiguous dimensions without a pixel unit are intentionally ignored.
 * @param {string} text
 * @returns {Requirement[]}
 */
export function extractFormRequirements(text) {
  const lower = text.toLowerCase();
  const output = createDefaultFormRequirements();
  const labels = "(?:photograph|photo|passport|signature|sign)";
  const sizePattern = new RegExp("(" + labels + ")(?:(?!" + labels + ")[\\\\s\\\\S]){0,50}?(\\\\d{1,4})\\\\s*(kb|k\\\\s*b)", "g");
  for (const match of lower.matchAll(sizePattern)) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind);
    const value = Number(match[2]);
    if (target && value >= 5 && value <= 5000) target.maxKB = value;
  }

  const dimensionPattern = new RegExp("(" + labels + ")(?:(?!" + labels + ")[\\\\s\\\\S]){0,40}?(\\\\d{2,4})\\\\s*[x×*]\\\\s*(\\\\d{2,4})\\\\s*(px|pixels?)\\\\b", "g");
  for (const match of lower.matchAll(dimensionPattern)) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind);
    const width = Number(match[2]), height = Number(match[3]);
    if (target && width >= 20 && width <= 3000 && height >= 20 && height <= 3000) {
      target.width = width;
      target.height = height;
    }
  }

  const formatPattern = new RegExp("(" + labels + ")(?:(?!" + labels + ")[\\\\s\\\\S]){0,50}?(png only|png format|jpg only|jpeg only|jpg format|jpeg format)", "g");
  for (const match of lower.matchAll(formatPattern)) {
    const kind = /sign/.test(match[1]) ? "signature" : "photo";
    const target = output.find(item => item.kind === kind);
    if (target) target.format = /png/.test(match[2]) ? "image/png" : "image/jpeg";
  }
  return output;
}
