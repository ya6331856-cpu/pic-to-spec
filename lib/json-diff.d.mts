export type JsonDiffKind = "Added" | "Removed" | "Changed" | "Type changed";

export type JsonDiffEntry = {
  path: string;
  pointer: string;
  kind: JsonDiffKind;
  before?: unknown;
  after?: unknown;
};

export function buildJsonDiff(before: unknown, after: unknown): JsonDiffEntry[];
export function createJsonDiffReport(differences: JsonDiffEntry[]): {
  tool: string;
  reportVersion: number;
  comparison: string;
  summary: {
    total: number;
    added: number;
    removed: number;
    changed: number;
    typeChanged: number;
  };
  differences: JsonDiffEntry[];
};
