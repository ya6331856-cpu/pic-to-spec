export type CsvCleanerOptions = { trimWhitespace?: boolean; removeDuplicates?: boolean; spreadsheetSafe?: boolean };
export function cleanCsv(input: string, options?: CsvCleanerOptions): { csv: string; inputRows: number; outputRows: number; duplicatesRemoved: number; blankRowsRemoved: number; trimmedCells: number };
