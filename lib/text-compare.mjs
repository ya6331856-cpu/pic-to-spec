export function compareText(original, revised, maxCells = 1000000) {
  const split = value => {
    const normalized = String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n$/, "");
    return normalized === "" ? [] : normalized.split("\n");
  };
  const before = split(original);
  const after = split(revised);
  const cells = (before.length + 1) * (after.length + 1);
  if (cells > maxCells) throw new Error("This text is too large to compare at once. Split it into smaller sections and try again.");
  const table = Array.from({ length: before.length + 1 }, () => new Uint32Array(after.length + 1));
  for (let i = before.length - 1; i >= 0; i--) {
    for (let j = after.length - 1; j >= 0; j--) {
      table[i][j] = before[i] === after[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const lines = [];
  let i = 0, j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) { lines.push({ type: "unchanged", text: before[i] }); i++; j++; }
    else if (table[i + 1][j] >= table[i][j + 1]) { lines.push({ type: "removed", text: before[i] }); i++; }
    else { lines.push({ type: "added", text: after[j] }); j++; }
  }
  while (i < before.length) { lines.push({ type: "removed", text: before[i++] }); }
  while (j < after.length) { lines.push({ type: "added", text: after[j++] }); }
  return {
    lines,
    stats: {
      added: lines.filter(line => line.type === "added").length,
      removed: lines.filter(line => line.type === "removed").length,
      unchanged: lines.filter(line => line.type === "unchanged").length
    }
  };
}
