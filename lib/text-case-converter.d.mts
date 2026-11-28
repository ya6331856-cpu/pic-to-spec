export type TextCaseFormat =
  | "upper"
  | "lower"
  | "title"
  | "capitalize"
  | "sentence"
  | "toggle"
  | "alternating"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "spaces";

export function convertTextCase(text: string, format: TextCaseFormat): string;
export const CASE_FORMATS: readonly TextCaseFormat[];
