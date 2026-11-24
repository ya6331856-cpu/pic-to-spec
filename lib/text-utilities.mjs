export function sortTextLines(text, order = "ascending", ignoreCase = false) {
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
  return lines.sort((a, b) => {
    const left = ignoreCase ? a.toLocaleLowerCase() : a;
    const right = ignoreCase ? b.toLocaleLowerCase() : b;
    const result = left.localeCompare(right, undefined, { numeric: true, sensitivity: ignoreCase ? "base" : "variant" });
    return order === "descending" ? -result : result;
  }).join("\n");
}
export function removeDuplicateLines(text, ignoreCase = false, trimLines = false, removeEmpty = false) {
  const seen = new Set();
  const output = [];
  for (const original of String(text).replace(/\r\n?/g, "\n").split("\n")) {
    const line = trimLines ? original.trim() : original;
    if (removeEmpty && line.trim() === "") continue;
    const key = ignoreCase ? line.toLocaleLowerCase() : line;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(line);
  }
  return output.join("\n");
}
export function reverseTextLines(text) {
  return String(text).replace(/\r\n?/g, "\n").split("\n").reverse().join("\n");
}
