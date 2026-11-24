export type PdfPageNumberFormat = "number" | "page" | "page-of" | "fraction";

export function validatePdfStampRange(
  startPage: string | number,
  endPage: string | number,
  pageCount: number,
  maxPages?: number
): string | null;

export function formatPdfPageLabel(
  currentPage: number,
  totalPages: number,
  format?: PdfPageNumberFormat
): string;

export function validatePdfWatermarkText(value: string, maxLength?: number): string | null;
