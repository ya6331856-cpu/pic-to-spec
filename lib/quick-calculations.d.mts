export type QuickKind = "gst" | "emi" | "percentage" | "discount" | "age";
export type QuickResult = string | { main: string; label: string; extra: string };
export function calculateQuickTool(kind: QuickKind, a: string, b: string, c: string, dob: string, gstMode: "intra" | "inter", now?: Date): QuickResult;
