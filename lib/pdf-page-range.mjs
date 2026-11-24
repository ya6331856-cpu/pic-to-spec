export function validatePdfPageRange(first, last, pageCount, maxPages = 30) {
  if (!Number.isInteger(first) || !Number.isInteger(last) || !Number.isInteger(pageCount) || first < 1 || last < first || last > pageCount) {
    return "Enter a valid page range between 1 and " + pageCount + ".";
  }
  if (!Number.isInteger(maxPages) || maxPages < 1 || last - first + 1 > maxPages) {
    return "Convert up to " + maxPages + " pages per download. Choose a smaller page range.";
  }
  return null;
}
