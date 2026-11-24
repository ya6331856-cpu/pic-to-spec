export type FormRequirement = {
  kind: "photo" | "signature";
  label: string;
  maxKB: number;
  width: number;
  height: number;
  format: "image/jpeg" | "image/png";
};
export function createDefaultFormRequirements(): FormRequirement[];
export function extractFormRequirements(text: string): FormRequirement[];
