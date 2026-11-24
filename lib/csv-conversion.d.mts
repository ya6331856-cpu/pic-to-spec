export interface CsvOptions { delimiter?: string; flattenNested?: boolean; bom?: boolean; }
export function parseCsv(input: string, delimiter?: string): string[][];
export function toCsv(value: unknown, spreadsheetSafe?: boolean, options?: CsvOptions): string;
