import { parseCsv } from "./csv-conversion.mjs";

export function cleanCsv(input, options = {}) {
  const { trimWhitespace = true, removeDuplicates = true, spreadsheetSafe = true } = options;
  const parsed = parseCsv(String(input));
  if (!parsed.length) throw new Error("The CSV file is empty or contains no readable rows.");
  const width = parsed[0].length;
  if (width < 1) throw new Error("The CSV file does not contain any columns.");
  const rows = parsed.map(row => {
    if (row.length !== width) throw new Error("Every CSV row must have the same number of columns. Check the row lengths and try again.");
    return row.map(cell => trimWhitespace ? cell.trim() : cell);
  });
  const headers = rows[0];
  if (headers.every(header => header === "")) throw new Error("The first row must contain column headings.");
  const dataRows = rows.slice(1);
  let blankRowsRemoved = 0;
  const nonBlankRows = dataRows.filter(row => {
    const blank = row.every(cell => cell === "");
    if (blank) blankRowsRemoved++;
    return !blank;
  });
  let duplicatesRemoved = 0;
  const seen = new Set();
  const uniqueRows = nonBlankRows.filter(row => {
    const key = JSON.stringify(row);
    if (removeDuplicates && seen.has(key)) { duplicatesRemoved++; return false; }
    seen.add(key);
    return true;
  });
  const safeCell = value => {
    let cell = String(value ?? "");
    if (spreadsheetSafe && /^\s*[=+@-]/.test(cell)) cell = "'" + cell;
    return /[",\r\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell;
  };
  const csv = [headers, ...uniqueRows].map(row => row.map(safeCell).join(",")).join("\r\n");
  return {
    csv,
    inputRows: dataRows.length,
    outputRows: uniqueRows.length,
    duplicatesRemoved,
    blankRowsRemoved,
    trimmedCells: trimWhitespace ? parsed.reduce((count, row) => count + row.filter(cell => cell !== cell.trim()).length, 0) : 0
  };
}
