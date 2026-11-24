export function validatePdfStampRange(startPage, endPage, pageCount, maxPages = 500) {
  const first = typeof startPage === "string" ? Number(startPage.trim()) : Number(startPage);
  const last = typeof endPage === "string" ? Number(endPage.trim()) : Number(endPage);

  if (
    String(startPage).trim() === "" ||
    String(endPage).trim() === "" ||
    !Number.isInteger(first) ||
    !Number.isInteger(last) ||
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    first < 1 ||
    last < first ||
    last > pageCount
  ) {
    return "Enter a valid page range between 1 and " + pageCount + ".";
  }

  if (!Number.isInteger(maxPages) || maxPages < 1 || last - first + 1 > maxPages) {
    return "You can stamp up to " + maxPages + " pages per operation. Choose a smaller range.";
  }

  return null;
}

export function formatPdfPageLabel(currentPage, totalPages, format = "page-of") {
  if (
    !Number.isInteger(currentPage) ||
    !Number.isInteger(totalPages) ||
    currentPage < 1 ||
    totalPages < 1 ||
    currentPage > totalPages
  ) {
    throw new RangeError("Page number must be between 1 and the total page count.");
  }

  if (format === "number") return String(currentPage);
  if (format === "page") return "Page " + currentPage;
  if (format === "fraction") return currentPage + " / " + totalPages;
  if (format === "page-of") return "Page " + currentPage + " of " + totalPages;
  throw new RangeError("Choose a supported page-number format.");
}

export function validatePdfWatermarkText(value, maxLength = 80) {
  const text = String(value ?? "").trim();

  if (!text) return "Enter watermark text.";
  if (!Number.isInteger(maxLength) || maxLength < 1 || text.length > maxLength) {
    return "Watermark text must contain no more than " + maxLength + " characters.";
  }
  if (!/^[\x20-\x7E]+$/.test(text)) {
    return "Use basic English letters, numbers and punctuation for the watermark.";
  }

  return null;
}
