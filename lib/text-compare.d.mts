export type TextDiffLine = { type: "added" | "removed" | "unchanged"; text: string };
export function compareText(original: string, revised: string, maxCells?: number): { lines: TextDiffLine[]; stats: { added: number; removed: number; unchanged: number } };
